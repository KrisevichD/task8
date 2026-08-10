import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ForgotContent from ".";

import { FORGOT_PASSWORD_MUTATION } from "@/graphql/auth/mutations";
import { useForgotPassword } from "@/hooks/auth/useForgotPassword";

vi.mock("@/hooks/auth/useForgotPassword", () => ({
  useForgotPassword: vi.fn(),
}));

vi.mock("../../components/auth-form", () => ({
  default: ({
    onSubmit,
    isLoading,
    errorText,
    successText,
    buttonText,
    showPasswordInput,
    className,
  }: any) => (
    <div data-testid="mock-auth-form" className={className}>
      <span data-testid="loading-state">{isLoading ? "loading" : "idle"}</span>
      <span data-testid="error-message">{errorText}</span>
      <span data-testid="success-message">{successText}</span>
      <span data-testid="button-label">{buttonText}</span>
      <span data-testid="password-visibility">
        {showPasswordInput ? "visible" : "hidden"}
      </span>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ email: "test@example.com" });
        }}
      >
        <button type="submit">Submit Form</button>
      </form>
    </div>
  ),
}));

describe("ForgotContent Component Module", () => {
  const mockResetPassword = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useForgotPassword as any).mockReturnValue({
      resetPassword: mockResetPassword,
      isLoading: false,
      errorText: "",
      successText: "Instructions have been sent if the email exists.",
    });
  });

  describe("Properties Configuration Tunneling", () => {
    it("should instantiate useForgotPassword with the explicit FORGOT_PASSWORD_MUTATION token node mapping", () => {
      render(<ForgotContent />);

      expect(useForgotPassword).toHaveBeenCalledWith(FORGOT_PASSWORD_MUTATION);
    });

    it("should tunnel default hook values and design layouts properties into the sub-component form parameters", () => {
      render(<ForgotContent className="custom-forgot-layout" />);

      const formWrapper = screen.getByTestId("mock-auth-form");
      expect(formWrapper).toHaveClass("custom-forgot-layout");
      expect(screen.getByTestId("loading-state").textContent).toBe("idle");
      expect(screen.getByTestId("error-message").textContent).toBe("");
      expect(screen.getByTestId("success-message").textContent).toBe(
        "Instructions have been sent if the email exists.",
      );
      expect(screen.getByTestId("button-label").textContent).toBe(
        "reset password",
      );
      expect(screen.getByTestId("password-visibility").textContent).toBe(
        "hidden",
      );
    });

    it("should dynamic update layout state labels when hook parameters change values", () => {
      (useForgotPassword as any).mockReturnValueOnce({
        resetPassword: mockResetPassword,
        isLoading: true,
        errorText: "Provided email mapping could not be matched inside records",
        successText: "",
      });

      render(<ForgotContent />);

      expect(screen.getByTestId("loading-state").textContent).toBe("loading");
      expect(screen.getByTestId("error-message").textContent).toBe(
        "Provided email mapping could not be matched inside records",
      );
      expect(screen.getByTestId("success-message").textContent).toBe("");
    });
  });

  describe("Interactive Callback Dispatches", () => {
    it("should execute resetPassword execution callback when form submission actions fire", async () => {
      const user = userEvent.setup();
      render(<ForgotContent />);

      const submitBtn = screen.getByRole("button", { name: /submit form/i });
      await user.click(submitBtn);

      expect(mockResetPassword).toHaveBeenCalledWith({
        email: "test@example.com",
      });
      expect(mockResetPassword).toHaveBeenCalledTimes(1);
    });
  });
});
