import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockedFunction,
} from "vitest";

import { EmployeeDetailsContent } from "./index";

import { useEmployeeDetailsForm } from "@/hooks/employees/useEmployeeDetailsForm";

const mockReplace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: mockReplace,
  }),
}));

vi.mock("@/context/language", () => ({
  useLanguage: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("@/hooks/employees/useEmployeeDetailsForm", () => ({
  useEmployeeDetailsForm: vi.fn(),
}));

vi.mock("./avatarSection", () => ({
  AvatarSection: ({ initials }: any) => (
    <div data-testid="avatar-section">{initials}</div>
  ),
}));

vi.mock("@/components/ui/floating-input", () => ({
  FloatingInput: ({ label, ...props }: any) => (
    <div>
      <label>{label}</label>
      <input {...props} />
    </div>
  ),
}));

vi.mock("@/components/ui/floating-select", () => ({
  FloatingSelect: ({ label, children }: any) => (
    <div>
      <label>{label}</label>
      <select>{children}</select>
    </div>
  ),
}));

vi.mock("@/components/ui/select", () => ({
  SelectItem: ({ children, value }: any) => (
    <option value={value}>{children}</option>
  ),
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, disabled, className, type }: any) => (
    <button type={type} disabled={disabled} className={className}>
      {children}
    </button>
  ),
}));

// Компонент-обертка с реальным useForm для корректной работы Controller
const TestWrapper = ({
  userId,
  initialUser,
  formOverride = {},
}: {
  userId: string;
  initialUser: any;
  formOverride?: Partial<ReturnType<typeof useEmployeeDetailsForm>>;
}) => {
  const realForm = useForm({
    defaultValues: {
      firstName: initialUser?.profile?.first_name || "",
      lastName: initialUser?.profile?.last_name || "",
      departmentId: initialUser?.department_name || "",
      positionId: initialUser?.position_name || "",
    },
  });

  (
    useEmployeeDetailsForm as unknown as MockedFunction<
      typeof useEmployeeDetailsForm
    >
  ).mockReturnValue({
    form: realForm as any,
    departments: [{ id: "dep-1", name: "Engineering" }],
    positions: [{ id: "pos-1", name: "Frontend Developer" }],
    avatarPreview: null,
    isUpdating: false,
    canSubmit: true,
    handleAvatarChange: vi.fn(),
    onSubmit: vi.fn(),
    ...formOverride,
  });

  return <EmployeeDetailsContent userId={userId} initialUser={initialUser} />;
};

describe("EmployeeDetailsContent Component Module", () => {
  const mockUserData = {
    id: "emp-101",
    email: "john.doe@company.com",
    created_at: "1705228800000",
    profile: {
      first_name: "John",
      last_name: "Doe",
      avatar: "https://example.com/avatar.jpg",
    },
    department_name: "Engineering",
    position_name: "Frontend Developer",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Conditional Render & Fallback Branches Coverage", () => {
    it("should render null and trigger router replace if initialUser prop is missing", () => {
      const { container } = render(
        <TestWrapper userId="emp-101" initialUser={undefined} />,
      );

      expect(container.firstChild).toBeNull();
      expect(mockReplace).toHaveBeenCalledWith("/employees");
    });

    it("should fallback cleanly onto the default date string parameter when created_at is completely empty", () => {
      const userWithoutDate = {
        ...mockUserData,
        created_at: undefined,
      };

      render(
        <TestWrapper userId="emp-101" initialUser={userWithoutDate as any} />,
      );

      expect(screen.getByText(/Sun Jan 14 2024/i)).toBeInTheDocument();
    });

    it("should parse initials from first name and last name character bounds seamlessly", () => {
      render(
        <TestWrapper userId="emp-101" initialUser={mockUserData as any} />,
      );

      expect(screen.getByTestId("avatar-section")).toHaveTextContent("JD");
    });
  });

  describe("Form Actions & Dynamic Button Casing Rules", () => {
    it("should render an inactive locked button layout configuration state if canSubmit is false", () => {
      render(
        <TestWrapper
          userId="emp-101"
          initialUser={mockUserData as any}
          formOverride={{ canSubmit: false }}
        />,
      );

      const submitButton = screen.getByRole("button", { name: /^update$/i });
      expect(submitButton).toBeDisabled();
    });

    it("should release style boundaries and dynamically transform text labels to trailing periods values while isUpdating is true", () => {
      render(
        <TestWrapper
          userId="emp-101"
          initialUser={mockUserData as any}
          formOverride={{ isUpdating: true }}
        />,
      );

      expect(screen.getByText(/update\.\.\./i)).toBeInTheDocument();
    });

    it("should release submit triggers path execution loops seamlessly when inputs variables change validly", async () => {
      const user = userEvent.setup();
      const mockOnSubmit = vi.fn();

      render(
        <TestWrapper
          userId="emp-101"
          initialUser={mockUserData as any}
          formOverride={{ onSubmit: mockOnSubmit }}
        />,
      );

      const submitButton = screen.getByRole("button", { name: /^update$/i });
      await user.click(submitButton);

      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });
});
