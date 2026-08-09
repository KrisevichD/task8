import { useMutation } from "@apollo/client/react";
import { act, renderHook } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";

import useCreateCv from "../useCreateCv";

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
  const mockMutation = {} as any;

  const mockVariables: ICreateCvVariables = {
    cv: {
      name: "New Developer CV",
      education: "University",
      description: "Description",
    },
  } as unknown as ICreateCvVariables;

  beforeEach(() => {
    vi.clearAllMocks();

    (useRouter as ReturnType<typeof vi.fn>).mockReturnValue({
      push: mockPush,
    });

    (useMutation as ReturnType<typeof vi.fn>).mockReturnValue([
      mockExecuteCreateCv,
      { loading: false },
    ]);
  });

  describe("Successful Creation", () => {
    it("creates CV successfully and redirects to newly created CV page", async () => {
      mockExecuteCreateCv.mockResolvedValueOnce({
        data: {
          createCv: { id: "cv-123" },
        },
      });

      const { result } = renderHook(() => useCreateCv(mockMutation));

      await act(async () => {
        await result.current.createCv(mockVariables);
      });

      expect(mockExecuteCreateCv).toHaveBeenCalledWith({
        variables: mockVariables,
      });
      expect(mockPush).toHaveBeenCalledWith("/cvs/cv-123");
      expect(result.current.errorText).toBe("");
    });
  });

  describe("Error Handling", () => {
    it("sets errorText and throws error when result contains GraphQL error", async () => {
      mockExecuteCreateCv.mockResolvedValueOnce({
        error: { message: "Failed to create CV" },
      });

      const { result } = renderHook(() => useCreateCv(mockMutation));

      await act(async () => {
        await expect(result.current.createCv(mockVariables)).rejects.toThrow(
          "Failed to create CV",
        );
      });

      expect(result.current.errorText).toBe("Failed to create CV");
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("throws 'No data' error when result data is empty", async () => {
      mockExecuteCreateCv.mockResolvedValueOnce({
        data: null,
      });

      const { result } = renderHook(() => useCreateCv(mockMutation));

      await act(async () => {
        await expect(result.current.createCv(mockVariables)).rejects.toThrow(
          "No data",
        );
      });

      expect(result.current.errorText).toBe("No data");
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("catches network or thrown errors and updates errorText", async () => {
      mockExecuteCreateCv.mockRejectedValueOnce(new Error("Network Failure"));

      const { result } = renderHook(() => useCreateCv(mockMutation));

      await act(async () => {
        await expect(result.current.createCv(mockVariables)).rejects.toThrow(
          "Network Failure",
        );
      });

      expect(result.current.errorText).toBe("Network Failure");
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
