import { useMutation } from "@apollo/client/react";
import { act, renderHook } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockedFunction,
} from "vitest";

import { useMe } from "../auth/useMe";

import useCreateCv from "./useCreateCv";

import { useLanguage } from "@/context/language";

vi.mock("@apollo/client/react", () => ({
  useMutation: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    promise: vi.fn(),
  },
}));

vi.mock("../auth/useMe", () => ({
  useMe: vi.fn(),
}));

vi.mock("@/context/language", () => ({
  useLanguage: vi.fn(),
}));

describe("useCreateCv Hook", () => {
  const mockPush = vi.fn();
  const mockExecuteCreateCv = vi.fn();
  const mockT = vi.fn((key: string) => key);
  const mockMutation = {} as any;

  const mockInput = {
    name: "Frontend Developer CV",
    education: "University",
    description: "Description text",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    (useRouter as unknown as MockedFunction<typeof useRouter>).mockReturnValue({
      push: mockPush,
    } as any);

    (
      useLanguage as unknown as MockedFunction<typeof useLanguage>
    ).mockReturnValue({
      t: mockT,
    } as any);

    (useMe as unknown as MockedFunction<typeof useMe>).mockReturnValue({
      user: { id: "user-123" },
    } as any);

    (
      useMutation as unknown as MockedFunction<typeof useMutation>
    ).mockReturnValue([mockExecuteCreateCv, { loading: false }] as any);
  });

  describe("Successful Creation", () => {
    it("creates CV successfully, calls toast.promise and redirects to CV details page", async () => {
      const mockResult = {
        data: {
          createCv: { id: "cv-777" },
        },
      };
      const mockPromise = Promise.resolve(mockResult);
      mockExecuteCreateCv.mockReturnValue(mockPromise);

      const { result } = renderHook(() => useCreateCv(mockMutation));

      await act(async () => {
        await result.current.createCv(mockInput);
      });

      expect(mockExecuteCreateCv).toHaveBeenCalledWith({
        variables: {
          cv: {
            userId: "user-123",
            ...mockInput,
          },
        },
      });

      expect(toast.promise).toHaveBeenCalledWith(
        mockPromise,
        expect.objectContaining({
          position: "top-right",
        }),
      );

      expect(mockPush).toHaveBeenCalledWith("/cvs/cv-777");
      expect(result.current.errorText).toBe("");
    });
  });

  describe("Edge Cases & Errors", () => {
    it("does nothing if userId is missing", async () => {
      (useMe as unknown as MockedFunction<typeof useMe>).mockReturnValue({
        user: null,
      } as any);

      const { result } = renderHook(() => useCreateCv(mockMutation));

      await act(async () => {
        await result.current.createCv(mockInput);
      });

      expect(mockExecuteCreateCv).not.toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("sets errorText and throws an error when GraphQL error is returned", async () => {
      const mockResult = {
        error: { message: "GraphQL Error Occurred" },
      };
      mockExecuteCreateCv.mockReturnValue(Promise.resolve(mockResult));

      const { result } = renderHook(() => useCreateCv(mockMutation));

      await act(async () => {
        await expect(result.current.createCv(mockInput)).rejects.toThrow(
          "GraphQL Error Occurred",
        );
      });

      expect(result.current.errorText).toBe("GraphQL Error Occurred");
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("throws 'No data' error when mutation returns empty data", async () => {
      mockExecuteCreateCv.mockReturnValue(Promise.resolve({ data: null }));

      const { result } = renderHook(() => useCreateCv(mockMutation));

      await act(async () => {
        await expect(result.current.createCv(mockInput)).rejects.toThrow(
          "No data",
        );
      });

      expect(result.current.errorText).toBe("No data");
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("handles rejected promise network errors", async () => {
      mockExecuteCreateCv.mockReturnValue(
        Promise.reject(new Error("Network failed")),
      );

      const { result } = renderHook(() => useCreateCv(mockMutation));

      await act(async () => {
        await expect(result.current.createCv(mockInput)).rejects.toThrow(
          "Network failed",
        );
      });

      expect(result.current.errorText).toBe("Network failed");
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
