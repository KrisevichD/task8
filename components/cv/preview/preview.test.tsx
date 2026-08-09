import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import CvPreview from ".";

import { useMe } from "@/hooks/auth/useMe";
import useExportPdf from "@/hooks/cvs/useExportPdf";
import useSkills from "@/hooks/skills/useSkills";
import { ICvResponce } from "@/types/cv-constructor";

vi.mock("@/hooks/auth/useMe", () => ({
  useMe: vi.fn(),
}));

vi.mock("@/hooks/skills/useSkills", () => ({
  default: vi.fn(),
}));

vi.mock("@/hooks/cvs/useExportPdf", () => ({
  default: vi.fn(),
}));

vi.mock("@/utils/helpers", () => ({
  validateProjectDate: (date: string) => date,
}));

describe("CvPreview Component", () => {
  const mockHandleDownloadPdf = vi.fn();

  const mockCvData: ICvResponce = {
    id: "cv-1",
    user: { id: "user-123" },
    name: "Fullstack Developer CV",
    education: "Stanford University",
    description: "Senior Software Engineer with 5+ years of experience",
    skills: [
      { name: "React", categoryId: "cat-frontend" },
      { name: "Node.js", categoryId: "cat-backend" },
    ],
    projects: [
      {
        id: "proj-1",
        name: "E-Commerce App",
        domain: "Retail",
        description: "Built scalable web shop",
        start_date: "2023-01-01",
        end_date: "2024-01-01",
        responsibilities: ["Frontend lead", "API Integration"],
        environment: ["React", "TypeScript", "Tailwind"],
      },
    ],
  } as unknown as ICvResponce;

  const mockSkillCategories = [
    { id: "cat-frontend", name: "Frontend" },
    { id: "cat-backend", name: "Backend" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    (useMe as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      fullName: "Alex Johnson",
      positionName: "Frontend Developer",
      languages: [{ name: "English", proficiency: "C1" }],
    });

    (useSkills as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      skillCategories: mockSkillCategories,
    });

    (useExportPdf as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      printRef: { current: null },
      handleDownloadPdf: mockHandleDownloadPdf,
    });
  });

  it("renders spinner when skillCategories is null/undefined", () => {
    (useSkills as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      skillCategories: null,
    });

    render(<CvPreview cvData={mockCvData} />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders full CV preview data correctly", () => {
    render(<CvPreview cvData={mockCvData} />);

    expect(screen.getByText("Alex Johnson")).toBeInTheDocument();
    expect(screen.getAllByText("Frontend Developer").length).toBeGreaterThan(0);
    expect(screen.getByText("English, C1")).toBeInTheDocument();

    expect(screen.getByText("Stanford University")).toBeInTheDocument();
    expect(screen.getByText("Fullstack Developer CV")).toBeInTheDocument();
    expect(
      screen.getByText("Senior Software Engineer with 5+ years of experience"),
    ).toBeInTheDocument();

    expect(screen.getByText("E-Commerce App")).toBeInTheDocument();
    expect(screen.getByText("Retail")).toBeInTheDocument();

    expect(screen.getByText("Frontend lead")).toBeInTheDocument();

    expect(screen.getAllByText("Frontend").length).toBeGreaterThan(0);
    expect(screen.getAllByText("React").length).toBeGreaterThan(0);
  });

  it("calls handleDownloadPdf when clicking EXPORT PDF button", async () => {
    const user = userEvent.setup();

    render(<CvPreview cvData={mockCvData} />);

    const exportBtn = screen.getByRole("button", { name: /export pdf/i });
    await user.click(exportBtn);

    expect(mockHandleDownloadPdf).toHaveBeenCalledTimes(1);
  });
});
