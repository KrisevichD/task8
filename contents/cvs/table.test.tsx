import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockedFunction,
} from "vitest";

import { CvTable } from "./table";

import { ICv } from "@/graphql/cvs/queries";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("@/context/language", () => ({
  useLanguage: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        name: "Name",
        education: "Education",
        employee: "Employee",
        edit: "Edit",
        delete: "Delete",
        noResultsFound: "No results found",
        tryAdjustingSearch: "Try adjusting your search query",
      };
      return translations[key] || key;
    },
  }),
}));

vi.mock("lucide-react", () => ({
  ArrowUp: () => <span data-slot="icon-arrow-up">↑</span>,
  ArrowDown: () => <span data-slot="icon-arrow-down">↓</span>,
}));

vi.mock("@/components/ui/icon", () => ({
  Icon: ({ variant }: { variant: string }) => (
    <span data-testid={`icon-${variant}`} />
  ),
}));

vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: any) => (
    <div data-testid="dropdown-menu">{children}</div>
  ),
  DropdownMenuTrigger: ({ render }: any) => (
    <div data-testid="dropdown-trigger">{render}</div>
  ),
  DropdownMenuPortal: ({ children }: any) => (
    <div data-testid="dropdown-portal">{children}</div>
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

vi.mock("@/components/ui/table", () => ({
  Table: ({ children, className }: any) => (
    <table className={className}>{children}</table>
  ),
  TableHeader: ({ children, className }: any) => (
    <thead className={className}>{children}</thead>
  ),
  TableBody: ({ children }: any) => <tbody>{children}</tbody>,
  TableHead: ({ children, className }: any) => (
    <th className={className}>{children}</th>
  ),
  TableRow: ({ children, className }: any) => (
    <tr className={className}>{children}</tr>
  ),
  TableCell: ({ children, className, colSpan }: any) => (
    <td className={className} colSpan={colSpan}>
      {children}
    </td>
  ),
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, variant, size, onClick }: any) => (
    <button onClick={onClick} data-variant={variant} data-size={size}>
      {children}
    </button>
  ),
}));

describe("CvTable Component Module", () => {
  const mockPush = vi.fn();
  const mockOnDelete = vi.fn();

  const mockItems: ICv[] = [
    {
      id: "cv-aaa",
      name: "Zeta Backend CV",
      education: "Stanford University",
      description: "Led core infrastructure builds",
      user: { email: "zeta@company.com" },
    } as any,
    {
      id: "cv-bbb",
      name: "Alpha Frontend CV",
      education: "",
      description: null as any,
      user: null as any,
    } as any,
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    (useRouter as unknown as MockedFunction<typeof useRouter>).mockReturnValue({
      push: mockPush,
    } as any);
  });

  describe("Base Layout & String Fallback Coverage", () => {
    it("should mount table items grid columns and replace missing keys with production fallbacks", () => {
      render(<CvTable items={mockItems} onDelete={mockOnDelete} />);

      expect(screen.getByText("Zeta Backend CV")).toBeInTheDocument();
      expect(screen.getByText("Stanford University")).toBeInTheDocument();
      expect(screen.getByText("zeta@company.com")).toBeInTheDocument();
      expect(
        screen.getByText("Led core infrastructure builds"),
      ).toBeInTheDocument();

      expect(screen.getByText("Alpha Frontend CV")).toBeInTheDocument();
      const fallbackDashes = screen.getAllByText("—");
      expect(fallbackDashes.length).toBe(3);
    });

    it("should display empty state placeholder if items collection data array arrives empty", () => {
      render(<CvTable items={[]} onDelete={mockOnDelete} />);

      expect(screen.getByText("No results found")).toBeInTheDocument();
      expect(
        screen.getByText("Try adjusting your search query"),
      ).toBeInTheDocument();
    });
  });

  describe("Sorting Algorithm Branches Mechanics", () => {
    it("should sort data elements alphabetically ascending by name initially, then descending upon sort toggle click", async () => {
      const user = userEvent.setup();
      render(<CvTable items={mockItems} onDelete={mockOnDelete} />);

      let rows = screen.getAllByRole("row");
      expect(rows[1].textContent).toContain("Alpha Frontend CV");
      expect(rows[3].textContent).toContain("Zeta Backend CV");

      const sortBtn = screen.getByRole("button", { name: /name/i });
      await user.click(sortBtn);

      rows = screen.getAllByRole("row");
      expect(rows[1].textContent).toContain("Zeta Backend CV");
      expect(rows[3].textContent).toContain("Alpha Frontend CV");
    });
  });

  describe("Dropdown Action Triggers", () => {
    it("should redirect the client toward CV constructor dashboards when Edit trigger is clicked", async () => {
      const user = userEvent.setup();
      render(<CvTable items={mockItems} onDelete={mockOnDelete} />);

      const editButtons = screen.getAllByTestId("dropdown-item-edit");

      await user.click(editButtons[0]);

      expect(mockPush).toHaveBeenCalledWith("/cvs/cv-bbb");
    });

    it("should execute onDelete callback handler variables when Delete trigger item fires", async () => {
      const user = userEvent.setup();
      render(<CvTable items={mockItems} onDelete={mockOnDelete} />);

      const deleteButtons = screen.getAllByTestId("dropdown-item-delete");

      await user.click(deleteButtons[1]);

      expect(mockOnDelete).toHaveBeenCalledWith(mockItems[0]);
    });
  });
});
