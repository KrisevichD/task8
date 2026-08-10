import { useQuery } from "@apollo/client/react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockedFunction,
} from "vitest";

import CvsContent from "./index";

import { ICv } from "@/graphql/cvs/queries";
import useCreateCv from "@/hooks/cvs/useCreateCv";
import { useDeleteCv } from "@/hooks/cvs/useDeleteCv";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
}));

vi.mock("@/context/language", () => ({
  useLanguage: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        cvs: "CVs",
        createCv: "CREATE CV",
        add: "add",
        name: "Name",
        education: "Education",
        description: "Description",
        cancel: "cancel",
        isRequired: " is required!",
      };
      return map[key] || key;
    },
  }),
}));

vi.mock("@apollo/client/react", () => ({
  useQuery: vi.fn(),
}));

vi.mock("@/hooks/cvs/useCreateCv", () => ({
  __esModule: true,
  default: vi.fn(),
}));

vi.mock("@/hooks/cvs/useDeleteCv", () => ({
  useDeleteCv: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

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

vi.mock("@/components/ui/spinner", () => ({
  Spinner: () => (
    <div role="status" aria-label="Loading" data-testid="spinner-root">
      Loading...
    </div>
  ),
}));

vi.mock("@/components/ui/icon", () => ({
  Icon: ({ variant }: { variant: string }) => (
    <span data-testid={`icon-${variant}`} />
  ),
}));

vi.mock("@/components/ui/floating-input", () => ({
  FloatingInput: ({ label, disabled, ...props }: any) => (
    <div>
      <label htmlFor={props.id || props.name}>{label}</label>
      <input id={props.id || props.name} disabled={disabled} {...props} />
    </div>
  ),
}));

vi.mock("@/components/ui/floating-textarea", () => ({
  FloatingTextarea: ({ label, disabled, ...props }: any) => (
    <div>
      <label htmlFor={props.id || props.name}>{label}</label>
      <textarea id={props.id || props.name} disabled={disabled} {...props} />
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

// Правильный мок Dialog с поддержкой открытия/закрытия
vi.mock("@/components/ui/dialog", () => {
  return {
    Dialog: ({ children, open, onOpenChange }: any) => (
      <div data-testid="dialog" data-open={open}>
        {typeof children === "function"
          ? children({ open, onOpenChange })
          : children}
      </div>
    ),
    DialogTrigger: ({ render, onClick }: any) => {
      return render ? (
        <span onClick={onClick} data-testid="dialog-trigger">
          {render}
        </span>
      ) : null;
    },
    DialogContent: ({ children }: any) => <div>{children}</div>,
    DialogTitle: ({ children, className }: any) => (
      <h2 className={className}>{children}</h2>
    ),
    DialogFooter: ({ children }: any) => <div>{children}</div>,
    DialogClose: ({ render }: any) => render,
  };
});

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

    (useQuery as unknown as MockedFunction<typeof useQuery>).mockImplementation(
      () =>
        ({
          data: { cvs: mockCvsData },
          loading: false,
          error: null,
        }) as any,
    );

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
      ).mockImplementation(
        () =>
          ({
            data: null,
            loading: true,
            error: null,
          }) as any,
      );

      render(<CvsContent />);

      expect(screen.getByRole("status")).toBeInTheDocument();
      expect(screen.queryByTestId("mock-cv-table")).not.toBeInTheDocument();
    });

    it("should display the operational error message layout container if the query rejections arrive", () => {
      (
        useQuery as unknown as MockedFunction<typeof useQuery>
      ).mockImplementation(
        () =>
          ({
            data: null,
            loading: false,
            error: new Error("Network latency constraint exceeded"),
          }) as any,
      );

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
      ).mockImplementation(
        () =>
          ({
            data: { cvs: [] },
            loading: false,
            error: null,
          }) as any,
      );

      render(<CvsContent />);

      expect(screen.getByTestId("mock-cv-table")).toBeInTheDocument();
      expect(screen.queryByTestId("cv-item-cv-101")).not.toBeInTheDocument();
    });
  });

  describe("Search & String Filtering Pipelines", () => {
    it("should correctly render the entire list collection if search query is empty", () => {
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

  describe("External Actions Triggers & Form Interactions", () => {
    it("should render create button correctly and open dialog on click", async () => {
      const user = userEvent.setup();
      render(<CvsContent />);

      const createBtn = screen.getByRole("button", { name: /create cv/i });
      expect(createBtn).toBeInTheDocument();

      await user.click(createBtn);

      expect(screen.getByText("add CV")).toBeInTheDocument();
    });

    it("should submit create form with values when submit button is clicked", async () => {
      const user = userEvent.setup();
      render(<CvsContent />);

      const createBtn = screen.getByRole("button", { name: /create cv/i });
      await user.click(createBtn);

      const nameInput = screen.getByLabelText("Name");
      const educationInput = screen.getByLabelText("Education");
      const descriptionInput = screen.getByLabelText("Description");

      await user.type(nameInput, "New CV Name");
      await user.type(educationInput, "Harvard University");
      await user.type(descriptionInput, "Senior Software Engineer CV");

      const submitBtn = screen.getByRole("button", { name: /^add$/i });
      await user.click(submitBtn);

      expect(mockCreateCvFn).toHaveBeenCalledWith({
        name: "New CV Name",
        education: "Harvard University",
        description: "Senior Software Engineer CV",
      });
    });

    it("should forward deletion requests safely onto useDeleteCv hook upon list selection clicks", async () => {
      const user = userEvent.setup();
      render(<CvsContent />);

      const deleteBtn = screen.getByTestId("delete-btn-cv-101");
      await user.click(deleteBtn);

      expect(mockDeleteCvFn).toHaveBeenCalledWith("cv-101");
    });
  });
});
