import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useParams } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";

import CvProjectsList from ".";

import useCvConstructor from "@/hooks/cvs/useCvConstructor";
import { ICvProject } from "@/types/cv-constructor";

vi.mock("next/navigation", () => ({
  useParams: vi.fn(),
}));

vi.mock("@/hooks/cvs/useCvConstructor", () => ({
  default: vi.fn(),
}));

vi.mock("../form", () => ({
  default: ({ type, editingId, closeEditing, id }: any) => (
    <div
      data-testid="mock-projects-form"
      data-type={type}
      data-editing={!!editingId}
      data-id={id}
    >
      <button data-testid="close-edit-btn" onClick={closeEditing}>
        Close Edit
      </button>
    </div>
  ),
}));

vi.mock("@/components/ui/icon", () => ({
  Icon: ({ variant }: { variant: string }) => (
    <span data-testid={`icon-${variant}`} />
  ),
}));

vi.mock("@/components/ui/spinner", () => ({
  Spinner: () => <div data-testid="spinner">Loading...</div>,
}));

vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: any) => (
    <div data-testid="dropdown-menu">{children}</div>
  ),
  DropdownMenuTrigger: ({ render }: any) => (
    <div data-testid="dropdown-trigger">{render}</div>
  ),
  DropdownMenuContent: ({ children }: any) => (
    <div data-testid="dropdown-content">{children}</div>
  ),
  DropdownMenuGroup: ({ children }: any) => <div>{children}</div>,
  DropdownMenuItem: ({ children, onClick }: any) => (
    <button
      onClick={onClick}
      data-testid={`dropdown-item-${children?.toString().toLowerCase()}`}
    >
      {children}
    </button>
  ),
  DropdownMenuSeparator: () => <hr />,
}));

describe("CvProjectsList Component", () => {
  const mockDeleteCvProject = vi.fn();

  const mockProjects: ICvProject[] = [
    {
      id: "cp-1",
      name: "Alpha Dashboard",
      domain: "Healthcare",
      start_date: "2026-01-01",
      end_date: "2026-05-01",
      description: "A secure diagnostic data portal",
      environment: ["React", "GraphQL"],
      responsibilities: ["Developed charts Canvas", "Managed state machine"],
      project: { id: "p-99" },
    } as any,
    {
      id: "cp-2",
      name: "Beta Payments",
      domain: "Fintech",
      start_date: "2025-06-01",
      end_date: "2025-12-01",
      description: "High throughput ledger engine processing",
      environment: ["Node.js", "Postgres"],
      responsibilities: [
        "Optimized indexing operations",
        "Wrote migrations script",
      ],
      project: { id: "p-100" },
    } as any,
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    (useParams as any).mockReturnValue({ id: "cv-123" });

    (useCvConstructor as any).mockReturnValue({
      cvData: { id: "cv-123", projects: mockProjects },
      deleteCvProject: mockDeleteCvProject,
    });
  });

  describe("Base Rendering states", () => {
    it("should render a Spinner component if cvData is missing or loading", () => {
      (useCvConstructor as any).mockReturnValue({ cvData: null });
      render(<CvProjectsList />);
      expect(screen.getByTestId("spinner")).toBeInTheDocument();
    });

    it("should map table structure grids, column arrays, and description nodes correctly", () => {
      render(<CvProjectsList />);

      expect(screen.getByText("Alpha Dashboard")).toBeInTheDocument();
      expect(screen.getByText("Healthcare")).toBeInTheDocument();
      expect(
        screen.getByText("A secure diagnostic data portal"),
      ).toBeInTheDocument();

      expect(screen.getByText("Developed charts Canvas")).toBeInTheDocument();
      expect(screen.getByText("Managed state machine")).toBeInTheDocument();
      expect(
        screen.getByText("Optimized indexing operations"),
      ).toBeInTheDocument();
    });
  });

  describe("Dropdown Actions Coverage (Delete & Edit triggers)", () => {
    it("should fire deleteCvProject mutation successfully when the trigger inside dropdown items is clicked", async () => {
      const user = userEvent.setup();
      render(<CvProjectsList />);

      const deleteButtons = screen.getAllByTestId("dropdown-item-delete");
      await user.click(deleteButtons[0]);

      expect(mockDeleteCvProject).toHaveBeenCalledWith({
        cvId: "cv-123",
        project: mockProjects[0],
      });
    });

    it("should toggle editingId state variables when Edit action trigger fires", async () => {
      const user = userEvent.setup();
      render(<CvProjectsList />);

      const editButtons = screen.getAllByTestId("dropdown-item-edit");
      await user.click(editButtons[0]);

      const editForm = screen.getAllByTestId("mock-projects-form");
      expect(editForm[0]).toHaveAttribute("data-editing", "true");

      const closeBtn = screen.getAllByTestId("close-edit-btn");
      await user.click(closeBtn[0]);
      expect(editForm[0]).toHaveAttribute("data-editing", "false");
    });

    it("should update local style background identifiers state during hover movements", () => {
      render(<CvProjectsList />);

      const tableRows = screen.getAllByRole("row");
      const firstRow = tableRows[1];

      fireEvent.mouseEnter(firstRow);
      expect(firstRow.className).toContain("bg-muted/50");

      fireEvent.mouseLeave(firstRow);
      expect(firstRow.className).toContain("bg-background");
    });
  });

  describe("Search queries list filtering pipeline branches", () => {
    it("should return the entire data collection if search query variables arrive empty", () => {
      render(<CvProjectsList searchQuery="   " />);
      expect(screen.getByText("Alpha Dashboard")).toBeInTheDocument();
      expect(screen.getByText("Beta Payments")).toBeInTheDocument();
    });

    it("should filter results accurately when a search query matches the project name", () => {
      render(<CvProjectsList searchQuery="Alpha" />);
      expect(screen.getByText("Alpha Dashboard")).toBeInTheDocument();
      expect(screen.queryByText("Beta Payments")).not.toBeInTheDocument();
    });

    it("should filter results accurately when a search query matches the project domain", () => {
      render(<CvProjectsList searchQuery="Fintech" />);
      expect(screen.queryByText("Alpha Dashboard")).not.toBeInTheDocument();
      expect(screen.getByText("Beta Payments")).toBeInTheDocument();
    });

    it("should filter results accurately when a search query matches the project description", () => {
      render(<CvProjectsList searchQuery="diagnostic" />);
      expect(screen.getByText("Alpha Dashboard")).toBeInTheDocument();
      expect(screen.queryByText("Beta Payments")).not.toBeInTheDocument();
    });

    it("should filter results accurately when a search query matches a nested responsibility string tag", () => {
      render(<CvProjectsList searchQuery="migrations" />);
      expect(screen.queryByText("Alpha Dashboard")).not.toBeInTheDocument();
      expect(screen.getByText("Beta Payments")).toBeInTheDocument();
    });

    it("should display a fallback 'No matches found' view screen if the search payload yields zero matches", () => {
      render(<CvProjectsList searchQuery="Web3 Blockchain Ledger" />);
      expect(screen.getByText("No matches found")).toBeInTheDocument();
    });
  });
});
