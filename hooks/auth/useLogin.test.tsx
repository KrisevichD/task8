import { useLazyQuery } from "@apollo/client/react";
import { act, renderHook } from "@testing-library/react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockedFunction,
} from "vitest";

import { useLogin } from "./useLogin";

vi.mock("@apollo/client/react", () => ({
  useLazyQuery: vi.fn(),
}));

vi.mock("js-cookie", () => ({
  default: {
    set: vi.fn(),
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("useLogin Hook", () => {
  const mockPush = vi.fn();
  const mockExecuteLogin = vi.fn();
  const dummyQuery = {} as any;

  const mockVariables = {
    auth: {
      email: "test@example.com",
      password: "password123",
    },
  };

  const mockSuccessData = {
    login: {
      access_token: "mock-access-token",
      refresh_token: "mock-refresh-token",
      user: { id: "u-1", email: "test@example.com" },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    (useRouter as unknown as MockedFunction<typeof useRouter>).mockReturnValue({
      push: mockPush,
    } as any);

    (
      useLazyQuery as unknown as MockedFunction<typeof useLazyQuery>
    ).mockReturnValue([mockExecuteLogin, { loading: false }] as any);
  });

  describe("Initialization & Default Configurations", () => {
    it("should initialize with default states and base values", () => {
      const { result } = renderHook(() => useLogin(dummyQuery));

      expect(result.current.isLoading).toBe(false);
      expect(result.current.errorText).toBe("");
      expect(result.current.successText).toBe(
        "Welcome back! Successfully logged in",
      );
    });

    it("should configure custom redirection routes and custom success text accurately", () => {
      const { result } = renderHook(() =>
        useLogin(dummyQuery, "/profile-view", "Custom Login Message"),
      );

      expect(result.current.successText).toBe("Custom Login Message");
    });
  });

  describe("Successful Operations", () => {
    it("should set cookies and navigate to destination route upon valid server tokens delivery", async () => {
      mockExecuteLogin.mockResolvedValueOnce({
        data: mockSuccessData,
      });

      const { result } = renderHook(() =>
        useLogin(dummyQuery, "/custom-dashboard"),
      );

      await act(async () => {
        await result.current.login(mockVariables);
      });

      expect(mockExecuteLogin).toHaveBeenCalledWith({
        variables: mockVariables,
      });
      expect(Cookies.set).toHaveBeenCalledWith(
        "access_token",
        "mock-access-token",
        { expires: 7 },
      );
      expect(Cookies.set).toHaveBeenCalledWith(
        "refresh_token",
        "mock-refresh-token",
        { expires: 7 },
      );
      expect(mockPush).toHaveBeenCalledWith("/custom-dashboard");
      expect(result.current.errorText).toBe("");
    });
  });

  describe("Error Handling Mechanics", () => {
    it("should process structural GraphQL errors payload configurations and update errorText", async () => {
      mockExecuteLogin.mockResolvedValueOnce({
        error: {
          message: "Invalid credentials combination supplied",
        },
      });

      const { result } = renderHook(() => useLogin(dummyQuery));

      await act(async () => {
        await expect(result.current.login(mockVariables)).rejects.toThrow(
          "Invalid credentials combination supplied",
        );
      });

      expect(result.current.errorText).toBe(
        "Invalid credentials combination supplied",
      );
      expect(Cookies.set).not.toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("should throw an interface validation exception if server payload misses required tokens", async () => {
      mockExecuteLogin.mockResolvedValueOnce({
        data: {
          login: { access_token: null, refresh_token: "only-one-token" },
        },
      });

      const { result } = renderHook(() => useLogin(dummyQuery));

      await act(async () => {
        await expect(result.current.login(mockVariables)).rejects.toThrow(
          "Invalid response structure from server.",
        );
      });

      expect(result.current.errorText).toBe(
        "Invalid response structure from server.",
      );
      expect(Cookies.set).not.toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("should handle raw promise rejections cleanly", async () => {
      mockExecuteLogin.mockRejectedValueOnce(
        new Error("Network gateway response timeout constraint exceeded"),
      );

      const { result } = renderHook(() => useLogin(dummyQuery));

      await act(async () => {
        await expect(result.current.login(mockVariables)).rejects.toThrow(
          "Network gateway response timeout constraint exceeded",
        );
      });

      expect(result.current.errorText).toBe(
        "Network gateway response timeout constraint exceeded",
      );
    });

    it("should provide an 'Unknown error' fallback string fallback option if rejection is primitive", async () => {
      mockExecuteLogin.mockRejectedValueOnce({ customRawErrorObject: true });

      const { result } = renderHook(() => useLogin(dummyQuery));

      await act(async () => {
        await expect(result.current.login(mockVariables)).rejects.toEqual({
          customRawErrorObject: true,
        });
      });

      expect(result.current.errorText).toBe("Unknown error");
    });

    it("should reset prior execution exception errors upon secondary login invokes", async () => {
      mockExecuteLogin.mockRejectedValueOnce(
        new Error("Temporary verification deadlock constraint"),
      );

      const { result } = renderHook(() => useLogin(dummyQuery));

      await act(async () => {
        await expect(result.current.login(mockVariables)).rejects.toThrow(
          "Temporary verification deadlock constraint",
        );
      });

      expect(result.current.errorText).toBe(
        "Temporary verification deadlock constraint",
      );

      mockExecuteLogin.mockResolvedValueOnce({
        data: mockSuccessData,
      });

      await act(async () => {
        await result.current.login(mockVariables);
      });

      expect(result.current.errorText).toBe("");
    });
  });
});
