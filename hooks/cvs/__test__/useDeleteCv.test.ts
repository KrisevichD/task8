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

import { useDeleteCv } from "../useDeleteCv";

import { DELETE_CV_MUTATION } from "@/graphql/cvs/mutations";
import { GET_CVS } from "@/graphql/cvs/queries";

vi.mock("@apollo/client/react", () => ({
  useMutation: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    promise: vi.fn(),
  },
}));

describe("useDeleteCv Hook", () => {
  const mockDeleteCvMutation = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (
      useMutation as unknown as MockedFunction<typeof useMutation>
    ).mockReturnValue([mockDeleteCvMutation as any]);
  });

  it("initializes useMutation with DELETE_CV_MUTATION and refetchQueries GET_CVS", () => {
    renderHook(() => useDeleteCv());

    expect(useMutation).toHaveBeenCalledWith(DELETE_CV_MUTATION, {
      refetchQueries: [{ query: GET_CVS }],
    });
  });

  it("calls deleteCvMutation with correct variables when deleteCv is invoked", async () => {
    const mockResponse = { data: { deleteCv: true } };
    const mockPromise = Promise.resolve(mockResponse);
    mockDeleteCvMutation.mockReturnValue(mockPromise);

    const { result } = renderHook(() => useDeleteCv());

    let returnedPromise: Promise<any> = Promise.resolve();
    await act(async () => {
      returnedPromise = result.current.deleteCv("cv-123");
    });

    expect(mockDeleteCvMutation).toHaveBeenCalledWith({
      variables: {
        cv: {
          cvId: "cv-123",
        },
      },
    });

    await expect(returnedPromise).resolves.toEqual(mockResponse);
  });

  it("triggers toast.promise with correct options", async () => {
    const mockPromise = Promise.resolve({ data: { deleteCv: true } });
    mockDeleteCvMutation.mockReturnValue(mockPromise);

    const { result } = renderHook(() => useDeleteCv());

    await act(async () => {
      await result.current.deleteCv("cv-123");
    });

    expect(toast.promise).toHaveBeenCalledWith(
      mockPromise,
      expect.objectContaining({
        loading: "Deleting CV...",
        success: "Successfully deleted",
        position: "top-right",
      }),
    );
  });

  it("handles error callback in toast.promise options", async () => {
    const mockPromise = Promise.reject(new Error("Network Error"));
    mockDeleteCvMutation.mockReturnValue(mockPromise);

    const { result } = renderHook(() => useDeleteCv());

    await act(async () => {
      await result.current.deleteCv("cv-123").catch(() => {});
    });

    const toastOptions = (toast.promise as MockedFunction<typeof toast.promise>)
      .mock.calls[0]?.[1];

    if (typeof toastOptions?.error === "function") {
      const errorMessage = toastOptions.error(new Error("Network Error"));
      expect(errorMessage).toBe("Network Error");

      const fallbackMessage = toastOptions.error({} as Error);
      expect(fallbackMessage).toBe("Failed to delete CV");
    }
  });
});
