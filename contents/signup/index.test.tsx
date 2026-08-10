import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import SignUpContent from ".";

import { SIGN_UP_MUTATION } from "@/graphql/auth/mutations";
import { useSignup } from "@/hooks/auth/useSignup";

vi.mock("@/hooks/auth/useSignup", () => ({
  useSignup: vi.fn(),
}));

vi.mock("../../components/auth-form", () => ({
  default: ({
    onSubmit,
    isLoading,
    errorText,
    successText,
    buttonText,
    className,
  }: any) => (
    <div data-testid="mock-auth-form" className={className}>
      <span data-testid="loading-state">{isLoading ? "loading" : "idle"}</span>
      <span data-testid="error-message">{errorText}</span>
      <span data-testid="success-message">{successText}</span>
      <span data-testid="button-label">{buttonText}</span>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({
            email: "signup@example.com",
            password: "securePassword123",
          });
        }}
      >
        <button type="submit">Submit Form</button>
      </form>
    </div>
  ),
}));

describe("SignUpContent Component Module", () => {
  const mockSignup = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useSignup as any).mockReturnValue({
      signup: mockSignup,
      isLoading: false,
      errorText: "",
      successText: "Account created successfully!",
    });
  });

  describe("Properties Configuration Tunneling", () => {
    it("should instantiate useSignup with the explicit SIGN_UP_MUTATION token node mapping", () => {
      render(<SignUpContent />);

      expect(useSignup).toHaveBeenCalledWith(SIGN_UP_MUTATION);
    });

    it("should tunnel default hook values and design layouts properties into the sub-component form parameters", () => {
      render(<SignUpContent className="custom-signup-layout" />);

      const formWrapper = screen.getByTestId("mock-auth-form");
      expect(formWrapper).toHaveClass("custom-signup-layout");
      expect(screen.getByTestId("loading-state").textContent).toBe("idle");
      expect(screen.getByTestId("error-message").textContent).toBe("");
      expect(screen.getByTestId("success-message").textContent).toBe(
        "Account created successfully!",
      );
      expect(screen.getByTestId("button-label").textContent).toBe(
        "create account",
      );
    });

    it("should dynamically update layout state labels when hook parameters change values", () => {
      (useSignup as any).mockReturnValueOnce({
        signup: mockSignup,
        isLoading: true,
        errorText: "Email address is already registered",
        successText: "",
      });

      render(<SignUpContent />);

      expect(screen.getByTestId("loading-state").textContent).toBe("loading");
      expect(screen.getByTestId("error-message").textContent).toBe(
        "Email address is already registered",
      );
      expect(screen.getByTestId("success-message").textContent).toBe("");
    });
  });

  describe("Interactive Callback Dispatches", () => {
    it("should execute signup execution callback when form submission actions fire", async () => {
      const user = userEvent.setup();
      render(<SignUpContent />);

      const submitBtn = screen.getByRole("button", { name: /submit form/i });
      await user.click(submitBtn);

      expect(mockSignup).toHaveBeenCalledWith({
        email: "signup@example.com",
        password: "securePassword123",
      });
      expect(mockSignup).toHaveBeenCalledTimes(1);
    });
  });
});
