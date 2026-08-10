import { render, screen, fireEvent } from "@testing-library/react";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockedFunction,
} from "vitest";

import { EmployeesContent } from ".";

import { useDebounce } from "@/hooks/common/useDebounce";
import { useEmployees } from "@/hooks/employees/useEmployees";

vi.mock("@/hooks/employees/useEmployees", () => ({
  useEmployees: vi.fn(),
}));

vi.mock("@/hooks/common/useDebounce", () => ({
  useDebounce: vi.fn((value) => value),
}));

vi.mock("./table", () => ({
  EmployeeTable: ({ employees }: any) => (
    <div data-testid="mock-employee-table">
      <ul>
        {employees.map((emp: any) => (
          <li key={emp.id} data-testid={`emp-item-${emp.id}`}>
            <span>
              {emp.firstName} {emp.lastName}
            </span>{" "}
            - <span>{emp.email}</span> - <span>{emp.department}</span>
          </li>
        ))}
      </ul>
    </div>
  ),
}));

vi.mock("@/components/ui/search-input", () => ({
  SearchInput: ({ value, onChange }: any) => (
    <input
      data-testid="search-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

vi.mock("@/components/ui/spinner", () => ({
  Spinner: () => (
    <div role="status" aria-label="Loading">
      Loading...
    </div>
  ),
}));

describe("EmployeesContent Component Module", () => {
  const mockEmployeesData = [
    {
      id: "emp-1",
      email: "alice@company.com",
      firstName: "Alice",
      lastName: "Smith",
      department: "Engineering",
    },
    {
      id: "emp-2",
      email: "bob@company.com",
      firstName: "Bob",
      lastName: "Jones",
      department: "Marketing",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    (
      useEmployees as unknown as MockedFunction<typeof useEmployees>
    ).mockReturnValue({
      employees: mockEmployeesData,
      isLoading: false,
      error: null,
    } as any);

    (
      useDebounce as unknown as MockedFunction<typeof useDebounce>
    ).mockImplementation((val) => val);
  });

  describe("Base Rendering & Query Boundaries", () => {
    it("should render the Spinner component if isLoading is active", () => {
      (
        useEmployees as unknown as MockedFunction<typeof useEmployees>
      ).mockReturnValueOnce({
        employees: [],
        isLoading: true,
        error: null,
      } as any);

      render(<EmployeesContent />);

      expect(
        screen.getByRole("status", { name: /loading/i }),
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId("mock-employee-table"),
      ).not.toBeInTheDocument();
    });

    it("should display the operational error message layout container if the query rejections arrive", () => {
      (
        useEmployees as unknown as MockedFunction<typeof useEmployees>
      ).mockReturnValueOnce({
        employees: [],
        isLoading: false,
        error: new Error("Network latency constraint exceeded"),
      } as any);

      render(<EmployeesContent />);

      expect(
        screen.getByText(
          "Error loading employees: Network latency constraint exceeded",
        ),
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId("mock-employee-table"),
      ).not.toBeInTheDocument();
    });

    it("should display the heading label from translation values safely", () => {
      render(<EmployeesContent />);

      expect(
        screen.getByRole("heading", { name: /^employee$/i }),
      ).toBeInTheDocument();
    });
  });

  describe("Search & String Filtering Pipelines", () => {
    it("should correctly render the entire list collection if the search parameters are empty strings", () => {
      render(<EmployeesContent />);

      expect(screen.getByTestId("emp-item-emp-1")).toBeInTheDocument();
      expect(screen.getByTestId("emp-item-emp-2")).toBeInTheDocument();
    });

    it("should filter the visible data rows when string inputs match a first name parameter", () => {
      render(<EmployeesContent />);

      const searchInput = screen.getByTestId("search-input");
      fireEvent.change(searchInput, { target: { value: "Alice" } });

      expect(screen.getByTestId("emp-item-emp-1")).toBeInTheDocument();
      expect(screen.queryByTestId("emp-item-emp-2")).not.toBeInTheDocument();
    });

    it("should filter the visible data rows when string inputs match a last name parameter", () => {
      render(<EmployeesContent />);

      const searchInput = screen.getByTestId("search-input");
      fireEvent.change(searchInput, { target: { value: "Jones" } });

      expect(screen.queryByTestId("emp-item-emp-1")).not.toBeInTheDocument();
      expect(screen.getByTestId("emp-item-emp-2")).toBeInTheDocument();
    });

    it("should filter the visible data rows when string inputs match an email parameter", () => {
      render(<EmployeesContent />);

      const searchInput = screen.getByTestId("search-input");
      fireEvent.change(searchInput, { target: { value: "bob@" } });

      expect(screen.queryByTestId("emp-item-emp-1")).not.toBeInTheDocument();
      expect(screen.getByTestId("emp-item-emp-2")).toBeInTheDocument();
    });

    it("should filter the visible data rows when string inputs match a department name parameter", () => {
      render(<EmployeesContent />);

      const searchInput = screen.getByTestId("search-input");
      fireEvent.change(searchInput, { target: { value: "Engineering" } });

      expect(screen.getByTestId("emp-item-emp-1")).toBeInTheDocument();
      expect(screen.queryByTestId("emp-item-emp-2")).not.toBeInTheDocument();
    });
  });
});
