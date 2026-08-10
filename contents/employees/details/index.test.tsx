import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { hoistedReact } = await vi.hoisted(async () => {
  const ReactModule = await import("react");
  return { hoistedReact: ReactModule.default || ReactModule };
});

import { EmployeeDetailsContent } from ".";

import { IUserData } from "@/graphql/user/queries";
import { useEmployeeDetailsForm } from "@/hooks/employees/useEmployeeDetailsForm";

vi.mock("@/hooks/employees/useEmployeeDetailsForm", () => ({
  useEmployeeDetailsForm: vi.fn(),
}));

vi.mock("./avatarSection", () => ({
  AvatarSection: ({ avatarUrl, initials, firstName }: any) => (
    <div
      data-testid="mock-avatar-section"
      data-url={avatarUrl}
      data-initials={initials}
      data-name={firstName}
    >
      Avatar Section
    </div>
  ),
}));

vi.mock("@/components/ui/floating-input", () => ({
  FloatingInput: hoistedReact.forwardRef(
    ({ label, ...props }: any, ref: any) => (
      <div data-testid={`input-wrapper-${label}`}>
        <label>{label}</label>
        <input ref={ref} data-testid={`input-field-${label}`} {...props} />
      </div>
    ),
  ),
}));

vi.mock("@/components/ui/floating-select", () => ({
  FloatingSelect: ({ children, label, value }: any) => (
    <div data-testid={`select-wrapper-${label}`} data-value={value}>
      <label>{label}</label>
      <select value={value}>{children}</select>
    </div>
  ),
}));

vi.mock("@/components/ui/select", () => ({
  SelectItem: ({ value, children }: any) => (
    <option value={value}>{children}</option>
  ),
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, disabled, className, type }: any) => (
    <button
      type={type}
      disabled={disabled}
      className={className}
      data-testid="submit-button"
    >
      {children}
    </button>
  ),
}));

const TestWrapperShell = ({ initialUser, userId, hookOverrides = {} }: any) => {
  const realFormInstance = useForm({
    defaultValues: {
      firstName: initialUser?.profile?.first_name || "",
      lastName: initialUser?.profile?.last_name || "",
      departmentId: "",
      positionId: "",
    },
  });

  const baseHookValue = {
    form: realFormInstance,
    departments: [
      { id: "d1", name: "Engineering" },
      { id: "d2", name: "HR" },
    ],
    positions: [
      { id: "p1", name: "Frontend Developer" },
      { id: "p2", name: "HR Specialist" },
    ],
    avatarPreview: null,
    isUpdating: false,
    canSubmit: false,
    handleAvatarChange: vi.fn(),
    onSubmit: vi.fn(),
  };

  (useEmployeeDetailsForm as any).mockReturnValue({
    ...baseHookValue,
    ...hookOverrides,

    form: {
      ...realFormInstance,
      handleSubmit: hookOverrides.handleSubmit || realFormInstance.handleSubmit,
    },
  });

  return <EmployeeDetailsContent userId={userId} initialUser={initialUser} />;
};

describe("EmployeeDetailsContent Component Module", () => {
  const mockUser: IUserData = {
    id: "user-123",
    email: "john.doe@company.com",
    department_name: "Engineering",
    position_name: "Frontend Developer",
    created_at: "1705226400000",
    profile: {
      first_name: "John",
      last_name: "Doe",
      avatar: "https://example.com",
    },
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Conditional Render & Fallback Branches Coverage", () => {
    it("should render a 'User not found' error container if initialUser prop is missing", () => {
      (useEmployeeDetailsForm as any).mockReturnValue({ form: {} });
      render(
        <EmployeeDetailsContent userId="user-123" initialUser={undefined} />,
      );

      expect(screen.getByText("User not found")).toBeInTheDocument();
      expect(
        screen.queryByTestId("mock-avatar-section"),
      ).not.toBeInTheDocument();
    });

    it("should fallback cleanly onto the default date string parameter when created_at is completely empty", () => {
      const userWithoutDate = { ...mockUser, created_at: "" };

      render(
        <TestWrapperShell userId="user-123" initialUser={userWithoutDate} />,
      );

      expect(
        screen.getByText(/A member since Sun Jan 14 2024/i),
      ).toBeInTheDocument();
    });

    it("should parse initials from first name and last name character bounds seamlessly", () => {
      render(<TestWrapperShell userId="user-123" initialUser={mockUser} />);

      const avatarSection = screen.getByTestId("mock-avatar-section");
      expect(avatarSection).toHaveAttribute("data-initials", "JD");
      expect(avatarSection).toHaveAttribute("data-url", "https://example.com");
    });
  });

  describe("Form Actions & Dynamic Button Casing Rules", () => {
    it("should render an inactive locked button layout configuration state if canSubmit is false", () => {
      render(
        <TestWrapperShell
          userId="user-123"
          initialUser={mockUser}
          hookOverrides={{ canSubmit: false }}
        />,
      );

      const submitBtn = screen.getByTestId("submit-button");
      expect(submitBtn).toBeDisabled();
      expect(submitBtn.className).toContain(
        "bg-muted text-muted-foreground cursor-not-allowed",
      );
      expect(submitBtn.textContent).toBe("UPDATE");
    });

    it("should release style boundaries and dynamically transform text labels to trailing periods values while isUpdating is true", () => {
      render(
        <TestWrapperShell
          userId="user-123"
          initialUser={mockUser}
          hookOverrides={{ canSubmit: true, isUpdating: true }}
        />,
      );

      const submitBtn = screen.getByTestId("submit-button");
      expect(submitBtn).toBeDisabled();
      expect(submitBtn.textContent).toBe("UPDATE...");
    });

    it("should release submit triggers path execution loops seamlessly when inputs variables change validly", async () => {
      const user = userEvent.setup();
      const mockOnSubmit = vi.fn();

      const mockHandleSubmitProxy = (onSubmitCallback: any) => (e: any) => {
        e.preventDefault();
        onSubmitCallback({
          firstName: "John",
          lastName: "Doe",
          departmentId: "Engineering",
          positionId: "Frontend Developer",
        });
      };

      render(
        <TestWrapperShell
          userId="user-123"
          initialUser={mockUser}
          hookOverrides={{
            canSubmit: true,
            onSubmit: mockOnSubmit,
            handleSubmit: mockHandleSubmitProxy,
          }}
        />,
      );

      const submitBtn = screen.getByTestId("submit-button");
      expect(submitBtn).not.toBeDisabled();
      expect(submitBtn.className).toContain(
        "bg-primary text-primary-foreground hover:bg-primary/90",
      );

      await user.click(submitBtn);

      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });
  });
});
