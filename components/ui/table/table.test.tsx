import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from ".";

describe("Table UI Component", () => {
  it("renders a full table structure with correct semantic roles and data-slots", () => {
    render(
      <Table>
        <TableCaption>A list of recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>INV-001</TableCell>
            <TableCell>$250.00</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell>$250.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>,
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("A list of recent invoices.")).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Invoice" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "INV-001" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Total" })).toBeInTheDocument();
  });

  it("applies data-state selected to TableRow when specified", () => {
    render(
      <Table>
        <TableBody>
          <TableRow data-state="selected" data-testid="selected-row">
            <TableCell>Selected Item</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    const row = screen.getByTestId("selected-row");
    expect(row).toHaveAttribute("data-state", "selected");
  });

  it("renders container div with data-slot table-container for horizontal overflow", () => {
    const { container } = render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Data</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    const containerDiv = container.querySelector(
      '[data-slot="table-container"]',
    );
    expect(containerDiv).toBeInTheDocument();
    expect(containerDiv).toHaveClass("overflow-x-auto");
  });

  it("applies custom className props to Table components correctly", () => {
    render(
      <Table className="custom-table">
        <TableBody>
          <TableRow className="custom-row">
            <TableCell className="custom-cell">Content</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    expect(screen.getByRole("table")).toHaveClass("custom-table");
    expect(screen.getByRole("row")).toHaveClass("custom-row");
    expect(screen.getByRole("cell")).toHaveClass("custom-cell");
  });
});
