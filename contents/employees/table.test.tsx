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

import { EmployeeTable, Employee } from "./table";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("@/components/ui/avatar", () => ({
  Avatar: ({ children, className }: any) => (
    <div data-testid="avatar-root" className={className}>
      {children}
    </div>
  ),
  AvatarImage: () => null,
  AvatarFallback: ({ children, className }: any) => (
    <div data-testid="avatar-fallback" className={className}>
      {children}
    </div>
  ),
}));

vi.mock("@/components/ui/icon", () => ({
  Icon: ({ variant, className }: any) => (
    <span data-testid={`icon-${variant}`} className={className} />
  ),
}));

vi.mock("@/components/ui/table", () => ({
  Table: ({ children, className }: any) => (
    <table className={className}>{children}</table>
  ),
  TableHeader: ({ children }: any) => <thead>{children}</thead>,
  TableBody: ({ children }: any) => <tbody>{children}</tbody>,
  TableHead: ({ children, className }: any) => (
    <th className={className}>{children}</th>
  ),
  TableRow: ({ children, className, onClick }: any) => (
    <tr className={className} onClick={onClick}>
      {children}
    </tr>
  ),
  TableCell: ({ children, className, colSpan }: any) => (
    <td className={className} colSpan={colSpan}>
      {children}
    </td>
  ),
}));

describe("EmployeeTable Component Module", () => {
  const mockPush = vi.fn();

  const mockEmployees: Employee[] = [
    {
      id: "emp-aaa",
      firstName: "Zachary",
      lastName: "Miller",
      email: "zachary@company.com",
      department: "Sales",
      position: "Account Executive",
      avatarUrl: "https://example.com",
    },
    {
      id: "emp-bbb",
      firstName: "Anna",
      lastName: "",
      email: "anna@company.com",
      department: "Engineering",
      position: "",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    (useRouter as unknown as MockedFunction<typeof useRouter>).mockReturnValue({
      push: mockPush,
    } as any);
  });

  describe("Base Layout & String Fallback Coverage", () => {
    it("should mount table items grid columns and replace missing keys with production fallbacks", () => {
      render(<EmployeeTable employees={mockEmployees} />);

      expect(screen.getByText("Zachary")).toBeInTheDocument();
      expect(screen.getByText("Miller")).toBeInTheDocument();
      expect(screen.getByText("Sales")).toBeInTheDocument();
      expect(screen.getByText("Account Executive")).toBeInTheDocument();

      expect(screen.getByText("Anna")).toBeInTheDocument();
      const fallbackDashes = screen.getAllByText("-");
      expect(fallbackDashes.length).toBe(2);

      const fallbacks = screen.getAllByTestId("avatar-fallback");
      expect(fallbacks[0].textContent).toBe("A");
      expect(fallbacks[1].textContent).toBe("ZM");
    });

    it("should display a generic searching placeholder if employees dataset array arrives empty", () => {
      render(<EmployeeTable employees={[]} />);

      expect(screen.getByText("Search...")).toBeInTheDocument();
    });
  });

  describe("Sorting Algorithm Branches Mechanics", () => {
    it("should sort data elements alphabetically ascending by department initially, then descending upon toggle sort button click", async () => {
      const user = userEvent.setup();
      render(<EmployeeTable employees={mockEmployees} />);

      let rows = screen.getAllByRole("row");
      expect(rows[1].textContent).toContain("Anna");
      expect(rows[2].textContent).toContain("Zachary");

      const sortBtn = screen.getByRole("button", { name: /department/i });
      await user.click(sortBtn);

      rows = screen.getAllByRole("row");
      expect(rows[1].textContent).toContain("Zachary");
      expect(rows[2].textContent).toContain("Anna");
    });
  });

  describe("Viewport Routing & Event Propagation", () => {
    it("should redirect the client toward the specific profile dashboard when a row is clicked", async () => {
      const user = userEvent.setup();
      render(<EmployeeTable employees={mockEmployees} />);

      const rows = screen.getAllByRole("row");

      await user.click(rows[1]);

      expect(mockPush).toHaveBeenCalledWith("/employees/emp-bbb");
    });

    it("should cleanly capture separate standalone action button clicks using stopPropagation filters", async () => {
      const user = userEvent.setup();
      render(<EmployeeTable employees={mockEmployees} />);

      const actionBtns = screen.getAllByRole("button", { name: /actions/i });

      await user.click(actionBtns[1]);

      expect(mockPush).toHaveBeenCalledWith("/employees/emp-aaa");
      expect(mockPush).toHaveBeenCalledTimes(1);
    });
  });
});
