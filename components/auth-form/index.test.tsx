import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { describe, it, expect, vi, beforeEach } from "vitest";

import AuthForm from ".";

vi.mock("sonner", () => ({
  toast: {
    promise: vi.fn(),
  },
}));

describe("AuthForm Component", () => {
  const mockOnSubmit = vi.fn();
  const defaultProps = {
    onSubmit: mockOnSubmit,
    isLoading: false,
    buttonText: "Sign In",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should correctly render all base fields and the button", () => {
    render(<AuthForm {...defaultProps} />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it("should not display the password field if showPasswordInput={false}", () => {
    render(<AuthForm {...defaultProps} showPasswordInput={false} />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/password/i)).not.toBeInTheDocument();
  });

  it("should disable controls if isLoading={true}", () => {
    render(<AuthForm {...defaultProps} isLoading={true} />);

    expect(screen.getByLabelText(/email/i)).toBeDisabled();
    expect(screen.getByLabelText(/password/i)).toBeDisabled();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeDisabled();
  });

  it("should allow entering data into the email and password fields", async () => {
    const user = userEvent.setup();
    render(<AuthForm {...defaultProps} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  it("should toggle password visibility on mouse press/release on the eye icon", () => {
    render(<AuthForm {...defaultProps} />);

    const passwordInput = screen.getByLabelText(/password/i);
    const eyeButton = screen.getByRole("button", { name: /show password/i });

    expect(passwordInput).toHaveAttribute("type", "password");

    fireEvent.mouseDown(eyeButton);
    expect(passwordInput).toHaveAttribute("type", "text");

    fireEvent.mouseUp(eyeButton);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("should toggle password visibility on click (onClick via keyboard/missclick)", async () => {
    render(<AuthForm {...defaultProps} />);

    const passwordInput = screen.getByLabelText(/password/i);
    const eyeButton = screen.getByRole("button", { name: /show password/i });

    fireEvent.click(eyeButton, { detail: 0 });
    expect(passwordInput).toHaveAttribute("type", "text");

    fireEvent.click(eyeButton, { detail: 0 });
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("should call toast.promise with correct arguments when submitting a full form", async () => {
    const user = userEvent.setup();
    const fakePromise = Promise.resolve();
    mockOnSubmit.mockReturnValue(fakePromise);

    render(<AuthForm {...defaultProps} successText="Success custom text" />);

    await user.type(screen.getByLabelText(/email/i), "user@test.com");
    await user.type(screen.getByLabelText(/password/i), "secret");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      auth: { email: "user@test.com", password: "secret" },
    });

    expect(toast.promise).toHaveBeenCalledWith(
      fakePromise,
      expect.objectContaining({
        loading: "Sending request...",
        success: "Success custom text",
      }),
    );
  });

  it("should submit only the email if the password field is hidden", async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockReturnValue(Promise.resolve());

    render(<AuthForm {...defaultProps} showPasswordInput={false} />);

    await user.type(screen.getByLabelText(/email/i), "only-email@test.com");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      auth: { email: "only-email@test.com" },
    });
  });

  it("should correctly handle an error within the toast error handling function", async () => {
    const user = userEvent.setup();

    mockOnSubmit.mockRejectedValueOnce(new Error("GraphQL Error"));

    render(<AuthForm {...defaultProps} />);

    await user.type(screen.getByLabelText(/email/i), "error@test.com");
    await user.type(screen.getByLabelText(/password/i), "123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    const toastCalls = vi.mocked(toast.promise).mock.calls[0];
    const toastConfig = toastCalls[1];
    const errorFormatter = toastConfig?.error;

    if (typeof errorFormatter === "function") {
      expect(errorFormatter({ message: "Custom API Error" })).toBe(
        "Custom API Error",
      );
      expect(errorFormatter(new Error("Fallback"))).toBe("Fallback");
    } else {
      throw new Error(
        "error property inside toast.promise configuration is not a function",
      );
    }
  });
});
