import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";

import SkillsForm from ".";

import useSkills from "@/hooks/skills/useSkills";
import { IProfileSkill } from "@/types/skills";

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

vi.mock("@/hooks/skills/useSkills", () => ({
  default: vi.fn(),
}));

describe("SkillsForm Component", () => {
  const mockGetAllSkills = vi.fn();
  const mockAddProfileSkill = vi.fn();
  const mockUpdateProfileSkill = vi.fn();
  const mockCancelEditing = vi.fn();

  const mockSkillsList = [
    { name: "React", category: { id: "cat-1" } },
    { name: "TypeScript", category: { id: "cat-2" } },
  ];

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

    (useSkills as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      getAllSkills: mockGetAllSkills,
      filteredSkills: mockSkillsList,
      isSkillsLoading: false,
      addProfileSkill: mockAddProfileSkill,
      updateProfileSkill: mockUpdateProfileSkill,
      isUpdatingLoading: false,
    });
  });

  describe("Add Mode (Adding new skill)", () => {
    it("renders ADD SKILL button and calls getAllSkills when opened", async () => {
      const user = userEvent.setup();

      render(
        <SkillsForm selectedSkills={[]} cancelEditing={mockCancelEditing} />,
      );

      const triggerBtn = screen.getByRole("button", { name: /add skill/i });
      expect(triggerBtn).toBeInTheDocument();

      await user.click(triggerBtn);

      expect(mockGetAllSkills).toHaveBeenCalledTimes(1);
      expect(
        screen.getByRole("heading", { name: /add skill/i }),
      ).toBeInTheDocument();
    });

    it("shows error toast if form is submitted without selecting a skill", async () => {
      const user = userEvent.setup();

      render(
        <SkillsForm selectedSkills={[]} cancelEditing={mockCancelEditing} />,
      );

      await user.click(screen.getByRole("button", { name: /add skill/i }));

      const submitBtn = screen.getByRole("button", { name: /^add$/i });
      await user.click(submitBtn);

      expect(toast.error).toHaveBeenCalledWith("Choose skill", {
        position: "top-right",
      });
      expect(mockAddProfileSkill).not.toHaveBeenCalled();
    });
  });

  describe("Edit Mode (Updating existing skill)", () => {
    it("renders UPDATE SKILL button and prefills current skill mastery", async () => {
      const user = userEvent.setup();

      render(
        <SkillsForm
          selectedSkills={mockSelectedSkills}
          cancelEditing={mockCancelEditing}
        />,
      );

      const triggerBtn = screen.getByRole("button", { name: /update skill/i });
      expect(triggerBtn).toBeInTheDocument();

      await user.click(triggerBtn);

      const submitBtn = screen.getByRole("button", { name: /^update$/i });
      expect(submitBtn).toBeDisabled();
    });

    it("submits updated skill when mastery level changes", async () => {
      const user = userEvent.setup();

      render(
        <SkillsForm
          selectedSkills={mockSelectedSkills}
          cancelEditing={mockCancelEditing}
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
        expect(mockUpdateProfileSkill).toHaveBeenCalledWith({
          name: "React",
          mastery: "Expert",
          categoryId: "cat-1",
        });
        expect(mockCancelEditing).toHaveBeenCalledTimes(1);
      });
    });
  });
});
