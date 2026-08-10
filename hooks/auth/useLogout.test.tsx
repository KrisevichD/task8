import { useApolloClient } from "@apollo/client/react";
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

import { useLogout } from "./useLogout";

vi.mock("@apollo/client/react", () => ({
  useApolloClient: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("useLogout Hook", () => {
  const mockPush = vi.fn();
  const mockRefresh = vi.fn();
  const mockClearStore = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useRouter as unknown as MockedFunction<typeof useRouter>).mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
    } as any);

    mockClearStore.mockResolvedValue(undefined);
    (
      useApolloClient as unknown as MockedFunction<typeof useApolloClient>
    ).mockReturnValue({
      clearStore: mockClearStore,
    } as any);

    if (typeof document !== "undefined") {
      document.cookie = "access_token=mock-token; path=/";
      document.cookie = "refresh_token=mock-refresh-token; path=/";
    }

    localStorage.setItem("access_token", "mock-token");
    localStorage.setItem("refresh_token", "mock-refresh-token");
  });

  describe("Execution Flows", () => {
    it("should accurately wipe cookies and localStorage parameters on logout execution", () => {
      const { result } = renderHook(() => useLogout());

      act(() => {
        result.current.logout();
      });

      expect(document.cookie).not.toContain("access_token=mock-token");
      expect(document.cookie).not.toContain("refresh_token=mock-refresh-token");

      expect(localStorage.getItem("access_token")).toBeNull();
      expect(localStorage.getItem("refresh_token")).toBeNull();
    });

    it("should safely flush the Apollo Client database cache storage", () => {
      const { result } = renderHook(() => useLogout());

      act(() => {
        result.current.logout();
      });

      expect(mockClearStore).toHaveBeenCalledTimes(1);
    });

    it("should redirect the viewport context onto login layout interfaces and reload route frames", () => {
      const { result } = renderHook(() => useLogout());

      act(() => {
        result.current.logout();
      });

      expect(mockPush).toHaveBeenCalledWith("/login");
      expect(mockRefresh).toHaveBeenCalledTimes(1);
    });

    it("should bypass and swallow unhandled internal clearStore execution promise exceptions", () => {
      mockClearStore.mockRejectedValueOnce(
        new Error("Apollo connection drop event"),
      );

      const { result } = renderHook(() => useLogout());

      expect(() => {
        act(() => {
          result.current.logout();
        });
      }).not.toThrow();

      expect(mockPush).toHaveBeenCalledWith("/login");
      expect(mockRefresh).toHaveBeenCalledTimes(1);
    });
  });
});
