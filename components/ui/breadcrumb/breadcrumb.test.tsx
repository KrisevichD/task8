import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from ".";

describe("Breadcrumb UI Component", () => {
  it("renders breadcrumb navigation structure correctly", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Current Page</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );

    const nav = screen.getByRole("navigation", { name: /breadcrumb/i });
    expect(nav).toBeInTheDocument();

    const link = screen.getByRole("link", { name: /home/i });
    expect(link).toHaveAttribute("href", "/");

    const currentPage = screen.getByText("Current Page");
    expect(currentPage).toHaveAttribute("aria-current", "page");
  });

  it("renders custom separator when provided", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>&gt;</BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Details</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );

    expect(screen.getByText(">")).toBeInTheDocument();
  });

  it("renders ellipsis component for collapsed paths", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbEllipsis />
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );

    expect(screen.getByText("More")).toBeInTheDocument();
  });
});
