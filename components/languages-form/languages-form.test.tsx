import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";

import LanguagesForm from ".";

import useLanguages from "@/hooks/languages/useLanguages";
import { IProfileLanguage } from "@/types/languages";

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

vi.mock("@/hooks/languages/useLanguages", () => ({
  default: vi.fn(),
}));

describe("LanguagesForm Component", () => {
  const mockGetAllLanguages = vi.fn();
  const mockAddProfileLanguage = vi.fn();
  const mockUpdateProfileLanguage = vi.fn();
  const mockCancelEditing = vi.fn();

  const mockLanguagesList = [
    { id: "1", name: "English" },
    { id: "2", name: "Spanish" },
  ];

  const mockSelectedLanguages: IProfileLanguage[] = [
    {
      id: "lang-1",
      name: "English",
      proficiency: "B2",
    } as unknown as IProfileLanguage,
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    (useLanguages as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      getAllLanguages: mockGetAllLanguages,
      filteredLanguages: mockLanguagesList,
      isLanguagesLoading: false,
      addProfileLanguage: mockAddProfileLanguage,
      updateProfileLanguage: mockUpdateProfileLanguage,
    });
  });

  describe("Add Mode (Adding new language)", () => {
    it("renders ADD LANGUAGE button and calls getAllLanguages on dialog open", async () => {
      const user = userEvent.setup();

      render(
        <LanguagesForm
          userId="user-123"
          selectedLanguages={[]}
          cancelEditing={mockCancelEditing}
        />,
      );

      const triggerBtn = screen.getByRole("button", { name: /add language/i });
      expect(triggerBtn).toBeInTheDocument();

      await user.click(triggerBtn);

      expect(mockGetAllLanguages).toHaveBeenCalledTimes(1);
      expect(
        screen.getByRole("heading", { name: /add language/i }),
      ).toBeInTheDocument();
    });

    it("shows error toast if form is submitted without choosing a language", async () => {
      const user = userEvent.setup();

      render(
        <LanguagesForm
          userId="user-123"
          selectedLanguages={[]}
          cancelEditing={mockCancelEditing}
        />,
      );

      await user.click(screen.getByRole("button", { name: /add language/i }));

      const submitBtn = screen.getByRole("button", { name: /^add$/i });
      await user.click(submitBtn);

      expect(toast.error).toHaveBeenCalledWith("Choose language", {
        position: "top-right",
      });
      expect(mockAddProfileLanguage).not.toHaveBeenCalled();
    });

    it("submits new language when language and proficiency are selected", async () => {
      const user = userEvent.setup();

      render(
        <LanguagesForm
          userId="user-123"
          selectedLanguages={[]}
          cancelEditing={mockCancelEditing}
        />,
      );

      await user.click(screen.getByRole("button", { name: /add language/i }));

      const comboboxes = screen.getAllByRole("combobox");
      await user.click(comboboxes[0]);

      const spanishOption = await screen.findByText("Spanish");
      await user.click(spanishOption);

      await user.click(comboboxes[1]);

      const c1Option = await screen.findByText("C1");
      await user.click(c1Option);

      const submitBtn = screen.getByRole("button", { name: /^add$/i });
      await user.click(submitBtn);

      await waitFor(() => {
        expect(mockAddProfileLanguage).toHaveBeenCalledWith({
          name: "Spanish",
          proficiency: "C1",
        });
        expect(mockCancelEditing).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("Edit Mode (Updating existing language)", () => {
    it("renders UPDATE LANGUAGE button and populates current proficiency level", async () => {
      const user = userEvent.setup();

      render(
        <LanguagesForm
          userId="user-123"
          selectedLanguages={mockSelectedLanguages}
          cancelEditing={mockCancelEditing}
        />,
      );

      const triggerBtn = screen.getByRole("button", {
        name: /update language/i,
      });
      expect(triggerBtn).toBeInTheDocument();

      await user.click(triggerBtn);

      expect(
        screen.getByRole("heading", { name: /update language/i }),
      ).toBeInTheDocument();
    });

    it("submits updated proficiency for selected language", async () => {
      const user = userEvent.setup();

      render(
        <LanguagesForm
          userId="user-123"
          selectedLanguages={mockSelectedLanguages}
          cancelEditing={mockCancelEditing}
        />,
      );

      await user.click(
        screen.getByRole("button", { name: /update language/i }),
      );

      const comboboxes = screen.getAllByRole("combobox");
      await user.click(comboboxes[1]);

      const nativeOption = await screen.findByText("Native");
      await user.click(nativeOption);

      const submitBtn = screen.getByRole("button", { name: /^update$/i });
      await user.click(submitBtn);

      await waitFor(() => {
        expect(mockUpdateProfileLanguage).toHaveBeenCalledWith({
          name: "English",
          proficiency: "Native",
        });
        expect(mockCancelEditing).toHaveBeenCalledTimes(1);
      });
    });
  });
});
