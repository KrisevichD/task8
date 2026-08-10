import { useMutation } from "@apollo/client/react";
import { act, renderHook } from "@testing-library/react";
import { useRouter } from "next/navigation";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockedFunction,
} from "vitest";

import useCreateCv from "./useCreateCv";

import { ICreateCvVariables } from "@/types/cvs";

vi.mock("@apollo/client/react", () => ({
  useMutation: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("useCreateCv Hook", () => {
  const mockPush = vi.fn();
  const mockExecuteCreateCv = vi.fn();
  const dummyMutation = {} as any;

  const mockVariables: ICreateCvVariables = {
    cv: {
      userId: "user-123",
      name: "Senior Frontend Engineer CV",
      description: "React and Next.js expert profile",
      education: "BSU",
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    (useRouter as unknown as MockedFunction<typeof useRouter>).mockReturnValue({
      push: mockPush,
    } as any);

    (
      useMutation as unknown as MockedFunction<typeof useMutation>
    ).mockReturnValue([mockExecuteCreateCv, { loading: false }] as any);
  });

  describe("Initialization", () => {
    it("should initialize with default states", () => {
      const { result } = renderHook(() => useCreateCv(dummyMutation));

      expect(result.current.isLoading).toBe(false);
      expect(result.current.errorText).toBe("");
    });
  });

  describe("Successful Operations", () => {
    it("should call executeCreateCv with arguments and navigate on success", async () => {
      mockExecuteCreateCv.mockResolvedValueOnce({
        data: {
          createCv: {
            id: "new-cv-789",
            name: "Senior Frontend Engineer CV",
          },
        },
      });

      const { result } = renderHook(() => useCreateCv(dummyMutation));

      await act(async () => {
        await result.current.createCv(mockVariables);
      });

      expect(mockExecuteCreateCv).toHaveBeenCalledWith({
        variables: mockVariables,
      });
      expect(mockPush).toHaveBeenCalledWith("/cvs/new-cv-789");
      expect(result.current.errorText).toBe("");
    });
  });

  describe("Error Handling", () => {
    it("should catch operational Apollo error responses and update errorText state", async () => {
      mockExecuteCreateCv.mockResolvedValueOnce({
        error: {
          message: "GraphQL operational failure context",
        },
      });

      const { result } = renderHook(() => useCreateCv(dummyMutation));

      // ✅ FIX: Await the promise verification inside reject assertions directly to clear thread locks
      await act(async () => {
        await expect(result.current.createCv(mockVariables)).rejects.toThrow(
          "GraphQL operational failure context",
        );
      });

      expect(result.current.errorText).toBe(
        "GraphQL operational failure context",
      );
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("should capture missing data objects and throw an absolute boundary error", async () => {
      mockExecuteCreateCv.mockResolvedValueOnce({
        data: null,
      });

      const { result } = renderHook(() => useCreateCv(dummyMutation));

      await act(async () => {
        await expect(result.current.createCv(mockVariables)).rejects.toThrow(
          "No data",
        );
      });

      expect(result.current.errorText).toBe("No data");
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("should handle unexpected critical execution promise rejections gracefully", async () => {
      mockExecuteCreateCv.mockRejectedValueOnce(
        new Error("Network connection dropped"),
      );

      const { result } = renderHook(() => useCreateCv(dummyMutation));

      await act(async () => {
        await expect(result.current.createCv(mockVariables)).rejects.toThrow(
          "Network connection dropped",
        );
      });

      expect(result.current.errorText).toBe("Network connection dropped");
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("should fallback cleanly if the caught exception is not an instance of Error", async () => {
      mockExecuteCreateCv.mockRejectedValueOnce(
        "String rejection event exception",
      );

      const { result } = renderHook(() => useCreateCv(dummyMutation));

      await act(async () => {
        await expect(result.current.createCv(mockVariables)).rejects.toBe(
          "String rejection event exception",
        );
      });

      expect(result.current.errorText).toBe("Unknown error");
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("should clear out the previous errorText on consecutive submissions", async () => {
      mockExecuteCreateCv.mockRejectedValueOnce(
        new Error("First attempt error"),
      );

      const { result } = renderHook(() => useCreateCv(dummyMutation));

      await act(async () => {
        await expect(result.current.createCv(mockVariables)).rejects.toThrow(
          "First attempt error",
        );
      });

      expect(result.current.errorText).toBe("First attempt error");

      // Setup consecutive request to pass perfectly
      mockExecuteCreateCv.mockResolvedValueOnce({
        data: { createCv: { id: "cv-ok" } },
      });

      await act(async () => {
        await result.current.createCv(mockVariables);
      });

      expect(result.current.errorText).toBe("");
    });
  });
});
