import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { hoistedReact } = await vi.hoisted(async () => {
  const ReactModule = await import("react");
  return { hoistedReact: ReactModule.default || ReactModule };
});

import CvDetailsForm from ".";

import useCvConstructor from "@/hooks/cvs/useCvConstructor";
import { ICvResponce } from "@/types/cv-constructor";

vi.mock("@/hooks/cvs/useCvConstructor", () => ({
  default: vi.fn(),
}));

vi.mock("../../ui/floating-input", () => ({
  FloatingInput: hoistedReact.forwardRef(
    ({ label, ...props }: any, ref: any) => (
      <div data-testid={`input-wrapper-${label}`}>
        <label>{label}</label>
        <input ref={ref} data-testid={`input-field-${label}`} {...props} />
      </div>
    ),
  ),
}));

vi.mock("@/components/ui/floating-textarea", () => ({
  FloatingTextarea: hoistedReact.forwardRef(
    ({ label, ...props }: any, ref: any) => (
      <div data-testid={`textarea-wrapper-${label}`}>
        <label>{label}</label>
        <textarea
          ref={ref}
          data-testid={`textarea-field-${label}`}
          {...props}
        />
      </div>
    ),
  ),
}));

describe("CvDetailsForm Component", () => {
  const mockUpdateCv = vi.fn();

  const mockCvData: ICvResponce = {
    id: "cv-999",
    name: "John Doe Senior Resume",
    education: "MIT Computer Science",
    description: "Experienced Full Stack Engineer",
    projects: [],
    skills: [],
    languages: [],
    user: { id: "u-1" } as any,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    (useCvConstructor as any).mockReturnValue({
      updateCv: mockUpdateCv,
    });
  });

  describe("Branch Condition Coverage (Lines 32-49)", () => {
    it("should pre-populate and reset all form inputs inside the state hook when cvData mounts", () => {
      render(<CvDetailsForm cvData={mockCvData} />);

      expect(screen.getByTestId("input-field-Name")).toHaveValue(
        "John Doe Senior Resume",
      );
      expect(screen.getByTestId("input-field-Education")).toHaveValue(
        "MIT Computer Science",
      );
      expect(screen.getByTestId("textarea-field-Description")).toHaveValue(
        "Experienced Full Stack Engineer",
      );
    });

    it("should keep the form action trigger button locked if variables remain identical to defaults", () => {
      render(<CvDetailsForm cvData={mockCvData} />);

      const submitBtn = screen.getByRole("button", { name: /update/i });
      expect(submitBtn).toBeDisabled();
    });
  });

  describe("Mutation Executions", () => {
    it("should release button lock states upon input modification and fire updateCv mutation with custom dataset payload", async () => {
      const user = userEvent.setup();
      render(<CvDetailsForm cvData={mockCvData} />);

      const nameField = screen.getByTestId("input-field-Name");

      await user.clear(nameField);
      await user.type(nameField, "John Doe Principal Resume");

      const submitBtn = screen.getByRole("button", { name: /update/i });
      expect(submitBtn).not.toBeDisabled();

      await user.click(submitBtn);

      await waitFor(() => {
        expect(mockUpdateCv).toHaveBeenCalledWith({
          cvId: "cv-999",
          name: "John Doe Principal Resume",
          education: "MIT Computer Science",
          description: "Experienced Full Stack Engineer",
        });
      });
    });
  });
});
