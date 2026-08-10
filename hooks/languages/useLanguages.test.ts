import { useLazyQuery, useMutation } from "@apollo/client/react";
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

import { useMe } from "../auth/useMe";

import useLanguages from "./useLanguages";

import { IProfileLanguage } from "@/types/languages";
import { getUserIdFromToken } from "@/utils/jwt";

vi.mock("@apollo/client/react", () => ({
  useLazyQuery: vi.fn(),
  useMutation: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    promise: vi.fn(),
  },
}));

vi.mock("../auth/useMe", () => ({
  useMe: vi.fn(),
}));

vi.mock("@/utils/jwt", () => ({
  getUserIdFromToken: vi.fn(),
}));

describe("useLanguages Hook", () => {
  const mockGetAllLanguages = vi.fn();
  const mockExecuteAddProfileLanguage = vi.fn();
  const mockExecuteUpdateProfileLanguage = vi.fn();
  const mockExecuteDeleteProfileLanguages = vi.fn();

  const mockProfileLanguages: IProfileLanguage[] = [
    { name: "English", proficiency: "Native" } as unknown as IProfileLanguage,
  ];

  const mockAllLanguages = {
    languages: [{ name: "English" }, { name: "German" }, { name: "Spanish" }],
  };

  beforeEach(() => {
    vi.clearAllMocks();

    (
      getUserIdFromToken as unknown as MockedFunction<typeof getUserIdFromToken>
    ).mockReturnValue("user-token-123");

    (useMe as unknown as MockedFunction<typeof useMe>).mockReturnValue({
      languages: mockProfileLanguages,
    } as any);

    (
      useLazyQuery as unknown as MockedFunction<typeof useLazyQuery>
    ).mockReturnValue([
      mockGetAllLanguages,
      { data: mockAllLanguages, loading: false },
    ] as any);

    // ✅ FIX: Configure each mutation mock trigger to explicitly return a resolved promise
    mockExecuteAddProfileLanguage.mockResolvedValue({ data: {} });
    mockExecuteUpdateProfileLanguage.mockResolvedValue({ data: {} });
    mockExecuteDeleteProfileLanguages.mockResolvedValue({ data: {} });

    (useMutation as unknown as MockedFunction<typeof useMutation>)
      .mockReturnValueOnce([
        mockExecuteAddProfileLanguage,
        { loading: false },
      ] as any)
      .mockReturnValueOnce([
        mockExecuteUpdateProfileLanguage,
        { loading: false },
      ] as any)
      .mockReturnValueOnce([
        mockExecuteDeleteProfileLanguages,
        { loading: false },
      ] as any);
  });

  describe("Initialization & Filtering", () => {
    it("uses customUserId if provided, otherwise falls back to token", () => {
      renderHook(() => useLanguages("custom-user-777"));
      expect(useMe).toHaveBeenCalledWith("custom-user-777");
    });

    it("filters out already added profile languages from all available languages", () => {
      const { result } = renderHook(() => useLanguages(""));

      expect(result.current.filteredLanguages).toEqual([
        { name: "German" },
        { name: "Spanish" },
      ]);
    });
  });

  describe("Mutations", () => {
    it("addProfileLanguage calls mutation with correct variables and toast.promise", () => {
      const { result } = renderHook(() => useLanguages("user-123"));

      const newLanguage: IProfileLanguage = {
        name: "German",
        proficiency: "B2",
      } as unknown as IProfileLanguage;

      act(() => {
        result.current.addProfileLanguage(newLanguage);
      });

      expect(mockExecuteAddProfileLanguage).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: {
            language: {
              userId: "user-123",
              ...newLanguage,
            },
          },
        }),
      );

      expect(toast.promise).toHaveBeenCalledWith(
        expect.any(Promise),
        expect.objectContaining({
          loading: "Adding language...",
          success: "Language successfully added!",
          position: "top-right",
        }),
      );
    });

    it("updateProfileLanguage calls update mutation and toast.promise", () => {
      const { result } = renderHook(() => useLanguages("user-123"));

      const updatedLanguage: IProfileLanguage = {
        name: "English",
        proficiency: "C2",
      } as unknown as IProfileLanguage;

      act(() => {
        result.current.updateProfileLanguage(updatedLanguage);
      });

      expect(mockExecuteUpdateProfileLanguage).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: {
            language: {
              userId: "user-123",
              ...updatedLanguage,
            },
          },
        }),
      );

      expect(toast.promise).toHaveBeenCalledWith(
        expect.any(Promise),
        expect.objectContaining({
          loading: "Updating language...",
          success: "Language successfully updated!",
          position: "top-right",
        }),
      );
    });

    it("deleteProfileLanguages calls delete mutation with array of names", () => {
      const { result } = renderHook(() => useLanguages("user-123"));

      act(() => {
        result.current.deleteProfileLanguages(["English"]);
      });

      expect(mockExecuteDeleteProfileLanguages).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: {
            language: {
              userId: "user-123",
              name: ["English"],
            },
          },
        }),
      );

      expect(toast.promise).toHaveBeenCalledWith(
        expect.any(Promise),
        expect.objectContaining({
          loading: "Deleting language...",
          success: "Language successfully deleted!",
          position: "top-right",
        }),
      );
    });

    it("does not trigger mutations if userId is empty", () => {
      (
        getUserIdFromToken as unknown as MockedFunction<
          typeof getUserIdFromToken
        >
      ).mockReturnValue("");

      const { result } = renderHook(() => useLanguages(""));

      act(() => {
        result.current.addProfileLanguage({ name: "French" } as any);
        result.current.updateProfileLanguage({ name: "French" } as any);
        result.current.deleteProfileLanguages(["French"]);
      });

      expect(mockExecuteAddProfileLanguage).not.toHaveBeenCalled();
      expect(mockExecuteUpdateProfileLanguage).not.toHaveBeenCalled();
      expect(mockExecuteDeleteProfileLanguages).not.toHaveBeenCalled();
    });
  });
});
