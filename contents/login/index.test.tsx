import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import LoginContent from ".";

import { SIGN_IN_QUERY } from "@/graphql/auth/mutations";
import { useLogin } from "@/hooks/auth/useLogin";

vi.mock("@/hooks/auth/useLogin", () => ({
  useLogin: vi.fn(),
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
          onSubmit({ email: "login@example.com", password: "password123" });
        }}
      >
        <button type="submit">Submit Form</button>
      </form>
    </div>
  ),
}));

describe("LoginContent Component Module", () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useLogin as any).mockReturnValue({
      login: mockLogin,
      isLoading: false,
      errorText: "",
      successText: "Welcome back! Successfully logged in",
    });
  });

  describe("Properties Configuration Tunneling", () => {
    it("should instantiate useLogin with the explicit SIGN_IN_QUERY token node mapping", () => {
      render(<LoginContent />);

      expect(useLogin).toHaveBeenCalledWith(SIGN_IN_QUERY);
    });

    it("should tunnel default hook values and design layouts properties into the sub-component form parameters", () => {
      render(<LoginContent className="custom-login-layout" />);

      const formWrapper = screen.getByTestId("mock-auth-form");
      expect(formWrapper).toHaveClass("custom-login-layout");
      expect(screen.getByTestId("loading-state").textContent).toBe("idle");
      expect(screen.getByTestId("error-message").textContent).toBe("");
      expect(screen.getByTestId("success-message").textContent).toBe(
        "Welcome back! Successfully logged in",
      );
      expect(screen.getByTestId("button-label").textContent).toBe("log in");
    });

    it("should dynamically update layout state labels when hook parameters change values", () => {
      (useLogin as any).mockReturnValueOnce({
        login: mockLogin,
        isLoading: true,
        errorText: "Invalid credentials combination supplied",
        successText: "",
      });

      render(<LoginContent />);

      expect(screen.getByTestId("loading-state").textContent).toBe("loading");
      expect(screen.getByTestId("error-message").textContent).toBe(
        "Invalid credentials combination supplied",
      );
      expect(screen.getByTestId("success-message").textContent).toBe("");
    });
  });

  describe("Interactive Callback Dispatches", () => {
    it("should execute login execution callback when form submission actions fire", async () => {
      const user = userEvent.setup();
      render(<LoginContent />);

      const submitBtn = screen.getByRole("button", { name: /submit form/i });
      await user.click(submitBtn);

      expect(mockLogin).toHaveBeenCalledWith({
        email: "login@example.com",
        password: "password123",
      });
      expect(mockLogin).toHaveBeenCalledTimes(1);
    });
  });
});
