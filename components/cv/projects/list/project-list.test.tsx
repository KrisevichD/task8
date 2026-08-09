import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useParams } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";

import CvProjectsList from ".";

import useCvConstructor from "@/hooks/cvs/useCvConstructor";
import { ICvProject, ICvResponce } from "@/types/cv-constructor";

vi.mock("next/navigation", () => ({
  useParams: vi.fn(),
}));

vi.mock("@/hooks/cvs/useCvConstructor", () => ({
  default: vi.fn(),
}));

vi.mock("@/utils/helpers", () => ({
  validateProjectDate: (date: string) => date,
}));

vi.mock("../form", () => ({
  default: vi.fn(() => <div data-testid="cv-projects-form-mock" />),
}));

describe("CvProjectsList Component", () => {
  const mockDeleteCvProject = vi.fn();

  const mockProject: ICvProject = {
    id: "proj-item-1",
    name: "E-Commerce System",
    domain: "Retail",
    start_date: "2023-01-01",
    end_date: "2024-01-01",
    description: "High-load online store",
    environment: ["React", "TypeScript"],
    responsibilities: ["Frontend Lead", "Code Review"],
    project: { id: "p-1" },
  } as unknown as ICvProject;

  const mockCvData: ICvResponce = {
    id: "cv-123",
    projects: [
      mockProject,
      {
        id: "proj-item-2",
        name: "Banking App",
        domain: "Fintech",
        start_date: "2022-01-01",
        end_date: "2022-12-31",
        description: "Mobile banking interface",
        environment: ["React Native"],
        responsibilities: ["UI Developer"],
        project: { id: "p-2" },
      } as unknown as ICvProject,
    ],
  } as unknown as ICvResponce;

  beforeEach(() => {
    vi.clearAllMocks();

    (useParams as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      id: "cv-123",
    });

    (useCvConstructor as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      cvData: mockCvData,
      deleteCvProject: mockDeleteCvProject,
    });
  });

  it("renders spinner when cvData is missing", () => {
    (useCvConstructor as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      cvData: null,
      deleteCvProject: mockDeleteCvProject,
    });

    render(<CvProjectsList />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders list of projects correctly", () => {
    render(<CvProjectsList />);

    expect(screen.getByText("E-Commerce System")).toBeInTheDocument();
    expect(screen.getByText("Retail")).toBeInTheDocument();
    expect(screen.getByText("High-load online store")).toBeInTheDocument();
    expect(screen.getByText("Frontend Lead")).toBeInTheDocument();

    expect(screen.getByText("Banking App")).toBeInTheDocument();
    expect(screen.getByText("Fintech")).toBeInTheDocument();
  });

  it("filters projects according to searchQuery", () => {
    render(<CvProjectsList searchQuery="Fintech" />);

    expect(screen.getByText("Banking App")).toBeInTheDocument();
    expect(screen.queryByText("E-Commerce System")).not.toBeInTheDocument();
  });

  it("shows 'No matches found' when searchQuery does not match any project", () => {
    render(<CvProjectsList searchQuery="Crypto" />);

    expect(screen.getByText("No matches found")).toBeInTheDocument();
  });

  it("calls deleteCvProject when clicking Delete in dropdown menu", async () => {
    const user = userEvent.setup();

    render(<CvProjectsList />);

    const settingsBtns = screen.getAllByRole("button", {
      name: /open settings/i,
    });
    await user.click(settingsBtns[0]);

    const deleteOption = await screen.findByText("Delete");
    await user.click(deleteOption);

    await waitFor(() => {
      expect(mockDeleteCvProject).toHaveBeenCalledWith({
        cvId: "cv-123",
        project: mockProject,
      });
    });
  });
});
