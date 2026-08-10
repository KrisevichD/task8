import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { usePathname, useSearchParams } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";

import CvConstructor from ".";

import useCvConstructor from "@/hooks/cvs/useCvConstructor";

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
  usePathname: vi.fn(),
}));

vi.mock("@/hooks/cvs/useCvConstructor", () => ({
  default: vi.fn(),
}));

vi.mock("@/components/cv/details-form", () => ({
  default: () => <div data-testid="details-form">Details Form</div>,
}));

vi.mock("@/components/cv/projects", () => ({
  default: () => <div data-testid="projects-component">Projects Component</div>,
}));

vi.mock("@/components/cv/skills", () => ({
  default: () => <div data-testid="skills-component">Skills Component</div>,
}));

vi.mock("@/components/cv/preview", () => ({
  default: () => <div data-testid="preview-component">Preview Component</div>,
}));

describe("CvConstructor Component", () => {
  const mockCvData = { id: "cv-1", name: "Frontend Developer CV" };

  beforeEach(() => {
    vi.clearAllMocks();

    if (typeof window !== "undefined" && !window.PointerEvent) {
      window.PointerEvent = class extends Event {} as any;
    }

    (usePathname as ReturnType<typeof vi.fn>).mockReturnValue("/cvs/cv-1");
    (useCvConstructor as ReturnType<typeof vi.fn>).mockReturnValue({
      cvData: mockCvData,
    });
  });

  describe("Rendering & Navigation", () => {
    it("renders Spinner while cvData is null or loading", () => {
      (useCvConstructor as ReturnType<typeof vi.fn>).mockReturnValue({
        cvData: null,
      });
      (useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue(
        new URLSearchParams(""),
      );

      render(<CvConstructor cvId="cv-1" />);

      expect(
        screen.getByRole("status", { name: /loading/i }),
      ).toBeInTheDocument();
      expect(screen.queryByTestId("details-form")).not.toBeInTheDocument();
    });

    it("renders Breadcrumbs with correct CV name", () => {
      (useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue(
        new URLSearchParams(""),
      );

      render(<CvConstructor cvId="cv-1" />);

      expect(screen.getByText("CVs")).toBeInTheDocument();
      expect(screen.getByText("Frontend Developer CV")).toBeInTheDocument();
    });

    it("renders Details tab by default if 'tab' param is missing in URL", () => {
      (useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue(
        new URLSearchParams(""),
      );

      render(<CvConstructor cvId="cv-1" />);

      expect(screen.getByTestId("details-form")).toBeInTheDocument();
    });

    it("renders corresponding tab component based on 'tab' URL parameter", () => {
      (useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue(
        new URLSearchParams("tab=skills"),
      );

      render(<CvConstructor cvId="cv-1" />);

      expect(screen.getByTestId("skills-component")).toBeInTheDocument();

      expect(screen.getByRole("tab", { name: /skills/i })).toBeInTheDocument();
    });
  });

  describe("Tab Switching Behavior", () => {
    it("updates window.history when a new tab is clicked", async () => {
      const user = userEvent.setup();
      const replaceStateSpy = vi.spyOn(window.history, "replaceState");

      (useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue(
        new URLSearchParams(""),
      );

      render(<CvConstructor cvId="cv-1" />);

      const projectsTab = screen.getByRole("tab", { name: /projects/i });
      await user.click(projectsTab);

      expect(replaceStateSpy).toHaveBeenCalledWith(
        null,
        "",
        "/cvs/cv-1?tab=projects",
      );
    });

    it("removes 'tab' query param when switching back to 'details'", async () => {
      const user = userEvent.setup();
      const replaceStateSpy = vi.spyOn(window.history, "replaceState");

      (useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue(
        new URLSearchParams("tab=projects"),
      );

      render(<CvConstructor cvId="cv-1" />);

      const detailsTab = screen.getByRole("tab", { name: /details/i });
      await user.click(detailsTab);

      expect(replaceStateSpy).toHaveBeenCalledWith(null, "", "/cvs/cv-1?");
    });
  });
});
