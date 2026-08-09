import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";

import CvProjectsForm from ".";

import useCvConstructor from "@/hooks/cvs/useCvConstructor";
import useSkills from "@/hooks/skills/useSkills";
import { ICreateCvProjectForm } from "@/types/cv-constructor";

vi.mock("next/navigation", () => ({
  useParams: vi.fn(),
}));

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

describe("CvProjectsForm Component", () => {
  const mockAddCvProject = vi.fn();
  const mockUpdateCvProject = vi.fn();
  const mockGetAllSkills = vi.fn();
  const mockCloseEditing = vi.fn();

  const mockSkillsData = {
    skills: [
      { id: "skill-1", name: "React" },
      { id: "skill-2", name: "TypeScript" },
    ],
  };

  const mockInitialData: ICreateCvProjectForm = {
    name: "E-Commerce App",
    domain: "Retail",
    start_date: "2023-01-01",
    end_date: "2024-01-01",
    description: "Built scalable web shop",
    environment: ["React"],
    responsibilities: "Frontend Lead",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    (useParams as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      id: "cv-123",
    });

    (useCvConstructor as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      addCvProject: mockAddCvProject,
      updateCvProject: mockUpdateCvProject,
    });

    (useSkills as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      getAllSkills: mockGetAllSkills,
      skills: mockSkillsData,
    });
  });

  describe("Add Mode", () => {
    it("renders trigger button and opens dialog with empty form", async () => {
      const user = userEvent.setup();

      render(<CvProjectsForm type="add" />);

      const addBtn = screen.getByRole("button", { name: /add project/i });
      expect(addBtn).toBeInTheDocument();

      await user.click(addBtn);

      expect(mockGetAllSkills).toHaveBeenCalledTimes(1);
      expect(
        screen.getByRole("heading", { name: /add project/i }),
      ).toBeInTheDocument();
    });

    it("triggers validation toast if required field minLength is violated", async () => {
      const user = userEvent.setup();

      render(<CvProjectsForm type="add" />);

      await user.click(screen.getByRole("button", { name: /add project/i }));

      const nameInput = document.querySelector(
        'input[name="name"]',
      ) as HTMLInputElement;

      await user.type(nameInput, "A");

      const submitBtn = screen.getByRole("button", { name: /^add$/i });
      expect(submitBtn).not.toBeDisabled();

      await user.click(submitBtn);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Min length is 2 characters", {
          position: "top-right",
        });
        expect(mockAddCvProject).not.toHaveBeenCalled();
      });
    });

    it("submits new project when required fields are filled", async () => {
      const user = userEvent.setup();

      render(<CvProjectsForm type="add" />);

      await user.click(screen.getByRole("button", { name: /add project/i }));

      const nameInput = document.querySelector(
        'input[name="name"]',
      ) as HTMLInputElement;
      const domainInput = document.querySelector(
        'input[name="domain"]',
      ) as HTMLInputElement;
      const startDateInput = document.querySelector(
        'input[name="start_date"]',
      ) as HTMLInputElement;
      const endDateInput = document.querySelector(
        'input[name="end_date"]',
      ) as HTMLInputElement;
      const descInput = document.querySelector(
        'textarea[name="description"]',
      ) as HTMLTextAreaElement;

      await user.type(nameInput, "New Project");
      await user.type(domainInput, "Fintech");
      await user.type(startDateInput, "2024-01-01");
      await user.type(endDateInput, "2024-12-31");
      await user.type(descInput, "New project description");

      const submitBtn = screen.getByRole("button", { name: /^add$/i });
      await user.click(submitBtn);

      await waitFor(() => {
        expect(mockAddCvProject).toHaveBeenCalledWith(
          expect.objectContaining({
            name: "New Project",
            domain: "Fintech",
            start_date: "2024-01-01",
            end_date: "2024-12-31",
            description: "New project description",
          }),
        );
      });
    });
  });

  describe("Edit Mode", () => {
    it("opens dialog directly and disables name, domain and description inputs", () => {
      render(
        <CvProjectsForm
          type="edit"
          id="proj-1"
          editingId="proj-1"
          closeEditing={mockCloseEditing}
          initialData={mockInitialData}
        />,
      );

      expect(
        screen.getByRole("heading", { name: /upadate project/i }),
      ).toBeInTheDocument();

      const nameInput = document.querySelector('input[name="name"]');
      const domainInput = document.querySelector('input[name="domain"]');
      const descInput = document.querySelector('textarea[name="description"]');

      expect(nameInput).toBeDisabled();
      expect(domainInput).toBeDisabled();
      expect(descInput).toBeDisabled();
    });

    it("submits updated project data when a field is edited", async () => {
      const user = userEvent.setup();

      render(
        <CvProjectsForm
          type="edit"
          id="proj-1"
          editingId="proj-1"
          closeEditing={mockCloseEditing}
          initialData={mockInitialData}
        />,
      );

      const respInput = document.querySelector(
        'textarea[name="responsibilities"]',
      ) as HTMLTextAreaElement;

      await user.type(respInput, " & Tech Lead");

      const updateBtn = screen.getByRole("button", { name: /update/i });
      expect(updateBtn).not.toBeDisabled();

      await user.click(updateBtn);

      await waitFor(() => {
        expect(mockUpdateCvProject).toHaveBeenCalledWith(
          "proj-1",
          expect.objectContaining({
            responsibilities: "Frontend Lead & Tech Lead",
          }),
        );
        expect(mockCloseEditing).toHaveBeenCalledTimes(1);
      });
    });
  });
});
