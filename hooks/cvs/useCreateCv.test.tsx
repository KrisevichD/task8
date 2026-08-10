import { useQuery } from "@apollo/client/react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockedFunction,
} from "vitest";

// ✅ FIX 1: Mock your structural GraphQL mutation definitions before relative dependencies load
vi.mock("@/graphql/cvs", () => ({
  CREATE_CV_MUTATION: { kind: "Document", definitions: [] } as any,
}));

vi.mock("@/graphql/cvs/queries", () => ({
  GET_CVS: { kind: "Document", definitions: [] } as any,
}));

import CvsContent from "@/contents/cvs";
import { ICv } from "@/graphql/cvs/queries";
import useCreateCv from "@/hooks/cvs/useCreateCv";
import { useDeleteCv } from "@/hooks/cvs/useDeleteCv";

// Mock Apollo hooks
vi.mock("@apollo/client/react", () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(() => [vi.fn(), { loading: false }]),
}));

// ✅ FIX 2: Correctly mock hook exports as default functional stubs
vi.mock("@/hooks/cvs/useCreateCv", () => ({
  __esModule: true,
  default: vi.fn(),
}));

vi.mock("@/hooks/cvs/useDeleteCv", () => ({
  useDeleteCv: vi.fn(),
}));

// Mock nested table child to simplify list queries mappings
vi.mock("./table", () => ({
  CvTable: ({
    items,
    onDelete,
  }: {
    items: ICv[];
    onDelete: (cv: ICv) => void;
  }) => (
    <div data-testid="mock-cv-table">
      <ul>
        {items.map((cv) => (
          <li key={cv.id} data-testid={`cv-item-${cv.id}`}>
            <span>{cv.name}</span> - <span>{cv.education}</span> -{" "}
            <span>{cv.user?.email}</span>
            <button
              data-testid={`delete-btn-${cv.id}`}
              onClick={() => onDelete(cv)}
            >
              Delete
            </button>
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

vi.mock("@/components/ui/icon", () => ({
  Icon: ({ variant }: { variant: string }) => (
    <span data-testid={`icon-${variant}`} />
  ),
}));

vi.mock("@/components/ui/spinner", () => ({
  Spinner: () => (
    <div role="status" aria-label="Loading">
      Loading...
    </div>
  ),
}));

vi.mock("@/components/ui/breadcrumb", () => ({
  Breadcrumb: ({ children }: any) => <div>{children}</div>,
  BreadcrumbList: ({ children }: any) => <ul>{children}</ul>,
  BreadcrumbItem: ({ children, className }: any) => (
    <li className={className}>{children}</li>
  ),
}));

// ✅ FIX 3: Simplify button wrapper rendering definitions to handle disabled and actions triggers cleanly
vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, disabled, className }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      data-testid="custom-btn"
    >
      {children}
    </button>
  ),
}));

describe("CvsContent Component Module", () => {
  const mockCreateCvFn = vi.fn();
  const mockDeleteCvFn = vi.fn();

  const mockCvsData: ICv[] = [
    {
      id: "cv-101",
      name: "Frontend Engineer Resume",
      education: "BSc Computer Science",
      user: { email: "alice@company.com" },
    } as any,
    {
      id: "cv-102",
      name: "Backend Developer Profile",
      education: "MSc Systems Engineering",
      user: { email: "bob@company.com" },
    } as any,
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    (useQuery as unknown as MockedFunction<typeof useQuery>).mockReturnValue({
      data: { cvs: mockCvsData },
      loading: false,
      error: null,
    } as any);

    // ✅ FIX 4: Explicitly map return payload interface to match default export hook specifications
    (
      useCreateCv as unknown as MockedFunction<typeof useCreateCv>
    ).mockReturnValue({
      createCv: mockCreateCvFn,
      isLoading: false,
      errorText: "",
    });

    (
      useDeleteCv as unknown as MockedFunction<typeof useDeleteCv>
    ).mockReturnValue({
      deleteCv: mockDeleteCvFn,
    });
  });

  describe("Base Rendering & Query Boundaries", () => {
    it("should render the Spinner component using its explicit role parameter if isLoadingCvs is active", () => {
      (
        useQuery as unknown as MockedFunction<typeof useQuery>
      ).mockReturnValueOnce({
        data: null,
        loading: true,
        error: null,
      } as any);

      render(<CvsContent />);

      expect(
        screen.getByRole("status", { name: /loading/i }),
      ).toBeInTheDocument();
      expect(screen.queryByTestId("mock-cv-table")).not.toBeInTheDocument();
    });

    it("should display the operational error message layout container if the query rejections arrive", () => {
      (
        useQuery as unknown as MockedFunction<typeof useQuery>
      ).mockReturnValueOnce({
        data: null,
        loading: false,
        error: new Error("Network latency constraint exceeded"),
      } as any);

      render(<CvsContent />);

      expect(
        screen.getByText(
          "Error loading CVs: Network latency constraint exceeded",
        ),
      ).toBeInTheDocument();
      expect(screen.queryByTestId("mock-cv-table")).not.toBeInTheDocument();
    });

    it("should fallback gracefully onto an empty array if data response parameters return null", () => {
      (
        useQuery as unknown as MockedFunction<typeof useQuery>
      ).mockReturnValueOnce({
        data: null,
        loading: false,
        error: null,
      } as any);

      render(<CvsContent />);

      expect(screen.getByTestId("mock-cv-table")).toBeInTheDocument();
      expect(screen.queryByTestId(/cv-item-/)).not.toBeInTheDocument();
    });
  });

  describe("Search & String Filtering Pipelines", () => {
    it("should correctly render the entire list collection if the search parameters are empty strings", () => {
      render(<CvsContent />);

      expect(screen.getByTestId("cv-item-cv-101")).toBeInTheDocument();
      expect(screen.getByTestId("cv-item-cv-102")).toBeInTheDocument();
    });

    it("should filter the visible data rows when string inputs match a CV name parameter", () => {
      render(<CvsContent />);

      const searchInput = screen.getByTestId("search-input");
      fireEvent.change(searchInput, { target: { value: "Frontend" } });

      expect(screen.getByTestId("cv-item-cv-101")).toBeInTheDocument();
      expect(screen.queryByTestId("cv-item-cv-102")).not.toBeInTheDocument();
    });

    it("should filter the visible data rows when string inputs match an education description parameter", () => {
      render(<CvsContent />);

      const searchInput = screen.getByTestId("search-input");
      fireEvent.change(searchInput, { target: { value: "Systems" } });

      expect(screen.queryByTestId("cv-item-cv-101")).not.toBeInTheDocument();
      expect(screen.getByTestId("cv-item-cv-102")).toBeInTheDocument();
    });

    it("should filter the visible data rows when string inputs match an account user email string", () => {
      render(<CvsContent />);

      const searchInput = screen.getByTestId("search-input");
      fireEvent.change(searchInput, { target: { value: "alice@" } });

      expect(screen.getByTestId("cv-item-cv-101")).toBeInTheDocument();
      expect(screen.queryByTestId("cv-item-cv-102")).not.toBeInTheDocument();
    });
  });

  describe("External Actions Triggers", () => {
    it("should execute createCv hook operations with hardcoded parameters when CREATE CV button fires", async () => {
      const user = userEvent.setup();
      render(<CvsContent />);

      const createBtn = screen.getByRole("button", { name: /create cv/i });
      await user.click(createBtn);

      expect(mockCreateCvFn).toHaveBeenCalledWith({
        cv: {
          userId: "610",
          name: "CV",
          description: "CV description",
          education: "CV education",
        },
      });
    });

    it("should cleanly assign disabled properties onto buttons if isCreating parameters are true", () => {
      // ✅ FIX 5: Aligns hook overrides securely with our default signature requirements to satisfy button locking assertions
      (
        useCreateCv as unknown as MockedFunction<typeof useCreateCv>
      ).mockReturnValueOnce({
        createCv: mockCreateCvFn,
        isLoading: true,
        errorText: "",
      });

      render(<CvsContent />);

      const createBtn = screen.getByRole("button", { name: /create cv/i });
      expect(createBtn).toBeDisabled();
    });

    it("should forward deletion requests safely onto useDeleteCv hook variables loops upon list selection clicks", async () => {
      const user = userEvent.setup();
      render(<CvsContent />);

      const deleteBtn = screen.getByTestId("delete-btn-cv-101");
      await user.click(deleteBtn);

      expect(mockDeleteCvFn).toHaveBeenCalledWith("cv-101");
    });
  });
});
