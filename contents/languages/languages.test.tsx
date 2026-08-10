import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import LanguagesContent from ".";

import { useMe } from "@/hooks/auth/useMe";
import useLanguages from "@/hooks/languages/useLanguages";
import { IProfileLanguage } from "@/types/languages";
import { getUserIdFromToken } from "@/utils/jwt";

vi.mock("@/hooks/auth/useMe", () => ({
  useMe: vi.fn(),
}));

vi.mock("@/hooks/languages/useLanguages", () => ({
  default: vi.fn(),
}));

vi.mock("@/utils/jwt", () => ({
  getUserIdFromToken: vi.fn(),
}));

vi.mock("@/components/languages-form", () => ({
  default: ({ cancelEditing }: { cancelEditing: () => void }) => (
    <div>
      <span data-testid="languages-form">Languages Form</span>
      <button onClick={cancelEditing}>Cancel Form</button>
    </div>
  ),
}));

vi.mock("@/components/ui/icon", () => ({
  Icon: ({ variant }: { variant: string }) => (
    <span data-testid={`icon-${variant}`} />
  ),
}));

describe("LanguagesContent Component", () => {
  const mockDeleteProfileLanguages = vi.fn();

  const mockLanguagesList: IProfileLanguage[] = [
    { name: "English", proficiency: "Native" } as unknown as IProfileLanguage,
    { name: "Spanish", proficiency: "Fluent" } as unknown as IProfileLanguage,
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    if (typeof window !== "undefined" && !window.PointerEvent) {
      window.PointerEvent = class extends Event {} as any;
    }

    (getUserIdFromToken as ReturnType<typeof vi.fn>).mockReturnValue("user-1");

    (useLanguages as ReturnType<typeof vi.fn>).mockReturnValue({
      deleteProfileLanguages: mockDeleteProfileLanguages,
    });

    (useMe as ReturnType<typeof vi.fn>).mockReturnValue({
      languages: mockLanguagesList,
      isLoading: false,
      error: null,
    });
  });

  describe("States & Initial Rendering", () => {
    it("renders error message when error occurs", () => {
      (useMe as ReturnType<typeof vi.fn>).mockReturnValue({
        languages: null,
        isLoading: false,
        error: new Error("Failed to load"),
      });

      render(<LanguagesContent />);

      expect(screen.getByText("Error loading languages")).toBeInTheDocument();
    });

    it("renders spinner component while loading languages", () => {
      (useMe as ReturnType<typeof vi.fn>).mockReturnValue({
        languages: null,
        isLoading: true,
        error: null,
      });

      render(<LanguagesContent />);

      expect(
        screen.getByRole("status", { name: /loading/i }),
      ).toBeInTheDocument();
    });

    it("renders languages list correctly", () => {
      render(<LanguagesContent />);

      expect(screen.getByText("Languages")).toBeInTheDocument();

      expect(screen.getByText("English")).toBeInTheDocument();
      expect(screen.getByText("Native")).toBeInTheDocument();
      expect(screen.getByText("Spanish")).toBeInTheDocument();
      expect(screen.getByText("Fluent")).toBeInTheDocument();
    });
  });

  describe("Selection & Toggle Logic", () => {
    it("selects a language on click and shows DELETE button with count 1", async () => {
      const user = userEvent.setup();

      render(<LanguagesContent />);

      const englishToggle = screen.getByRole("button", { name: /english/i });
      await user.click(englishToggle);

      const deleteBtn = screen.getByRole("button", { name: /delete/i });
      expect(deleteBtn).toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument();
    });

    it("renders CANCEL button instead of LanguagesForm when more than 1 language is selected", async () => {
      const user = userEvent.setup();

      render(<LanguagesContent />);

      const englishToggle = screen.getByRole("button", { name: /english/i });
      const spanishToggle = screen.getByRole("button", { name: /spanish/i });

      await user.click(englishToggle);
      await user.click(spanishToggle);

      expect(screen.queryByTestId("languages-form")).not.toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: /cancel/i }),
      ).toBeInTheDocument();
    });

    it("clears selection when CANCEL button is clicked", async () => {
      const user = userEvent.setup();

      render(<LanguagesContent />);

      await user.click(screen.getByRole("button", { name: /english/i }));
      await user.click(screen.getByRole("button", { name: /spanish/i }));

      const cancelBtn = screen.getByRole("button", { name: /cancel/i });
      await user.click(cancelBtn);

      expect(screen.getByTestId("languages-form")).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: /delete/i }),
      ).not.toBeInTheDocument();
    });
  });

  describe("Deleting Languages", () => {
    it("calls deleteProfileLanguages with selected language names", async () => {
      const user = userEvent.setup();

      render(<LanguagesContent />);

      await user.click(screen.getByRole("button", { name: /english/i }));

      const deleteBtn = screen.getByRole("button", { name: /delete/i });
      await user.click(deleteBtn);

      expect(mockDeleteProfileLanguages).toHaveBeenCalledWith(["English"]);
    });

    it("opens AlertDialog and deletes all languages when confirmed", async () => {
      const user = userEvent.setup();

      render(<LanguagesContent />);

      const removeAllBtn = screen.getByRole("button", {
        name: /remove languages/i,
      });
      await user.click(removeAllBtn);

      expect(screen.getByText("Are you absolutely sure?")).toBeInTheDocument();

      const continueBtn = screen.getByRole("button", { name: /continue/i });
      await user.click(continueBtn);

      await waitFor(() => {
        expect(mockDeleteProfileLanguages).toHaveBeenCalledWith([
          "English",
          "Spanish",
        ]);
      });
    });
  });
});
