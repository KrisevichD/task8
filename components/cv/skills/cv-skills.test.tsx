import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

await vi.hoisted(async () => {
  await import("react");
});

import CvSkills from ".";

import useCvConstructor from "@/hooks/cvs/useCvConstructor";
import useSkills from "@/hooks/skills/useSkills";
import { ICvResponce } from "@/types/cv-constructor";

vi.mock("@/hooks/cvs/useCvConstructor", () => ({
  default: vi.fn(),
}));

vi.mock("@/hooks/skills/useSkills", () => ({
  default: vi.fn(),
}));

vi.mock("./form", () => ({
  default: () => <div data-testid="mock-skills-form" />,
}));

vi.mock("@/components/ui/icon", () => ({
  Icon: ({ variant }: { variant: string }) => (
    <span data-testid={`icon-${variant}`} />
  ),
}));

vi.mock("@/components/ui/spinner", () => ({
  Spinner: () => <div data-testid="spinner">Loading...</div>,
}));

vi.mock("@/components/ui/skill-badge", () => ({
  default: ({ variant }: { variant: string }) => (
    <span data-testid="skill-badge">{variant}</span>
  ),
}));

describe("CvSkills Component", () => {
  const mockDeleteCvSkill = vi.fn();
  const mockGetAllSkills = vi.fn();

  const mockCvData: ICvResponce = {
    id: "cv-555",
    name: "Engineering CV",
    skills: [
      { name: "React", categoryId: "cat-1", mastery: "Expert" },
      { name: "Node.js", categoryId: "cat-2", mastery: "Novice" },
    ],
    projects: [],
    languages: [],
    education: "MSc",
    description: "Profile description",
    user: { id: "u-1" } as any,
  };

  const mockCategories = [
    { id: "cat-1", name: "Frontend Development" },
    { id: "cat-2", name: "Backend Development" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    if (typeof window !== "undefined" && !window.PointerEvent) {
      window.PointerEvent = class extends Event {} as any;
    }

    (useCvConstructor as any).mockReturnValue({
      deleteCvSkill: mockDeleteCvSkill,
    });

    (useSkills as any).mockReturnValue({
      skillCategories: mockCategories,
      getAllSkills: mockGetAllSkills,
    });
  });

  describe("Line 52 Coverage (Early Spinner Return Checks)", () => {
    it("should render a Spinner if skills array list evaluates to undefined", () => {
      render(<CvSkills cvData={{ ...mockCvData, skills: null as any }} />);
      expect(screen.getByTestId("spinner")).toBeInTheDocument();
    });

    it("should render a Spinner if skillCategories array list evaluates to null", () => {
      (useSkills as any).mockReturnValue({ skillCategories: null });
      render(<CvSkills cvData={mockCvData} />);
      expect(screen.getByTestId("spinner")).toBeInTheDocument();
    });
  });

  describe("Layout Rendering and Group Mappings", () => {
    it("should aggregate data objects inside corresponding structural category heading cards", () => {
      render(<CvSkills cvData={mockCvData} />);

      expect(screen.getByText("Frontend Development")).toBeInTheDocument();
      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.getByText("Backend Development")).toBeInTheDocument();
      expect(screen.getByText("Node.js")).toBeInTheDocument();
    });
  });

  describe("Multi-Selection & Mutation Dispatches Flow", () => {
    it("should manage active pressed skill array lists variables upon single item click selections", async () => {
      const user = userEvent.setup();
      render(<CvSkills cvData={mockCvData} />);

      const reactToggle = screen.getByRole("button", { name: /react/i });

      await user.click(reactToggle);
      expect(
        screen.getByRole("button", { name: /delete/i }),
      ).toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument();

      await user.click(reactToggle);
      expect(
        screen.queryByRole("button", { name: /delete/i }),
      ).not.toBeInTheDocument();
    });

    it("should swap to showing the Cancel button if multiple selection items are checked simultaneously", async () => {
      const user = userEvent.setup();
      render(<CvSkills cvData={mockCvData} />);

      await user.click(screen.getByRole("button", { name: /react/i }));
      await user.click(screen.getByRole("button", { name: /node\.js/i }));

      const cancelBtn = screen.getByRole("button", { name: /cancel/i });
      expect(cancelBtn).toBeInTheDocument();

      await user.click(cancelBtn);
      expect(
        screen.queryByRole("button", { name: /cancel/i }),
      ).not.toBeInTheDocument();
    });

    it("should execute deleteCvSkill mutation when delete pressed actions complete", async () => {
      const user = userEvent.setup();
      render(<CvSkills cvData={mockCvData} />);

      await user.click(screen.getByRole("button", { name: /react/i }));

      const deleteBtn = screen.getByRole("button", { name: /delete/i });
      await user.click(deleteBtn);

      expect(mockDeleteCvSkill).toHaveBeenCalledWith(["React"]);
    });

    it("should launch AlertDialog overlay boxes and support clear-all cascades operations", async () => {
      const user = userEvent.setup();
      render(<CvSkills cvData={mockCvData} />);

      const removeSkillsBtn = screen.getByRole("button", {
        name: /remove skills/i,
      });
      await user.click(removeSkillsBtn);

      expect(screen.getByText("Are you absolutely sure?")).toBeInTheDocument();

      const continueBtn = screen.getByRole("button", { name: /continue/i });
      await user.click(continueBtn);

      expect(mockDeleteCvSkill).toHaveBeenCalledWith(["React", "Node.js"]);
    });
  });
});
