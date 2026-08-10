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

import useExportPdf from "./useExportPdf";

// ✅ No manual useLanguage mock needed! Inherited globally from your setup configuration.

vi.mock("@apollo/client/react", () => ({
  useMutation: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    promise: vi.fn(),
  },
}));

describe("useExportPdf Hook", () => {
  const mockGetExportedPdf = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (
      useMutation as unknown as MockedFunction<typeof useMutation>
    ).mockReturnValue([mockGetExportedPdf, { loading: false }] as any);

    if (typeof window !== "undefined") {
      window.URL.createObjectURL = vi.fn(
        () => "blob:http://localhost/mock-pdf",
      );
      window.URL.revokeObjectURL = vi.fn();
    }
  });

  describe("Initialization", () => {
    it("should initialize default parameters correctly", () => {
      const { result } = renderHook(() => useExportPdf());

      expect(result.current.printRef).toBeDefined();
      expect(result.current.printRef.current).toBeNull();
      expect(result.current.isExporting).toBe(false);
    });
  });

  describe("PDF Generation and Download Flows", () => {
    it("should abort operation immediately if printRef container element is missing", async () => {
      const { result } = renderHook(() => useExportPdf());

      await act(async () => {
        await result.current.handleDownloadPdf();
      });

      expect(mockGetExportedPdf).not.toHaveBeenCalled();
      expect(toast.promise).not.toHaveBeenCalled();
    });

    it("should successfully extract DOM tree structures, compile layout payload styles, and invoke export mutation", async () => {
      const { result } = renderHook(() => useExportPdf());

      const mockContainer = document.createElement("div");
      mockContainer.innerHTML = "<h1>John Doe Resume</h1><p>Frontend Dev</p>";

      const mockStyle = document.createElement("style");
      mockStyle.innerHTML = ".resume { color: blue; }";
      document.head.appendChild(mockStyle);

      Object.defineProperty(result.current.printRef, "current", {
        value: mockContainer,
        writable: true,
      });

      const fakeBase64Payload = "data:application/pdf;base64,SGVsbG8gV29ybGQ=";

      const mockPromise = Promise.resolve({
        data: { exportPdf: fakeBase64Payload },
      });
      mockGetExportedPdf.mockReturnValueOnce(mockPromise);

      const appendSpy = vi.spyOn(document.body, "appendChild");
      const removeSpy = vi.spyOn(document.body, "removeChild");

      await act(async () => {
        await result.current.handleDownloadPdf();
      });

      expect(mockGetExportedPdf).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: {
            pdf: expect.objectContaining({
              html: expect.stringContaining("<h1>John Doe Resume</h1>"),
              margin: {
                top: "15mm",
                bottom: "15mm",
                left: "15mm",
                right: "15mm",
              },
            }),
          },
        }),
      );

      expect(mockGetExportedPdf).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: {
            pdf: expect.objectContaining({
              html: expect.stringContaining(".resume { color: blue; }"),
            }),
          },
        }),
      );

      // ✅ FIX: Aligned with lowercase 'successfully' and uppercase 'Downloaded' from translations.en
      expect(toast.promise).toHaveBeenCalledWith(
        mockPromise,
        expect.objectContaining({
          loading: "Downloading PDF...",
          success: "PDF successfully Downloaded!",
          position: "top-right",
        }),
      );

      expect(appendSpy).toHaveBeenCalled();
      expect(removeSpy).toHaveBeenCalled();
      expect(window.URL.revokeObjectURL).toHaveBeenCalledWith(
        "blob:http://localhost/mock-pdf",
      );

      document.head.removeChild(mockStyle);
    });

    it("should process error messages gracefully matching error dictionary formats", async () => {
      const { result } = renderHook(() => useExportPdf());

      const mockContainer = document.createElement("div");
      mockContainer.innerHTML = "<div>Error Content</div>";

      Object.defineProperty(result.current.printRef, "current", {
        value: mockContainer,
        writable: true,
      });

      const mockPromise = Promise.reject(
        new Error("PDF compilation timeout constraint reached"),
      );
      mockGetExportedPdf.mockReturnValueOnce(mockPromise);

      try {
        await act(async () => {
          await result.current.handleDownloadPdf();
        });
      } catch (err) {
        expect((err as Error).message).toBe(
          "PDF compilation timeout constraint reached",
        );
      }

      const toastOptions = (
        toast.promise as MockedFunction<typeof toast.promise>
      ).mock.calls[0]?.[1];

      if (typeof toastOptions?.error === "function") {
        // ✅ FIX: Clean string token check for "Error: message" formatting logic
        const errorMessage = toastOptions.error(
          new Error("PDF compilation timeout constraint reached"),
        );
        expect(errorMessage).toBe(
          "Error: PDF compilation timeout constraint reached",
        );
      } else {
        throw new Error(
          "error property inside toast.promise configuration is not a function",
        );
      }
    });
  });
});
