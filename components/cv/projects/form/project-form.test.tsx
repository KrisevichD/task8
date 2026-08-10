import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { hoistedReact } = await vi.hoisted(async () => {
  const ReactModule = await import("react");
  return { hoistedReact: ReactModule.default || ReactModule };
});

import CvProjectsForm from ".";

import useCvConstructor from "@/hooks/cvs/useCvConstructor";
import useSkills from "@/hooks/skills/useSkills";
import { ICreateCvProjectForm } from "@/types/cv-constructor";

vi.mock("next/navigation", () => ({
  useParams: vi.fn(),
}));

vi.mock("@/hooks/cvs/useCvConstructor", () => ({
  default: vi.fn(),
}));

vi.mock("@/hooks/skills/useSkills", () => ({
  default: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

vi.mock("@/components/ui/icon", () => ({
  Icon: ({ variant }: { variant: string }) => (
    <span data-testid={`icon-${variant}`} />
  ),
}));

vi.mock("@/components/ui/floating-input", () => ({
  FloatingInput: hoistedReact.forwardRef(
    ({ label, disabled, ...props }: any, ref: any) => (
      <div data-testid={`input-wrapper-${label}`}>
        <label>{label}</label>
        <input
          ref={ref}
          data-testid={`input-field-${label}`}
          disabled={disabled}
          {...props}
        />
      </div>
    ),
  ),
}));

vi.mock("@/components/ui/floating-textarea", () => ({
  FloatingTextarea: hoistedReact.forwardRef(
    ({ label, disabled, ...props }: any, ref: any) => (
      <div data-testid={`textarea-wrapper-${label}`}>
        <label>{label}</label>
        <textarea
          ref={ref}
          data-testid={`textarea-field-${label}`}
          disabled={disabled}
          {...props}
        />
      </div>
    ),
  ),
}));

vi.mock("@/components/ui/floating-select", () => ({
  FloatingSelect: ({
    children,
    value,
    onValueChange,
    label,
    disabled,
    multiple,
  }: any) => (
    <div data-testid={`select-wrapper-${label}`} data-disabled={disabled}>
      <label>{label}</label>
      <select
        multiple={multiple}
        onChange={(e) =>
          onValueChange(
            multiple
              ? Array.from(e.target.selectedOptions, (option) => option.value)
              : e.target.value,
          )
        }
        value={value}
        disabled={disabled}
        data-testid={`select-field-${label}`}
      >
        {children}
      </select>
    </div>
  ),
}));

vi.mock("@/components/ui/select", () => ({
  SelectItem: ({ value, children }: any) => (
    <option value={value}>{children}</option>
  ),
}));

describe("CvProjectsForm Component", () => {
  const mockAddCvProject = vi.fn();
  const mockUpdateCvProject = vi.fn();
  const mockGetAllSkills = vi.fn();
  const mockCloseEditing = vi.fn();

  const mockSkillsData = {
    skills: [
      { id: "s-1", name: "React" },
      { id: "s-2", name: "TypeScript" },
    ],
  };

  const mockInitialData: ICreateCvProjectForm = {
    name: "Billing Engine",
    domain: "Fintech",
    start_date: "2026-01-01",
    end_date: "2026-06-01",
    description: "Built microservices architectures",
    environment: ["TypeScript"],
    responsibilities: "Writing integration tests\nReviewing code",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    if (typeof window !== "undefined" && !window.PointerEvent) {
      window.PointerEvent = class extends Event {} as any;
    }

    (useParams as any).mockReturnValue({ id: "cv-777" });

    (useCvConstructor as any).mockReturnValue({
      addCvProject: mockAddCvProject,
      updateCvProject: mockUpdateCvProject,
    });

    (useSkills as any).mockReturnValue({
      getAllSkills: mockGetAllSkills,
      skills: mockSkillsData,
    });
  });

  describe("Add Mode Initialization & Mutations Flow", () => {
    it("should render the open trigger button with action text headers correctly", () => {
      render(<CvProjectsForm type="add" />);

      const triggerBtn = screen.getByRole("button", { name: /add project/i });
      expect(triggerBtn).toBeInTheDocument();
      expect(screen.queryByTestId("project-form")).not.toBeInTheDocument();
    });

    it("should launch skills query extraction when the dialogue open state fires", async () => {
      const user = userEvent.setup();
      render(<CvProjectsForm type="add" />);

      const triggerBtn = screen.getByRole("button", { name: /add project/i });
      await user.click(triggerBtn);

      expect(mockGetAllSkills).toHaveBeenCalledTimes(1);
      expect(
        screen.getByRole("heading", { name: /add project/i }),
      ).toBeInTheDocument();
    });

    it("should process custom form validation messages upon invalid parameter inputs submissions", async () => {
      const user = userEvent.setup();
      render(<CvProjectsForm type="add" />);

      await user.click(screen.getByRole("button", { name: /add project/i }));

      const submitBtn = screen.getByRole("button", { name: /^add$/i });
      await user.click(submitBtn);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Project is requiered!", {
          position: "top-right",
        });
      });
      expect(mockAddCvProject).not.toHaveBeenCalled();
    });

    it("should cleanly serialize complete text blocks and fire addCvProject mutation", async () => {
      const user = userEvent.setup();
      render(<CvProjectsForm type="add" />);

      await user.click(screen.getByRole("button", { name: /add project/i }));

      await user.type(
        screen.getByTestId("input-field-Project"),
        "Analytics UI",
      );
      await user.type(screen.getByTestId("input-field-Domain"), "SaaS");

      fireEvent.change(screen.getByTestId("input-field-Start date"), {
        target: { value: "2026-02-15" },
      });
      fireEvent.change(screen.getByTestId("input-field-End date"), {
        target: { value: "2026-12-20" },
      });

      await user.type(
        screen.getByTestId("textarea-field-Description"),
        "Dashboard monitoring tool",
      );

      const environmentSelect = screen.getByTestId("select-field-Environment");
      await user.selectOptions(environmentSelect, ["React"]);

      await user.type(
        screen.getByTestId("textarea-field-Responcibilities"),
        "Crafted analytics canvas layers",
      );

      const submitBtn = screen.getByRole("button", { name: /^add$/i });
      await user.click(submitBtn);

      await waitFor(() => {
        expect(mockAddCvProject).toHaveBeenCalledWith({
          name: "Analytics UI",
          domain: "SaaS",
          start_date: "2026-02-15",
          end_date: "2026-12-20",
          description: "Dashboard monitoring tool",
          environment: ["React"],
          responsibilities: "Crafted analytics canvas layers",
        });
      });
    });
  });

  describe("Edit Mode Form Constraints & Mutations Flow", () => {
    it("should mount modal dynamically and pre-populate parameters immediately", () => {
      render(
        <CvProjectsForm
          type="edit"
          id="project-id-888"
          editingId="project-id-888"
          closeEditing={mockCloseEditing}
          initialData={mockInitialData}
        />,
      );

      expect(
        screen.getByRole("heading", { name: /update project/i }),
      ).toBeInTheDocument();
      expect(screen.getByTestId("input-field-Project")).toHaveValue(
        "Billing Engine",
      );
      expect(screen.getByTestId("input-field-Domain")).toHaveValue("Fintech");
      expect(screen.getByTestId("textarea-field-Description")).toHaveValue(
        "Built microservices architectures",
      );
    });

    it("should append HTML disabled configuration blocks onto uneditable input objects", () => {
      render(
        <CvProjectsForm
          type="edit"
          id="project-id-888"
          editingId="project-id-888"
          closeEditing={mockCloseEditing}
          initialData={mockInitialData}
        />,
      );

      expect(screen.getByTestId("input-field-Project")).toBeDisabled();
      expect(screen.getByTestId("input-field-Domain")).toBeDisabled();
      expect(screen.getByTestId("textarea-field-Description")).toBeDisabled();
      expect(screen.getByTestId("select-field-Environment")).toBeDisabled();

      expect(screen.getByTestId("input-field-Start date")).not.toBeDisabled();
      expect(screen.getByTestId("input-field-End date")).not.toBeDisabled();
    });

    it("should enforce dirty state locks on submit trigger element buttons", () => {
      render(
        <CvProjectsForm
          type="edit"
          id="project-id-888"
          editingId="project-id-888"
          closeEditing={mockCloseEditing}
          initialData={mockInitialData}
        />,
      );

      const submitBtn = screen.getByRole("button", { name: /^update$/i });
      expect(submitBtn).toBeDisabled();
    });

    it("should release form lock states upon active parameters alteration and dispatch updates successfully", async () => {
      const user = userEvent.setup();
      render(
        <CvProjectsForm
          type="edit"
          id="project-id-888"
          editingId="project-id-888"
          closeEditing={mockCloseEditing}
          initialData={mockInitialData}
        />,
      );

      const endDateField = screen.getByTestId("input-field-End date");
      fireEvent.change(endDateField, { target: { value: "2026-11-01" } });

      const submitBtn = screen.getByRole("button", { name: /^update$/i });
      expect(submitBtn).not.toBeDisabled();
      await user.click(submitBtn);

      await waitFor(() => {
        expect(mockUpdateCvProject).toHaveBeenCalledWith(
          "project-id-888",
          expect.objectContaining({
            end_date: "2026-11-01",
          }),
        );
        expect(mockCloseEditing).toHaveBeenCalledTimes(1);
      });
    });
  });
});
