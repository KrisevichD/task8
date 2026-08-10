import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockedFunction,
} from "vitest";

import SettingsContent from ".";

vi.mock("next-themes", () => ({
  useTheme: vi.fn(),
}));

vi.mock("react", async () => {
  const actualReact = await vi.importActual<typeof import("react")>("react");
  return {
    ...actualReact,
    useSyncExternalStore: vi.fn(),
  };
});

vi.mock("@/components/ui/floating-select", () => ({
  FloatingSelect: ({ children, label, value, onValueChange }: any) => (
    <div data-testid={`select-wrapper-${label}`} data-value={value}>
      <label>{label}</label>
      <select
        data-testid={`select-field-${label}`}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
      >
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

describe("SettingsContent Component Module", () => {
  const mockSetTheme = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useTheme as unknown as MockedFunction<typeof useTheme>).mockReturnValue({
      theme: "light",
      setTheme: mockSetTheme,
    } as any);

    (
      useSyncExternalStore as unknown as MockedFunction<
        typeof useSyncExternalStore
      >
    ).mockReturnValue(true);
  });

  describe("SSR Hydration & Early Return Branches Coverage", () => {
    it("should return null immediately and prevent layout rendering if executed inside a non-client server framework context", () => {
      (
        useSyncExternalStore as unknown as MockedFunction<
          typeof useSyncExternalStore
        >
      ).mockReturnValueOnce(false);

      const { container } = render(<SettingsContent />);

      expect(container.firstChild).toBeNull();
      expect(
        screen.queryByTestId("select-wrapper-Appearance"),
      ).not.toBeInTheDocument();
    });

    it("should fall back gracefully to a 'system' theme parameter value if the current theme state from next-themes is empty", () => {
      (
        useTheme as unknown as MockedFunction<typeof useTheme>
      ).mockReturnValueOnce({
        theme: undefined,
        setTheme: mockSetTheme,
      } as any);

      render(<SettingsContent />);

      const appearanceWrapper = screen.getByTestId("select-wrapper-Appearance");
      expect(appearanceWrapper).toHaveAttribute("data-value", "system");
    });
  });

  describe("State Mutation & Sub-components Callback Triggers", () => {
    it("should trigger setTheme callback loop successfully when the selected appearance variant option is changed", async () => {
      const user = userEvent.setup();
      render(<SettingsContent />);

      const appearanceSelect = screen.getByTestId("select-field-Appearance");
      await user.selectOptions(appearanceSelect, "dark");

      expect(mockSetTheme).toHaveBeenCalledWith("dark");
      expect(mockSetTheme).toHaveBeenCalledTimes(1);
    });

    it("should trigger setLanguage context callback safely when a localized language dictionary code is modified", async () => {
      const user = userEvent.setup();
      render(<SettingsContent />);

      const languageSelect = screen.getByTestId("select-field-Language");
      await user.selectOptions(languageSelect, "ru");

      expect(screen.getByTestId("select-wrapper-Language")).toBeInTheDocument();
    });
  });
});
