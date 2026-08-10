import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { AvatarSection } from "./avatarSection";

vi.mock("@/components/ui/avatar", () => ({
  Avatar: ({ children, className }: any) => (
    <div data-testid="avatar-root" className={className}>
      {children}
    </div>
  ),
  AvatarImage: ({ src, alt }: any) => (
    <span data-testid="avatar-img" data-src={src} data-alt={alt} />
  ),
  AvatarFallback: ({ children, className }: any) => (
    <div data-testid="avatar-fallback" className={className}>
      {children}
    </div>
  ),
}));

vi.mock("@/components/ui/icon", () => ({
  Icon: ({ variant, size, className }: any) => (
    <span
      data-testid={`icon-${variant}`}
      data-size={size}
      className={className}
    />
  ),
}));

describe("AvatarSection Component Module", () => {
  const mockOnAvatarChange = vi.fn();

  const defaultProps = {
    avatarUrl: "https://example.com",
    avatarPreview: null,
    firstName: "Jane",
    initials: "JD",
    isOwner: false,
    onAvatarChange: mockOnAvatarChange,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Base Layout & Authorization Branches", () => {
    it("should render avatar components with initials, but completely hide file upload interaction elements when isOwner is false", () => {
      render(<AvatarSection {...defaultProps} />);

      expect(screen.getByTestId("avatar-root")).toBeInTheDocument();
      expect(screen.getByTestId("avatar-img")).toHaveAttribute(
        "data-src",
        "https://example.com",
      );
      expect(screen.getByTestId("avatar-fallback").textContent).toBe("JD");

      expect(screen.queryByText("Upload avatar image")).not.toBeInTheDocument();
      expect(
        screen.queryByText("png, jpg or gif no more than 0.5MB"),
      ).not.toBeInTheDocument();
    });

    it("should render file selection fields, instructions text, and upload icon markers cleanly when isOwner is true", () => {
      render(<AvatarSection {...defaultProps} isOwner={true} />);

      expect(screen.getByText("Upload avatar image")).toBeInTheDocument();
      expect(
        screen.getByText("png, jpg or gif no more than 0.5MB"),
      ).toBeInTheDocument();
      expect(screen.getByTestId("icon-upload")).toBeInTheDocument();

      const fileInput = screen
        .getByTestId("avatar-root")
        .parentElement?.querySelector('input[type="file"]');
      expect(fileInput).toBeInTheDocument();
      expect(fileInput).toHaveAttribute(
        "accept",
        "image/png, image/jpeg, image/gif",
      );
    });
  });

  describe("Dynamic Preview Routing Priorities", () => {
    it("should favor avatarPreview base64 string tokens over base database source urls if available", () => {
      render(
        <AvatarSection
          {...defaultProps}
          avatarPreview="data:image/png;base64,LocalPreviewBytesString"
        />,
      );

      expect(screen.getByTestId("avatar-img")).toHaveAttribute(
        "data-src",
        "data:image/png;base64,LocalPreviewBytesString",
      );
    });
  });

  describe("Interactive Events Propagation", () => {
    it("should correctly dispatch the onAvatarChange callback handler when a file selection event executes", () => {
      render(<AvatarSection {...defaultProps} isOwner={true} />);

      const fileInput = screen
        .getByTestId("avatar-root")
        .parentElement?.querySelector('input[type="file"]');
      if (!fileInput)
        throw new Error(
          "File input target reference could not be found inside the DOM tree",
        );

      const mockFile = new File(["image-bytes"], "avatar.jpg", {
        type: "image/jpeg",
      });

      fireEvent.change(fileInput, {
        target: { files: [mockFile] },
      });

      expect(mockOnAvatarChange).toHaveBeenCalledTimes(1);
    });
  });
});
