import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { UpdateUserModal } from "./UpdateUserModal";

describe("UpdateUserModal Component", () => {
  const mockOnClose = vi.fn();
  const mockOnUpdate = vi.fn();

  const mockUser = {
    id: "user-123",
    email: "john.doe@example.com",
    firstName: "John",
    lastName: "Doe",
    departmentId: "dep-1",
    positionId: "pos-1",
    role: "Admin",
  };

  const mockDepartments = [
    { id: "dep-1", name: "Engineering" },
    { id: "dep-2", name: "Marketing" },
  ];

  const mockPositions = [
    { id: "pos-1", name: "Frontend Developer" },
    { id: "pos-2", name: "Product Manager" },
  ];

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    user: mockUser,
    departments: mockDepartments,
    positions: mockPositions,
    onUpdate: mockOnUpdate,
    isLoading: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    if (typeof window !== "undefined" && !window.PointerEvent) {
      class MockPointerEvent extends Event {
        button: number;
        ctrlKey: boolean;
        pointerType: string;
        constructor(
          type: string,
          props: EventInit & {
            button?: number;
            ctrlKey?: boolean;
            pointerType?: string;
          } = {},
        ) {
          super(type, props);
          this.button = props.button || 0;
          this.ctrlKey = props.ctrlKey || false;
          this.pointerType = props.pointerType || "mouse";
        }
      }
      window.PointerEvent = MockPointerEvent as any;
    }
  });

  it("should not render the modal when isOpen={false}", () => {
    render(<UpdateUserModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByText("Update user")).not.toBeInTheDocument();
  });

  it("should render all form elements and populated data correctly", () => {
    render(<UpdateUserModal {...defaultProps} />);

    expect(screen.getByText("Update user")).toBeInTheDocument();

    expect(screen.getByLabelText("Email")).toHaveValue("john.doe@example.com");
    expect(screen.getByLabelText("Password")).toHaveValue("************");
    expect(screen.getByLabelText("First Name")).toHaveValue("John");
    expect(screen.getByLabelText("Last Name")).toHaveValue("Doe");
    expect(screen.getByLabelText("Department")).toHaveValue("dep-1");
    expect(screen.getByLabelText("Position")).toHaveValue("pos-1");
    expect(screen.getByLabelText("Role")).toHaveValue("Admin");
  });

  it("should fallback to profile values if direct properties are missing", () => {
    const userWithProfile = {
      id: "user-789",
      email: "profile@example.com",
      profile: {
        first_name: "Jane",
        last_name: "Smith",
      },
      department: "dep-2",
      position: "pos-2",
      role: "Manager",
    };

    render(<UpdateUserModal {...defaultProps} user={userWithProfile} />);

    expect(screen.getByLabelText("First Name")).toHaveValue("Jane");
    expect(screen.getByLabelText("Last Name")).toHaveValue("Smith");
    expect(screen.getByLabelText("Department")).toHaveValue("dep-2");
    expect(screen.getByLabelText("Position")).toHaveValue("pos-2");
  });

  it("should enforce disabled attributes on Email, Password, and Role fields", () => {
    render(<UpdateUserModal {...defaultProps} />);

    expect(screen.getByLabelText("Email")).toBeDisabled();
    expect(screen.getByLabelText("Password")).toBeDisabled();
    expect(screen.getByLabelText("Role")).toBeDisabled();

    expect(screen.getByLabelText("First Name")).not.toBeDisabled();
    expect(screen.getByLabelText("Last Name")).not.toBeDisabled();
  });

  it("should display a loading state on the submit button when isLoading={true}", () => {
    render(<UpdateUserModal {...defaultProps} isLoading={true} />);

    const updateButton = screen.getByRole("button", { name: "UPDATING..." });
    expect(updateButton).toBeInTheDocument();
    expect(updateButton).toBeDisabled();
  });

  it("should call onClose when the CANCEL button is clicked", async () => {
    const user = userEvent.setup();
    render(<UpdateUserModal {...defaultProps} />);

    const cancelButton = screen.getByRole("button", { name: "CANCEL" });
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("should accurately capture data alterations and submit form payload successfully", async () => {
    const user = userEvent.setup();
    mockOnUpdate.mockResolvedValueOnce(undefined);

    render(<UpdateUserModal {...defaultProps} />);

    const firstNameInput = screen.getByLabelText("First Name");
    const lastNameInput = screen.getByLabelText("Last Name");
    const departmentSelect = screen.getByLabelText("Department");
    const positionSelect = screen.getByLabelText("Position");

    await user.clear(firstNameInput);
    await user.type(firstNameInput, "Johnny");

    await user.clear(lastNameInput);
    await user.type(lastNameInput, "Doeson");

    await user.selectOptions(departmentSelect, "dep-2");
    await user.selectOptions(positionSelect, "pos-2");

    const updateButton = screen.getByRole("button", { name: "UPDATE" });
    await user.click(updateButton);

    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalledWith({
        userId: "user-123",
        email: "john.doe@example.com",
        firstName: "Johnny",
        lastName: "Doeson",
        departmentId: "dep-2",
        positionId: "pos-2",
        role: "Admin",
      });
    });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
