import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from ".";

describe("Field UI Component", () => {
  it("renders fieldset, label, and description correctly", () => {
    render(
      <FieldSet>
        <FieldLegend>Personal Info</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="username">Username</FieldLabel>
            <input id="username" type="text" />
            <FieldDescription>Enter your unique username.</FieldDescription>
          </Field>
        </FieldGroup>
      </FieldSet>,
    );

    expect(screen.getByText("Personal Info")).toBeInTheDocument();
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByText("Enter your unique username.")).toBeInTheDocument();
  });

  it("applies orientation attribute correctly", () => {
    render(
      <Field orientation="horizontal" data-testid="field-wrapper">
        <FieldLabel>Subscribe</FieldLabel>
        <input type="checkbox" />
      </Field>,
    );

    const fieldWrapper = screen.getByTestId("field-wrapper");
    expect(fieldWrapper).toHaveAttribute("data-orientation", "horizontal");
  });

  it("renders single error message correctly", () => {
    render(
      <Field>
        <FieldError errors={[{ message: "Username is required" }]} />
      </Field>,
    );

    const errorMsg = screen.getByRole("alert");
    expect(errorMsg).toBeInTheDocument();
    expect(errorMsg).toMatchInlineSnapshot(`
      <div
        class="text-xs font-normal text-destructive"
        data-slot="field-error"
        role="alert"
      >
        Username is required
      </div>
    `);
  });

  it("renders list of unique error messages when multiple errors are passed", () => {
    const errors = [
      { message: "Minimum 8 characters" },
      { message: "Must contain a number" },
      { message: "Minimum 8 characters" }, 
    ];

    render(
      <Field>
        <FieldError errors={errors} />
      </Field>,
    );

    expect(screen.getByText("Minimum 8 characters")).toBeInTheDocument();
    expect(screen.getByText("Must contain a number")).toBeInTheDocument();

    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(2);
  });

  it("renders FieldSeparator with custom content", () => {
    render(<FieldSeparator>OR</FieldSeparator>);

    expect(screen.getByText("OR")).toBeInTheDocument();
  });
});
