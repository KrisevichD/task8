import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import CvDetailsForm from ".";

import useCvConstructor from "@/hooks/cvs/useCvConstructor";
import { ICvResponce } from "@/types/cv-constructor";

vi.mock("@/hooks/cvs/useCvConstructor", () => ({
  default: vi.fn(),
}));

describe("CvDetailsForm Component", () => {
  const mockUpdateCv = vi.fn();

  const mockCvData: ICvResponce = {
    id: "cv-123",
    name: "John Doe CV",
    education: "MIT University",
    description: "Experienced Frontend Engineer",
  } as unknown as ICvResponce;

  beforeEach(() => {
    vi.clearAllMocks();

    (useCvConstructor as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      updateCv: mockUpdateCv,
    });
  });

  it("populates inputs with initial cvData values", () => {
    const { container } = render(<CvDetailsForm cvData={mockCvData} />);

    const nameInput = container.querySelector('input[name="name"]');
    const educationInput = container.querySelector('input[name="education"]');
    const descriptionTextarea = container.querySelector(
      'textarea[name="description"]',
    );

    expect(nameInput).toHaveValue("John Doe CV");
    expect(educationInput).toHaveValue("MIT University");
    expect(descriptionTextarea).toHaveValue("Experienced Frontend Engineer");
  });

  it("keeps UPDATE button disabled when form is not dirty and enables it on user input", async () => {
    const user = userEvent.setup();
    const { container } = render(<CvDetailsForm cvData={mockCvData} />);

    const updateBtn = screen.getByRole("button", { name: /update/i });
    expect(updateBtn).toBeDisabled();

    const nameInput = container.querySelector(
      'input[name="name"]',
    ) as HTMLInputElement;
    await user.type(nameInput, " Updated");

    expect(updateBtn).not.toBeDisabled();
  });

  it("calls updateCv with updated values on form submission", async () => {
    const user = userEvent.setup();
    const { container } = render(<CvDetailsForm cvData={mockCvData} />);

    const nameInput = container.querySelector(
      'input[name="name"]',
    ) as HTMLInputElement;

    await user.clear(nameInput);
    await user.type(nameInput, "Jane Doe CV");

    const updateBtn = screen.getByRole("button", { name: /update/i });
    await user.click(updateBtn);

    await waitFor(() => {
      expect(mockUpdateCv).toHaveBeenCalledWith({
        cvId: "cv-123",
        name: "Jane Doe CV",
        education: "MIT University",
        description: "Experienced Frontend Engineer",
      });
    });
  });
});
