import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";

import SkillsForm from ".";

import useSkills from "@/hooks/skills/useSkills";
import { IProfileSkill, ISkill } from "@/types/skills";

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

vi.mock("@/components/ui/floating-select", () => ({
  FloatingSelect: ({
    children,
    value,
    onValueChange,
    label,
    disabled,
  }: any) => (
    <div data-testid={`select-wrapper-${label}`} data-disabled={disabled}>
      <label>{label}</label>
      <input
        data-testid={`select-input-${label}`}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        disabled={disabled}
      />
      <select
        onChange={(e) => onValueChange(e.target.value)}
        value={value}
        disabled={disabled}
      >
        <option value="">Select option</option>
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

describe("SkillsForm Component", () => {
  const mockCancelEditing = vi.fn();
  const mockGetAllSkills = vi.fn();
  const mockAddProfileSkill = vi.fn();
  const mockUpdateProfileSkill = vi.fn();

  const mockFilteredSkills: ISkill[] = [
    { name: "React", category: { id: "cat-1" } } as ISkill,
    { name: "Node.js", category: { id: "cat-2" } } as ISkill,
  ];

  const defaultProps = {
    selectedSkills: [],
    cancelEditing: mockCancelEditing,
    userId: "user-123",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    if (typeof window !== "undefined" && !window.PointerEvent) {
      window.PointerEvent = class extends Event {} as any;
    }

    (useSkills as any).mockReturnValue({
      getAllSkills: mockGetAllSkills,
      filteredSkills: mockFilteredSkills,
      isSkillsLoading: false,
      addProfileSkill: mockAddProfileSkill,
      updateProfileSkill: mockUpdateProfileSkill,
      isUpdatingLoading: false,
    });
  });

  describe("Add Mode Rendering and Execution Flow", () => {
    it("should render the 'add skill' button in initial hidden state", () => {
      render(<SkillsForm {...defaultProps} />);

      const triggerBtn = screen.getByRole("button", { name: /add skill/i });
      expect(triggerBtn).toBeInTheDocument();
      expect(screen.queryByText(/skill mastery/i)).not.toBeInTheDocument();
    });

    it("should trigger getAllSkills query compilation upon modal open states", async () => {
      const user = userEvent.setup();
      render(<SkillsForm {...defaultProps} />);

      const triggerBtn = screen.getByRole("button", { name: /add skill/i });
      await user.click(triggerBtn);

      expect(mockGetAllSkills).toHaveBeenCalledTimes(1);
      expect(
        screen.getByRole("heading", { name: /add skill/i }),
      ).toBeInTheDocument();
    });

    it("should throw a toast error message context when submitting with empty variables", async () => {
      const user = userEvent.setup();
      render(<SkillsForm {...defaultProps} />);

      await user.click(screen.getByRole("button", { name: /add skill/i }));

      const submitBtn = screen.getByRole("button", { name: /^add$/i });
      await user.click(submitBtn);

      expect(toast.error).toHaveBeenCalledWith("Choose skill", {
        position: "top-right",
      });
      expect(mockAddProfileSkill).not.toHaveBeenCalled();
    });

    it("should process skill addition mutations smoothly upon valid inputs selection", async () => {
      const user = userEvent.setup();
      render(<SkillsForm {...defaultProps} />);

      await user.click(screen.getByRole("button", { name: /add skill/i }));

      const skillSelect = screen.getByTestId("select-input-Skill");
      fireEvent.change(skillSelect, { target: { value: "React" } });

      const masterySelect = screen.getByTestId("select-input-skill mastery");
      fireEvent.change(masterySelect, { target: { value: "Advanced" } });

      const submitBtn = screen.getByRole("button", { name: /^add$/i });
      await user.click(submitBtn);

      expect(mockAddProfileSkill).toHaveBeenCalledWith({
        name: "React",
        mastery: "Advanced",
        categoryId: "cat-1",
      });
      expect(mockCancelEditing).toHaveBeenCalledTimes(1);
    });
  });

  describe("Edit Mode Pre-population and Casing Rules", () => {
    const activeSelectedSkill: IProfileSkill[] = [
      { name: "Node.js", categoryId: "cat-2", mastery: "Competent" },
    ];

    it("should adapt to 'update skill' text schemas when exactly one item is received", () => {
      render(
        <SkillsForm {...defaultProps} selectedSkills={activeSelectedSkill} />,
      );

      const triggerBtn = screen.getByRole("button", { name: /update skill/i });
      expect(triggerBtn).toBeInTheDocument();
    });

    it("should enforce disabled status constraints on skill name entries inside update states", async () => {
      const user = userEvent.setup();
      render(
        <SkillsForm {...defaultProps} selectedSkills={activeSelectedSkill} />,
      );

      await user.click(screen.getByRole("button", { name: /update skill/i }));

      const skillWrapper = screen.getByTestId("select-wrapper-Skill");
      expect(skillWrapper).toHaveAttribute("data-disabled", "true");
    });

    it("should block update execution workflows if mastery parameters stay unmutated", async () => {
      const user = userEvent.setup();
      render(
        <SkillsForm {...defaultProps} selectedSkills={activeSelectedSkill} />,
      );

      await user.click(screen.getByRole("button", { name: /update skill/i }));

      const submitBtn = screen.getByRole("button", { name: /^update$/i });
      expect(submitBtn).toBeDisabled();
    });

    it("should call updateProfileSkill when skill variables transition smoothly", async () => {
      const user = userEvent.setup();
      render(
        <SkillsForm {...defaultProps} selectedSkills={activeSelectedSkill} />,
      );

      await user.click(screen.getByRole("button", { name: /update skill/i }));

      const masterySelect = screen.getByTestId("select-input-skill mastery");
      fireEvent.change(masterySelect, { target: { value: "Expert" } });

      const submitBtn = screen.getByRole("button", { name: /^update$/i });
      expect(submitBtn).not.toBeDisabled();
      await user.click(submitBtn);

      expect(mockUpdateProfileSkill).toHaveBeenCalledWith({
        name: "Node.js",
        mastery: "Expert",
        categoryId: "cat-2",
      });
      expect(mockCancelEditing).toHaveBeenCalledTimes(1);
    });
  });
});
