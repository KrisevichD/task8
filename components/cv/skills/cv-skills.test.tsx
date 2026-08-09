import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import CvSkills from ".";

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

vi.mock("./form", () => ({
  default: vi.fn(() => <div data-testid="cv-skills-form-mock" />),
}));

describe("CvSkills Component", () => {
  const mockDeleteCvSkill = vi.fn();

  const mockSkills: IProfileSkill[] = [
    { name: "React", categoryId: "cat-1", mastery: "Expert" } as IProfileSkill,
    {
      name: "Node.js",
      categoryId: "cat-2",
      mastery: "Novice",
    } as IProfileSkill,
  ];

  const mockCvData: ICvResponce = {
    id: "cv-123",
    user: { id: "user-123" },
    skills: mockSkills,
  } as unknown as ICvResponce;

  const mockCategories = [
    { id: "cat-1", name: "Frontend" },
    { id: "cat-2", name: "Backend" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    (useCvConstructor as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      deleteCvSkill: mockDeleteCvSkill,
    });

    (useSkills as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      skillCategories: mockCategories,
    });
  });

  it("renders spinner when skills or skillCategories are missing", () => {
    (useSkills as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      skillCategories: null,
    });

    render(<CvSkills cvData={mockCvData} />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders categories and list of skills correctly", () => {
    render(<CvSkills cvData={mockCvData} />);

    expect(screen.getByText("Frontend")).toBeInTheDocument();
    expect(screen.getByText("Backend")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /react/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /node\.js/i }),
    ).toBeInTheDocument();
  });

  it("selects skill on click and shows DELETE button with selected count badge", async () => {
    const user = userEvent.setup();

    render(<CvSkills cvData={mockCvData} />);

    const reactSkillBtn = screen.getByRole("button", { name: /react/i });

    await user.click(reactSkillBtn);

    const deleteBtn = screen.getByRole("button", { name: /delete/i });
    expect(deleteBtn).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("calls deleteCvSkill with selected skills when clicking DELETE", async () => {
    const user = userEvent.setup();

    render(<CvSkills cvData={mockCvData} />);

    await user.click(screen.getByRole("button", { name: /react/i }));

    const deleteBtn = screen.getByRole("button", { name: /delete/i });
    await user.click(deleteBtn);

    await waitFor(() => {
      expect(mockDeleteCvSkill).toHaveBeenCalledWith(["React"]);
    });
  });

  it("opens confirm dialog and clears all skills when confirming REMOVE SKILLS", async () => {
    const user = userEvent.setup();

    render(<CvSkills cvData={mockCvData} />);

    const removeAllBtn = screen.getByRole("button", { name: /remove skills/i });
    await user.click(removeAllBtn);

    expect(screen.getByText("Are you absolutely sure?")).toBeInTheDocument();

    const continueBtn = screen.getByRole("button", { name: /continue/i });
    await user.click(continueBtn);

    await waitFor(() => {
      expect(mockDeleteCvSkill).toHaveBeenCalledWith(["React", "Node.js"]);
    });
  });
});
