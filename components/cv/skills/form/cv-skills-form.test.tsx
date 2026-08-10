import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";

await vi.hoisted(async () => {
  await import("react");
});

import CvSkillsForm from ".";

import useCvConstructor from "@/hooks/cvs/useCvConstructor";
import useSkills from "@/hooks/skills/useSkills";
import { ICvResponce } from "@/types/cv-constructor";
import { IProfileSkill } from "@/types/skills";

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
      <select
        data-testid={`select-field-${label}`}
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

describe("CvSkillsForm Component", () => {
  const mockCancelEditing = vi.fn();
  const mockAddCvSkill = vi.fn();
  const mockUpdateCvSkill = vi.fn();
  const mockGetAllSkills = vi.fn();

  const mockCvData: ICvResponce = {
    id: "cv-777",
    name: "Frontend CV",
    skills: [{ name: "React", categoryId: "cat-1", mastery: "Expert" }],
    projects: [],
    languages: [],
    education: "BSc",
    description: "Overview",
    user: {} as any,
  };

  const mockSkillsArray = [
    { name: "React", category: { id: "cat-1" } },
    { name: "Vue", category: { id: "cat-1" } },
    { name: "Node.js", category: { id: "cat-2" } },
  ];

  const defaultProps = {
    selectedSkills: [],
    cancelEditing: mockCancelEditing,
    userId: "user-123",
    cvData: mockCvData,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    if (typeof window !== "undefined" && !window.PointerEvent) {
      window.PointerEvent = class extends Event {} as any;
    }

    (useCvConstructor as any).mockReturnValue({
      addCvSkill: mockAddCvSkill,
      updateCvSkill: mockUpdateCvSkill,
    });

    (useSkills as any).mockReturnValue({
      getAllSkills: mockGetAllSkills,
      skills: { skills: mockSkillsArray },
      isSkillsLoading: false,
      isAddingLoading: false,
      isUpdatingLoading: false,
    });
  });

  describe("Add Mode (Adding new skill to CV)", () => {
    it("should render open trigger button matching dictionary layouts", () => {
      render(<CvSkillsForm {...defaultProps} />);

      const triggerBtn = screen.getByRole("button", { name: /add skill/i });
      expect(triggerBtn).toBeInTheDocument();
    });

    it("should launch skills extraction and correctly filter out already added CV parameters", async () => {
      const user = userEvent.setup();
      render(<CvSkillsForm {...defaultProps} />);

      const triggerBtn = screen.getByRole("button", { name: /add skill/i });
      await user.click(triggerBtn);

      expect(mockGetAllSkills).toHaveBeenCalledTimes(1);

      expect(
        screen.queryByRole("option", { name: "React" }),
      ).not.toBeInTheDocument();
      expect(screen.getByRole("option", { name: "Vue" })).toBeInTheDocument();
      expect(
        screen.getByRole("option", { name: "Node.js" }),
      ).toBeInTheDocument();
    });

    it("should trigger toast notifications if submission variables remain empty", async () => {
      const user = userEvent.setup();
      render(<CvSkillsForm {...defaultProps} />);

      await user.click(screen.getByRole("button", { name: /add skill/i }));

      const submitBtn = screen.getByRole("button", { name: /^add$/i });
      await user.click(submitBtn);

      expect(toast.error).toHaveBeenCalledWith("Choose skill", {
        position: "top-right",
      });
      expect(mockAddCvSkill).not.toHaveBeenCalled();
    });

    it("should dispatch addCvSkill mutation safely with select values", async () => {
      const user = userEvent.setup();
      render(<CvSkillsForm {...defaultProps} />);

      await user.click(screen.getByRole("button", { name: /add skill/i }));

      const skillSelect = screen.getByTestId("select-field-Skill");
      await user.selectOptions(skillSelect, "Vue");

      const masterySelect = screen.getByTestId("select-field-skill mastery");
      await user.selectOptions(masterySelect, "Advanced");

      const submitBtn = screen.getByRole("button", { name: /^add$/i });
      await user.click(submitBtn);

      expect(mockAddCvSkill).toHaveBeenCalledWith({
        name: "Vue",
        mastery: "Advanced",
        categoryId: "cat-1",
      });
      expect(mockCancelEditing).toHaveBeenCalledTimes(1);
    });
  });

  describe("Edit Mode (Updating existing CV skill)", () => {
    const activeSelectedSkill: IProfileSkill[] = [
      { name: "React", categoryId: "cat-1", mastery: "Advanced" },
    ];

    it("should transform headers and lock name fields upon single element select configuration", () => {
      render(
        <CvSkillsForm {...defaultProps} selectedSkills={activeSelectedSkill} />,
      );

      const triggerBtn = screen.getByRole("button", { name: /update skill/i });
      expect(triggerBtn).toBeInTheDocument();
    });

    it("should enforce uneditable restrictions onto skill selection inputs", async () => {
      const user = userEvent.setup();
      render(
        <CvSkillsForm {...defaultProps} selectedSkills={activeSelectedSkill} />,
      );

      await user.click(screen.getByRole("button", { name: /update skill/i }));

      const skillWrapper = screen.getByTestId("select-wrapper-Skill");
      expect(skillWrapper).toHaveAttribute("data-disabled", "true");
    });

    it("should keep trigger action button locked if values match initial states parameters", async () => {
      const user = userEvent.setup();
      render(
        <CvSkillsForm {...defaultProps} selectedSkills={activeSelectedSkill} />,
      );

      await user.click(screen.getByRole("button", { name: /update skill/i }));

      const submitBtn = screen.getByRole("button", { name: /^update$/i });
      expect(submitBtn).toBeDisabled();
    });

    it("should unlock update submission pathing when mastery level parameters are changed", async () => {
      const user = userEvent.setup();
      render(
        <CvSkillsForm {...defaultProps} selectedSkills={activeSelectedSkill} />,
      );

      await user.click(screen.getByRole("button", { name: /update skill/i }));

      const masterySelect = screen.getByTestId("select-field-skill mastery");
      await user.selectOptions(masterySelect, "Expert");

      const submitBtn = screen.getByRole("button", { name: /^update$/i });
      expect(submitBtn).not.toBeDisabled();
      await user.click(submitBtn);

      expect(mockUpdateCvSkill).toHaveBeenCalledWith({
        name: "React",
        mastery: "Expert",
        categoryId: "cat-1",
      });
      expect(mockCancelEditing).toHaveBeenCalledTimes(1);
    });
  });
});
