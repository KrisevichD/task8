import { useMutation } from "@apollo/client/react";
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

import { useSignup } from "./useSignup";

vi.mock("@apollo/client/react", () => ({
  useMutation: vi.fn(),
}));

vi.mock("js-cookie", () => ({
  default: {
    set: vi.fn(),
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("useSignup Hook", () => {
  const mockPush = vi.fn();
  const mockExecuteSignup = vi.fn();
  const dummyMutation = {} as any;

  const mockVariables = {
    auth: {
      email: "newuser@example.com",
      password: "securePassword123",
    },
  };

  const mockSuccessData = {
    signup: {
      access_token: "mock-access-token",
      refresh_token: "mock-refresh-token",
      user: { id: "u-2", email: "newuser@example.com" },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    (useRouter as unknown as MockedFunction<typeof useRouter>).mockReturnValue({
      push: mockPush,
    } as any);

    (
      useMutation as unknown as MockedFunction<typeof useMutation>
    ).mockReturnValue([mockExecuteSignup, { loading: false }] as any);
  });

  describe("Initialization & Default Configurations", () => {
    it("should initialize with default states and base values", () => {
      const { result } = renderHook(() => useSignup(dummyMutation));

      expect(result.current.isLoading).toBe(false);
      expect(result.current.errorText).toBe("");
      expect(result.current.successText).toBe("Account created successfully!");
    });

    it("should configure custom redirection routes and custom success text accurately", () => {
      const { result } = renderHook(() =>
        useSignup(dummyMutation, "/welcome-wizard", "Registration Completed!"),
      );

      expect(result.current.successText).toBe("Registration Completed!");
    });
  });

  describe("Successful Operations", () => {
    it("should set cookies and navigate to destination route upon valid server tokens delivery", async () => {
      mockExecuteSignup.mockResolvedValueOnce({
        data: mockSuccessData,
      });

      const { result } = renderHook(() =>
        useSignup(dummyMutation, "/onboarding"),
      );

      await act(async () => {
        await result.current.signup(mockVariables);
      });

      expect(mockExecuteSignup).toHaveBeenCalledWith({
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
      expect(mockPush).toHaveBeenCalledWith("/onboarding");
      expect(result.current.errorText).toBe("");
    });
  });

  describe("Error Handling Mechanics", () => {
    it("should process structural GraphQL errors payload configurations and update errorText", async () => {
      mockExecuteSignup.mockResolvedValueOnce({
        error: {
          message: "Email address is already registered",
        },
      });

      const { result } = renderHook(() => useSignup(dummyMutation));

      await act(async () => {
        await expect(result.current.signup(mockVariables)).rejects.toThrow(
          "Email address is already registered",
        );
      });

      expect(result.current.errorText).toBe(
        "Email address is already registered",
      );
      expect(Cookies.set).not.toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("should throw an interface validation exception if server payload misses required tokens", async () => {
      mockExecuteSignup.mockResolvedValueOnce({
        data: {
          signup: { access_token: "token-present", refresh_token: null },
        },
      });

      const { result } = renderHook(() => useSignup(dummyMutation));

      await act(async () => {
        await expect(result.current.signup(mockVariables)).rejects.toThrow(
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
      mockExecuteSignup.mockRejectedValueOnce(
        new Error("Database transactional deadlock constraint"),
      );

      const { result } = renderHook(() => useSignup(dummyMutation));

      await act(async () => {
        await expect(result.current.signup(mockVariables)).rejects.toThrow(
          "Database transactional deadlock constraint",
        );
      });

      expect(result.current.errorText).toBe(
        "Database transactional deadlock constraint",
      );
    });

    it("should provide an 'Unknown error' fallback string fallback option if rejection is primitive", async () => {
      mockExecuteSignup.mockRejectedValueOnce({ customRawErrorObject: true });

      const { result } = renderHook(() => useSignup(dummyMutation));

      await act(async () => {
        await expect(result.current.signup(mockVariables)).rejects.toEqual({
          customRawErrorObject: true,
        });
      });

      expect(result.current.errorText).toBe("Unknown error");
    });

    it("should reset prior execution exception errors upon secondary signup invokes", async () => {
      mockExecuteSignup.mockRejectedValueOnce(
        new Error("Validation bottleneck constraint"),
      );

      const { result } = renderHook(() => useSignup(dummyMutation));

      await act(async () => {
        await expect(result.current.signup(mockVariables)).rejects.toThrow(
          "Validation bottleneck constraint",
        );
      });

      expect(result.current.errorText).toBe("Validation bottleneck constraint");

      mockExecuteSignup.mockResolvedValueOnce({
        data: mockSuccessData,
      });

      await act(async () => {
        await result.current.signup(mockVariables);
      });

      expect(result.current.errorText).toBe("");
    });
  });
});
