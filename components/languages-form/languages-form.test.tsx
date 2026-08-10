import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";

import LanguagesForm from ".";

import useLanguages from "@/hooks/languages/useLanguages";
import { IProfileLanguage } from "@/types/languages";

vi.mock("@/hooks/languages/useLanguages", () => ({
  default: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

vi.mock("@/components/ui/icon", () => ({
  Icon: ({ variant }: { variant: string }) => (
    <span data-testid={`icon-${variant}`} />
  ),
}));

vi.mock("@/components/ui/floating-select", () => ({
  FloatingSelect: ({
    children,
    value,
    onValueChange,
    label,
    disabled,
  }: any) => (
    <div data-testid={`select-wrapper-${label}`} data-disabled={disabled}>
      <label>{label}</label>
      <input
        data-testid={`select-input-${label}`}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        disabled={disabled}
      />
      <select
        onChange={(e) => onValueChange(e.target.value)}
        value={value}
        disabled={disabled}
      >
        <option value="">Select option</option>
        {children}
      </select>
    </div>
  ),
}));

vi.mock("@/components/ui/select", () => ({
  SelectItem: ({ value, children }: any) => (
    <option value={value}>{children}</option>
  ),
}));

describe("LanguagesForm Component", () => {
  const mockCancelEditing = vi.fn();
  const mockGetAllLanguages = vi.fn();
  const mockAddProfileLanguage = vi.fn();
  const mockUpdateProfileLanguage = vi.fn();

  const mockFilteredLanguages = [{ name: "English" }, { name: "German" }];

  const defaultProps = {
    userId: "user-123",
    selectedLanguages: [],
    cancelEditing: mockCancelEditing,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    if (typeof window !== "undefined" && !window.PointerEvent) {
      window.PointerEvent = class extends Event {} as any;
    }

    (useLanguages as any).mockReturnValue({
      getAllLanguages: mockGetAllLanguages,
      filteredLanguages: mockFilteredLanguages,
      isLanguagesLoading: false,
      addProfileLanguage: mockAddProfileLanguage,
      updateProfileLanguage: mockUpdateProfileLanguage,
    });
  });

  describe("Add Mode Rendering and Execution Flow", () => {
    it("should render the 'add language' button in initial hidden state", () => {
      render(<LanguagesForm {...defaultProps} />);

      const triggerBtn = screen.getByRole("button", { name: /add language/i });
      expect(triggerBtn).toBeInTheDocument();
      expect(
        screen.queryByText(/language proficiency/i),
      ).not.toBeInTheDocument();
    });

    it("should trigger getAllLanguages query compilation upon modal open states", async () => {
      const user = userEvent.setup();
      render(<LanguagesForm {...defaultProps} />);

      const triggerBtn = screen.getByRole("button", { name: /add language/i });
      await user.click(triggerBtn);

      expect(mockGetAllLanguages).toHaveBeenCalledTimes(1);
      expect(
        screen.getByRole("heading", { name: /add language/i }),
      ).toBeInTheDocument();
    });

    it("should throw a toast error message context when submitting with empty variables", async () => {
      const user = userEvent.setup();
      render(<LanguagesForm {...defaultProps} />);

      await user.click(screen.getByRole("button", { name: /add language/i }));

      const submitBtn = screen.getByRole("button", { name: /^add$/i });
      await user.click(submitBtn);

      expect(toast.error).toHaveBeenCalledWith("Choose language", {
        position: "top-right",
      });
      expect(mockAddProfileLanguage).not.toHaveBeenCalled();
    });

    it("should process language addition mutations smoothly upon valid inputs selection", async () => {
      const user = userEvent.setup();
      render(<LanguagesForm {...defaultProps} />);

      await user.click(screen.getByRole("button", { name: /add language/i }));

      const languageSelect = screen.getByTestId("select-input-Language");
      fireEvent.change(languageSelect, { target: { value: "German" } });

      const proficiencySelect = screen.getByTestId(
        "select-input-Language proficiency",
      );
      fireEvent.change(proficiencySelect, { target: { value: "B2" } });

      const submitBtn = screen.getByRole("button", { name: /^add$/i });
      await user.click(submitBtn);

      expect(mockAddProfileLanguage).toHaveBeenCalledWith({
        name: "German",
        proficiency: "B2",
      });
      expect(mockCancelEditing).toHaveBeenCalledTimes(1);
    });
  });

  describe("Edit Mode Pre-population and Casing Rules", () => {
    const activeSelectedLanguage: IProfileLanguage[] = [
      { name: "English", proficiency: "Native" },
    ];

    it("should adapt to 'update language' text schemas when exactly one item is received", () => {
      render(
        <LanguagesForm
          {...defaultProps}
          selectedLanguages={activeSelectedLanguage}
        />,
      );

      const triggerBtn = screen.getByRole("button", {
        name: /update language/i,
      });
      expect(triggerBtn).toBeInTheDocument();
    });

    it("should enforce disabled status constraints on language name entries inside update states", async () => {
      const user = userEvent.setup();
      render(
        <LanguagesForm
          {...defaultProps}
          selectedLanguages={activeSelectedLanguage}
        />,
      );

      await user.click(
        screen.getByRole("button", { name: /update language/i }),
      );

      const languageWrapper = screen.getByTestId("select-wrapper-Language");
      expect(languageWrapper).toHaveAttribute("data-disabled", "true");
    });

    it("should call updateProfileLanguage when proficiency variables transition smoothly", async () => {
      const user = userEvent.setup();
      render(
        <LanguagesForm
          {...defaultProps}
          selectedLanguages={activeSelectedLanguage}
        />,
      );

      await user.click(
        screen.getByRole("button", { name: /update language/i }),
      );

      const proficiencySelect = screen.getByTestId(
        "select-input-Language proficiency",
      );
      fireEvent.change(proficiencySelect, { target: { value: "C2" } });

      const submitBtn = screen.getByRole("button", { name: /^update$/i });
      await user.click(submitBtn);

      expect(mockUpdateProfileLanguage).toHaveBeenCalledWith({
        name: "English",
        proficiency: "C2",
      });
      expect(mockCancelEditing).toHaveBeenCalledTimes(1);
    });
  });
});
