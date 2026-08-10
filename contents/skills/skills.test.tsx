import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import SkillsContent from ".";

import { useMe } from "@/hooks/auth/useMe";
import useSkills from "@/hooks/skills/useSkills";
import { IProfileSkill } from "@/types/skills";

vi.mock("@/hooks/auth/useMe", () => ({
  useMe: vi.fn(),
}));

vi.mock("@/hooks/skills/useSkills", () => ({
  default: vi.fn(),
}));

vi.mock("@/components/skills-form", () => ({
  default: ({ cancelEditing }: { cancelEditing: () => void }) => (
    <div>
      <span data-testid="skills-form">Skills Form</span>
      <button onClick={cancelEditing}>Cancel Form</button>
    </div>
  ),
}));

vi.mock("@/components/ui/skill-badge", () => ({
  default: ({ variant }: { variant: string }) => (
    <span data-testid="skill-badge">{variant}</span>
  ),
}));

vi.mock("@/components/ui/icon", () => ({
  Icon: ({ variant }: { variant: string }) => (
    <span data-testid={`icon-${variant}`} />
  ),
}));

describe("SkillsContent Component", () => {
  const mockDeleteProfileSkills = vi.fn();

  const mockCategories = [
    { id: "cat-1", name: "Frontend" },
    { id: "cat-2", name: "Backend" },
  ];

  const mockSkills: IProfileSkill[] = [
    {
      name: "React",
      categoryId: "cat-1",
      mastery: "Advanced",
    } as unknown as IProfileSkill,
    {
      name: "Node.js",
      categoryId: "cat-2",
      mastery: "Intermediate",
    } as unknown as IProfileSkill,
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    if (typeof window !== "undefined" && !window.PointerEvent) {
      window.PointerEvent = class extends Event {} as any;
    }

    (useSkills as ReturnType<typeof vi.fn>).mockReturnValue({
      skillCategories: mockCategories,
      isCategoriesLoading: false,
      deleteProfileSkills: mockDeleteProfileSkills,
    });

    (useMe as ReturnType<typeof vi.fn>).mockReturnValue({
      skills: mockSkills,
      isLoading: false,
      error: null,
    });
  });

  describe("Initial States & Render", () => {
    it("renders error message when loading skills fails", () => {
      (useMe as ReturnType<typeof vi.fn>).mockReturnValue({
        skills: null,
        isLoading: false,
        error: new Error("Failed to load skills"),
      });

      render(<SkillsContent userId="user-1" />);

      expect(screen.getByText("Error loading skills")).toBeInTheDocument();
    });

    it("renders spinner component while loading categories or skills", () => {
      (useMe as ReturnType<typeof vi.fn>).mockReturnValue({
        skills: null,
        isLoading: true,
        error: null,
      });

      render(<SkillsContent userId="user-1" />);

      expect(
        screen.getByRole("status", { name: /loading/i }),
      ).toBeInTheDocument();
    });
  });

  describe("Selection & Toggle Logic", () => {
    it("selects a skill when clicked and displays DELETE button with badge count 1", async () => {
      const user = userEvent.setup();

      render(<SkillsContent userId="user-1" />);

      const reactToggle = screen.getByRole("button", { name: /react/i });
      await user.click(reactToggle);

      const deleteBtn = screen.getByRole("button", { name: /delete/i });
      expect(deleteBtn).toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument();
    });

    it("renders CANCEL button when more than 1 skill is selected", async () => {
      const user = userEvent.setup();

      render(<SkillsContent userId="user-1" />);

      await user.click(screen.getByRole("button", { name: /react/i }));
      await user.click(screen.getByRole("button", { name: /node\.js/i }));

      expect(screen.queryByTestId("skills-form")).not.toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /cancel/i }),
      ).toBeInTheDocument();
    });

    it("resets selection when CANCEL button is clicked", async () => {
      const user = userEvent.setup();

      render(<SkillsContent userId="user-1" />);

      await user.click(screen.getByRole("button", { name: /react/i }));
      await user.click(screen.getByRole("button", { name: /node\.js/i }));

      const cancelBtn = screen.getByRole("button", { name: /cancel/i });
      await user.click(cancelBtn);

      expect(screen.getByTestId("skills-form")).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: /delete/i }),
      ).not.toBeInTheDocument();
    });
  });

  describe("Delete Operations", () => {
    it("deletes selected skills when DELETE button is pressed", async () => {
      const user = userEvent.setup();

      render(<SkillsContent userId="user-1" />);

      await user.click(screen.getByRole("button", { name: /react/i }));

      const deleteBtn = screen.getByRole("button", { name: /delete/i });
      await user.click(deleteBtn);

      expect(mockDeleteProfileSkills).toHaveBeenCalledWith(["React"]);
    });

    it("opens confirm modal and deletes all skills when REMOVE SKILLS is pressed", async () => {
      const user = userEvent.setup();

      render(<SkillsContent userId="user-1" />);

      const removeSkillsBtn = screen.getByRole("button", {
        name: /remove skills/i,
      });
      await user.click(removeSkillsBtn);

      expect(screen.getByText("Are you absolutely sure?")).toBeInTheDocument();

      const continueBtn = screen.getByRole("button", { name: /continue/i });
      await user.click(continueBtn);

      await waitFor(() => {
        expect(mockDeleteProfileSkills).toHaveBeenCalledWith([
          "React",
          "Node.js",
        ]);
      });
    });
  });
});
