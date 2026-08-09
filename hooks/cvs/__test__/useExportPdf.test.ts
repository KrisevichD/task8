import { useMutation } from "@apollo/client/react";
import { act, renderHook } from "@testing-library/react";
import { toast } from "sonner";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockedFunction,
} from "vitest";

import useExportPdf from "../useExportPdf";

vi.mock("@apollo/client/react", () => ({
  useMutation: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("useExportPdf Hook", () => {
  const mockGetExportedPdf = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (
      useMutation as unknown as MockedFunction<typeof useMutation>
    ).mockReturnValue([mockGetExportedPdf as any, { loading: false }]);

    // Мокаем глобальные утилиты браузера для скачивания файлов
    global.URL.createObjectURL = vi.fn(() => "blob:http://localhost/mock-url");
    global.URL.revokeObjectURL = vi.fn();
    global.atob = vi.fn(() => "mockBinaryString");
  });

  it("does nothing if printRef.current is null", async () => {
    const { result } = renderHook(() => useExportPdf());

    await act(async () => {
      await result.current.handleDownloadPdf();
    });

    expect(mockGetExportedPdf).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("collects HTML & styles from printRef and downloads PDF on success", async () => {
    const mockBase64 = "data:application/pdf;base64,JVBERi0xLjQK...";
    mockGetExportedPdf.mockResolvedValueOnce({
      data: { exportPdf: mockBase64 },
    });

    const styleElement = document.createElement("style");
    styleElement.innerHTML = ".test-class { color: red; }";
    document.head.appendChild(styleElement);

    const { result } = renderHook(() => useExportPdf());

    const divContainer = document.createElement("div");
    divContainer.innerHTML = "<p>CV Content</p>";
    Object.defineProperty(result.current.printRef, "current", {
      value: divContainer,
      writable: true,
    });

    const appendChildSpy = vi.spyOn(document.body, "appendChild");
    const removeChildSpy = vi.spyOn(document.body, "removeChild");

    await act(async () => {
      await result.current.handleDownloadPdf();
    });

    expect(mockGetExportedPdf).toHaveBeenCalledWith({
      variables: {
        pdf: {
          html: expect.stringContaining("<p>CV Content</p>"),
          margin: {
            top: "15mm",
            bottom: "15mm",
            left: "15mm",
            right: "15mm",
          },
        },
      },
    });

    expect(global.atob).toHaveBeenCalled();
    expect(global.URL.createObjectURL).toHaveBeenCalled();
    expect(appendChildSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();
    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith(
      "blob:http://localhost/mock-url",
    );

    expect(toast.success).toHaveBeenCalledWith("PDF successfully downloaded!");

    document.head.removeChild(styleElement);
  });

  it("shows toast error when data.exportPdf is missing", async () => {
    mockGetExportedPdf.mockResolvedValueOnce({
      data: null,
    });

    const { result } = renderHook(() => useExportPdf());

    const divContainer = document.createElement("div");
    divContainer.innerHTML = "<p>CV Content</p>";
    Object.defineProperty(result.current.printRef, "current", {
      value: divContainer,
      writable: true,
    });

    await act(async () => {
      await result.current.handleDownloadPdf();
    });

    expect(toast.error).toHaveBeenCalledWith("Failed to generate PDF");
  });

  it("catches thrown error and shows toast error", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockGetExportedPdf.mockRejectedValueOnce(new Error("Mutation failed"));

    const { result } = renderHook(() => useExportPdf());

    const divContainer = document.createElement("div");
    divContainer.innerHTML = "<p>CV Content</p>";
    Object.defineProperty(result.current.printRef, "current", {
      value: divContainer,
      writable: true,
    });

    await act(async () => {
      await result.current.handleDownloadPdf();
    });

    expect(toast.error).toHaveBeenCalledWith("An error occurred during export");
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});
