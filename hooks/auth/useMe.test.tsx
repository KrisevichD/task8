import { useQuery } from "@apollo/client/react";
import { renderHook } from "@testing-library/react";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockedFunction,
} from "vitest";

import { useMe } from "./useMe";

import { GET_USER } from "@/graphql/user/queries";
import { getUserIdFromToken } from "@/utils/jwt";

vi.mock("@apollo/client/react", () => ({
  useQuery: vi.fn(),
}));

vi.mock("@/utils/jwt", () => ({
  getUserIdFromToken: vi.fn(),
}));

describe("useMe Hook", () => {
  const mockUserData = {
    user: {
      id: "u-123",
      email: "jane.doe@example.com",
      position_name: "Lead Frontend Engineer",
      profile: {
        first_name: "Jane",
        last_name: "Doe",
        avatar: "https://example.com",
        skills: [{ name: "React", mastery: "Expert" }],
        languages: [{ name: "English", proficiency: "Native" }],
      },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    (
      getUserIdFromToken as unknown as MockedFunction<typeof getUserIdFromToken>
    ).mockReturnValue("token-user-id");

    (useQuery as unknown as MockedFunction<typeof useQuery>).mockReturnValue({
      data: mockUserData,
      loading: false,
      error: null,
    } as any);
  });

  describe("Initialization & Variable Binding Priorities", () => {
    it("should prioritize customUserId if provided over the token value", () => {
      renderHook(() => useMe("custom-override-id"));

      expect(getUserIdFromToken).toHaveBeenCalled();
      expect(useQuery).toHaveBeenCalledWith(
        GET_USER,
        expect.objectContaining({
          variables: { userId: "custom-override-id" },
          skip: false,
        }),
      );
    });

    it("should fall back to tokenUserId represented as a string if no custom parameter arrives", () => {
      renderHook(() => useMe());

      expect(useQuery).toHaveBeenCalledWith(
        GET_USER,
        expect.objectContaining({
          variables: { userId: "token-user-id" },
          skip: false,
        }),
      );
    });

    it("should safely append skip rule configuration parameters if user identifiers are absent", () => {
      (
        getUserIdFromToken as unknown as MockedFunction<
          typeof getUserIdFromToken
        >
      ).mockReturnValue(undefined as any);

      (
        useQuery as unknown as MockedFunction<typeof useQuery>
      ).mockReturnValueOnce({
        data: undefined,
        loading: false,
        error: null,
      } as any);

      const { result } = renderHook(() => useMe());

      expect(useQuery).toHaveBeenCalledWith(
        GET_USER,
        expect.objectContaining({
          skip: true,
        }),
      );
      expect(result.current.user).toBeUndefined();
    });
  });

  describe("Profile Property Formatter Assertions", () => {
    it("should correctly concatenate full name components and pull matching array lists references", () => {
      const { result } = renderHook(() => useMe());

      expect(result.current.user).toEqual(mockUserData.user);
      expect(result.current.fullName).toBe("Jane Doe");
      expect(result.current.initials).toBe("JD");
      expect(result.current.positionName).toBe("Lead Frontend Engineer");
      expect(result.current.avatarUrl).toBe("https://example.com");
      expect(result.current.skills).toEqual(mockUserData.user.profile.skills);
      expect(result.current.languages).toEqual(
        mockUserData.user.profile.languages,
      );
    });

    it("should fall back gracefully to the account email address if profile names strings are missing", () => {
      (useQuery as unknown as MockedFunction<typeof useQuery>).mockReturnValue({
        data: {
          user: {
            email: "anonymous@test.com",
            profile: { first_name: "", last_name: "" },
          },
        },
        loading: false,
      } as any);

      const { result } = renderHook(() => useMe());

      expect(result.current.fullName).toBe("anonymous@test.com");
      expect(result.current.initials).toBe("A");
    });

    it("should fallback cleanly onto hardcoded defaults if first_name, last_name, and email are all missing", () => {
      (useQuery as unknown as MockedFunction<typeof useQuery>).mockReturnValue({
        data: {
          user: {
            email: "",
            profile: { first_name: "", last_name: "" },
          },
        },
        loading: false,
      } as any);

      const { result } = renderHook(() => useMe());

      expect(result.current.fullName).toBe("User");
      expect(result.current.initials).toBe("U");
    });
  });

  describe("Loading State Constraints", () => {
    it("should set isLoading to true ONLY when query is loading and no cache data is present", () => {
      (useQuery as unknown as MockedFunction<typeof useQuery>).mockReturnValue({
        data: null,
        loading: true,
        error: null,
      } as any);

      const { result } = renderHook(() => useMe());
      expect(result.current.isLoading).toBe(true);
    });

    it("should set isLoading to false if query is loading but cache data is actively available", () => {
      (useQuery as unknown as MockedFunction<typeof useQuery>).mockReturnValue({
        data: mockUserData,
        loading: true,
        error: null,
      } as any);

      const { result } = renderHook(() => useMe());
      expect(result.current.isLoading).toBe(false);
    });
  });
});
