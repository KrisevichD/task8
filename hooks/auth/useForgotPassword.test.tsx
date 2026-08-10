import { useMutation } from "@apollo/client/react";
import { act, renderHook } from "@testing-library/react";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockedFunction,
} from "vitest";

import { useForgotPassword } from "./useForgotPassword";

vi.mock("@apollo/client/react", () => ({
  useMutation: vi.fn(),
}));

describe("useForgotPassword Hook", () => {
  const mockExecuteReset = vi.fn();
  const dummyMutation = {} as any;

  const mockVariables = {
    email: "user@example.com",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    (
      useMutation as unknown as MockedFunction<typeof useMutation>
    ).mockReturnValue([mockExecuteReset, { loading: false }] as any);
  });

  describe("Initialization", () => {
    it("should initialize with default states and custom success texts", () => {
      const { result } = renderHook(() => useForgotPassword(dummyMutation));

      expect(result.current.isLoading).toBe(false);
      expect(result.current.errorText).toBe("");
      expect(result.current.successText).toBe(
        "Instructions have been sent if the email exists.",
      );
    });

    it("should accept and render an overridden successText property parameter", () => {
      const { result } = renderHook(() =>
        useForgotPassword(
          dummyMutation,
          "Custom link dispatch message text confirmation",
        ),
      );

      expect(result.current.successText).toBe(
        "Custom link dispatch message text confirmation",
      );
    });
  });

  describe("Successful Operations", () => {
    it("should trigger executeReset with parameters and keep error states empty on success", async () => {
      mockExecuteReset.mockResolvedValueOnce({
        data: {
          forgotPassword: true,
        },
      });

      const { result } = renderHook(() => useForgotPassword(dummyMutation));

      await act(async () => {
        await result.current.resetPassword(mockVariables);
      });

      expect(mockExecuteReset).toHaveBeenCalledWith({
        variables: mockVariables,
      });
      expect(result.current.errorText).toBe("");
    });
  });

  describe("Error Handling Mechanics", () => {
    it("should catch operational Apollo error objects and commit parameters to errorText state", async () => {
      mockExecuteReset.mockResolvedValueOnce({
        error: {
          message: "Email address context is completely invalid",
        },
      });

      const { result } = renderHook(() => useForgotPassword(dummyMutation));

      await act(async () => {
        await expect(
          result.current.resetPassword(mockVariables),
        ).rejects.toThrow("Email address context is completely invalid");
      });

      expect(result.current.errorText).toBe(
        "Email address context is completely invalid",
      );
    });

    it("should process structural execution promise rejections cleanly", async () => {
      mockExecuteReset.mockRejectedValueOnce(
        new Error("Database write socket disconnection event"),
      );

      const { result } = renderHook(() => useForgotPassword(dummyMutation));

      await act(async () => {
        await expect(
          result.current.resetPassword(mockVariables),
        ).rejects.toThrow("Database write socket disconnection event");
      });

      expect(result.current.errorText).toBe(
        "Database write socket disconnection event",
      );
    });

    it("should fallback gracefully onto generic placeholders if exceptions are not instances of error objects", async () => {
      mockExecuteReset.mockRejectedValueOnce(
        "String format mutation rejection throw context",
      );

      const { result } = renderHook(() => useForgotPassword(dummyMutation));

      await act(async () => {
        await expect(result.current.resetPassword(mockVariables)).rejects.toBe(
          "String format mutation rejection throw context",
        );
      });

      expect(result.current.errorText).toBe("Unknown error");
    });

    it("should purge lingering previous error messages on subsequent mutation execution invocations", async () => {
      mockExecuteReset.mockRejectedValueOnce(
        new Error("Initial validation bottleneck error"),
      );

      const { result } = renderHook(() => useForgotPassword(dummyMutation));

      await act(async () => {
        await expect(
          result.current.resetPassword(mockVariables),
        ).rejects.toThrow("Initial validation bottleneck error");
      });

      expect(result.current.errorText).toBe(
        "Initial validation bottleneck error",
      );

      mockExecuteReset.mockResolvedValueOnce({
        data: { forgotPassword: true },
      });

      await act(async () => {
        await result.current.resetPassword(mockVariables);
      });

      expect(result.current.errorText).toBe("");
    });
  });
});
