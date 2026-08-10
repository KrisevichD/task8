import { useQuery } from "@apollo/client/react";
import { renderHook } from "@testing-library/react";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockedFunction,
} from "vitest";

import { useEmployees } from "./useEmployees";

import { GET_EMPLOYEES } from "@/graphql/employees/queries";

vi.mock("@apollo/client/react", () => ({
  useQuery: vi.fn(),
}));

describe("useEmployees Hook Module", () => {
  const mockApiResponse = {
    users: [
      {
        id: "emp-101",
        email: "alice@company.com",
        department_name: "Engineering",
        position_name: "Tech Lead",
        profile: {
          first_name: "Alice",
          last_name: "Smith",
          avatar: "https://example.com",
        },
      },
      {
        id: "emp-102",
        email: "bob@company.com",
        department_name: "", // Will trigger fallback condition
        position_name: null, // Will trigger fallback condition
        profile: null, // Will trigger fallback object properties checks
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();

    (useQuery as unknown as MockedFunction<typeof useQuery>).mockReturnValue({
      data: mockApiResponse,
      loading: false,
      error: null,
    } as any);
  });

  describe("Query Initialization", () => {
    it("should invoke useQuery hook with GET_EMPLOYEES node reference mapping rules", () => {
      renderHook(() => useEmployees());

      expect(useQuery).toHaveBeenCalledWith(GET_EMPLOYEES);
    });
  });

  describe("Data Transformation & Fallback Value Branches Coverage", () => {
    it("should successfully structure completely mapped user records directly from data sets payloads", () => {
      const { result } = renderHook(() => useEmployees());

      expect(result.current.employees[0]).toEqual({
        id: "emp-101",
        email: "alice@company.com",
        firstName: "Alice",
        lastName: "Smith",
        avatarUrl: "https://example.com",
        department: "Engineering",
        position: "Tech Lead",
      });
    });

    it("should substitute default fallbacks gracefully if profile datasets or string targets evaluate to null", () => {
      // ✅ FIX COVERAGE: Validates truthy/falsy fallback properties path mapping rules inside the array converter
      const { result } = renderHook(() => useEmployees());

      expect(result.current.employees[1]).toEqual({
        id: "emp-102",
        email: "bob@company.com",
        firstName: "", // Fallback applied because user.profile was null
        lastName: "", // Fallback applied because user.profile was null
        avatarUrl: undefined,
        department: "-", // Fallback applied because department_name was empty string
        position: "-", // Fallback applied because position_name was null
      });
    });

    it("should return an empty array collection structure cleanly if the graph response data object is empty", () => {
      // ✅ FIX COVERAGE: Validates the root array assignment guard pathing condition rules
      (
        useQuery as unknown as MockedFunction<typeof useQuery>
      ).mockReturnValueOnce({
        data: undefined,
        loading: false,
        error: null,
      } as any);

      const { result } = renderHook(() => useEmployees());

      expect(result.current.employees).toEqual([]);
      expect(result.current.isLoading).toBe(false);
    });
  });
});
