import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";

import CvSkillsForm from ".";

import useCvConstructor from "@/hooks/cvs/useCvConstructor";
import useSkills from "@/hooks/skills/useSkills";
import { ICvResponce } from "@/types/cv-constructor";
import { IProfileSkill } from "@/types/skills";

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

vi.mock("@/hooks/cvs/useCvConstructor", () => ({
  default: vi.fn(),
}));

vi.mock("@/hooks/skills/useSkills", () => ({
  default: vi.fn(),
}));

describe("CvSkillsForm Component", () => {
  const mockAddCvSkill = vi.fn();
  const mockUpdateCvSkill = vi.fn();
  const mockGetAllSkills = vi.fn();
  const mockCancelEditing = vi.fn();

  const mockCvData = {
    id: "cv-123",
    skills: [{ name: "CSS", categoryId: "cat-1" }],
  } as unknown as ICvResponce;

  const mockAllSkills = {
    skills: [
      { name: "React", category: { id: "cat-1" } },
      { name: "CSS", category: { id: "cat-1" } },
      { name: "Node.js", category: { id: "cat-2" } },
    ],
  };

  const mockSelectedSkills: IProfileSkill[] = [
    {
      id: "skill-1",
      name: "React",
      mastery: "Advanced",
      categoryId: "cat-1",
    } as unknown as IProfileSkill,
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    (useCvConstructor as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      addCvSkill: mockAddCvSkill,
      updateCvSkill: mockUpdateCvSkill,
    });

    (useSkills as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      getAllSkills: mockGetAllSkills,
      skills: mockAllSkills,
      isSkillsLoading: false,
      isAddingLoading: false,
      isUpdatingLoading: false,
    });
  });

  describe("Add Mode (Adding new skill to CV)", () => {
    it("renders ADD SKILL button and calls getAllSkills on click", async () => {
      const user = userEvent.setup();

      render(
        <CvSkillsForm
          selectedSkills={[]}
          cancelEditing={mockCancelEditing}
          cvData={mockCvData}
        />,
      );

      const triggerBtn = screen.getByRole("button", { name: /add skill/i });
      expect(triggerBtn).toBeInTheDocument();

      await user.click(triggerBtn);

      expect(mockGetAllSkills).toHaveBeenCalledTimes(1);
      expect(
        screen.getByRole("heading", { name: /add skill/i }),
      ).toBeInTheDocument();
    });

    it("triggers toast error if submitted without choosing a skill", async () => {
      const user = userEvent.setup();

      render(
        <CvSkillsForm
          selectedSkills={[]}
          cancelEditing={mockCancelEditing}
          cvData={mockCvData}
        />,
      );

      await user.click(screen.getByRole("button", { name: /add skill/i }));

      const submitBtn = screen.getByRole("button", { name: /^add$/i });
      await user.click(submitBtn);

      expect(toast.error).toHaveBeenCalledWith("Choose skill", {
        position: "top-right",
      });
      expect(mockAddCvSkill).not.toHaveBeenCalled();
    });

    it("submits new skill when skill and mastery level are selected", async () => {
      const user = userEvent.setup();

      render(
        <CvSkillsForm
          selectedSkills={[]}
          cancelEditing={mockCancelEditing}
          cvData={mockCvData}
        />,
      );

      await user.click(screen.getByRole("button", { name: /add skill/i }));

      const comboboxes = screen.getAllByRole("combobox");
      await user.click(comboboxes[0]);

      const reactOption = await screen.findByText("React");
      await user.click(reactOption);

      const submitBtn = screen.getByRole("button", { name: /^add$/i });
      await user.click(submitBtn);

      await waitFor(() => {
        expect(mockAddCvSkill).toHaveBeenCalledWith({
          name: "React",
          mastery: "Novice",
          categoryId: "cat-1",
        });
        expect(mockCancelEditing).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("Edit Mode (Updating existing CV skill)", () => {
    it("disables update submit button until mastery level changes", async () => {
      const user = userEvent.setup();

      render(
        <CvSkillsForm
          selectedSkills={mockSelectedSkills}
          cancelEditing={mockCancelEditing}
          cvData={mockCvData}
        />,
      );

      const triggerBtn = screen.getByRole("button", { name: /update skill/i });
      await user.click(triggerBtn);

      const submitBtn = screen.getByRole("button", { name: /^update$/i });
      expect(submitBtn).toBeDisabled();
    });

    it("submits updated skill mastery on change", async () => {
      const user = userEvent.setup();

      render(
        <CvSkillsForm
          selectedSkills={mockSelectedSkills}
          cancelEditing={mockCancelEditing}
          cvData={mockCvData}
        />,
      );

      await user.click(screen.getByRole("button", { name: /update skill/i }));

      const comboboxes = screen.getAllByRole("combobox");
      await user.click(comboboxes[1]);

      const expertOption = await screen.findByText("Expert");
      await user.click(expertOption);

      const submitBtn = screen.getByRole("button", { name: /^update$/i });
      expect(submitBtn).not.toBeDisabled();

      await user.click(submitBtn);

      await waitFor(() => {
        expect(mockUpdateCvSkill).toHaveBeenCalledWith({
          name: "React",
          mastery: "Expert",
          categoryId: "cat-1",
        });
        expect(mockCancelEditing).toHaveBeenCalledTimes(1);
      });
    });
  });
});
