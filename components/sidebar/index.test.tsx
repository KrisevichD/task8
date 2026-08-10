import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockedFunction,
} from "vitest";

await vi.hoisted(async () => {
  await import("react");
});

import { Sidebar } from ".";

import { useLogout } from "@/hooks/auth/useLogout";
import { useMe } from "@/hooks/auth/useMe";
import { getUserIdFromToken } from "@/utils/jwt";

vi.mock("next/link", () => ({
  default: ({ children, href, className }: any) => (
    <a
      href={href}
      className={className}
      data-testid={`link-${href.split("/").join("-")}`}
    >
      {children}
    </a>
  ),
}));

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

vi.mock("react", async () => {
  const actualReact = await vi.importActual<typeof import("react")>("react");
  return {
    ...actualReact,
    useSyncExternalStore: vi.fn(),
  };
});

vi.mock("../ui/button", () => ({
  Button: ({ children, onClick, type }: any) => (
    <button type={type} onClick={onClick} data-testid="logout-btn">
      {children}
    </button>
  ),
}));

vi.mock("../ui/user-skeleton", () => ({
  UserSkeleton: () => (
    <div data-testid="user-skeleton">Skeleton Loading...</div>
  ),
}));

vi.mock("@/components/ui/avatar", () => ({
  Avatar: ({ children, className }: any) => (
    <div data-testid="avatar-root" className={className}>
      {children}
    </div>
  ),
  AvatarImage: () => null,
  AvatarFallback: ({ children, className }: any) => (
    <div data-testid="avatar-fallback" className={className}>
      {children}
    </div>
  ),
}));

vi.mock("@/components/ui/icon", () => ({
  Icon: ({ variant, className }: any) => (
    <span data-testid={`icon-${variant}`} className={className} />
  ),
}));

vi.mock("@/hooks/auth/useLogout", () => ({
  useLogout: vi.fn(),
}));

vi.mock("@/hooks/auth/useMe", () => ({
  useMe: vi.fn(),
}));

vi.mock("@/utils/jwt", () => ({
  getUserIdFromToken: vi.fn(),
}));

describe("Sidebar Component Module", () => {
  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (usePathname as MockedFunction<typeof usePathname>).mockReturnValue(
      "/employees",
    );
    (
      useSyncExternalStore as MockedFunction<typeof useSyncExternalStore>
    ).mockReturnValue("user-123");
    (
      getUserIdFromToken as MockedFunction<typeof getUserIdFromToken>
    ).mockReturnValue("user-123");

    (useLogout as MockedFunction<typeof useLogout>).mockReturnValue({
      logout: mockLogout,
    });

    (useMe as MockedFunction<typeof useMe>).mockReturnValue({
      user: { id: "user-123", email: "john.doe@company.com" } as any,
      fullName: "John Doe",
      initials: "JD",
      avatarUrl: "https://example.com",
      isLoading: false,
      error: undefined,
      positionName: "Developer",
      skills: [],
      languages: [],
    });
  });

  describe("Line 32 & 45 Boundary Coverage", () => {
    it("should invoke server-side fallback snapshot callback parameter", () => {
      let captureServerSnapshot: any = null;
      (
        useSyncExternalStore as MockedFunction<typeof useSyncExternalStore>
      ).mockImplementationOnce((subscribe, getSnapshot, getServerSnapshot) => {
        captureServerSnapshot = getServerSnapshot;
        return "user-123";
      });

      render(<Sidebar />);

      if (typeof captureServerSnapshot === "function") {
        expect(captureServerSnapshot()).toBeUndefined();
      } else {
        throw new Error("getServerSnapshot could not be captured safely");
      }
    });

    it("should flag profile loading states as true if userId is completely missing", () => {
      (
        useSyncExternalStore as MockedFunction<typeof useSyncExternalStore>
      ).mockReturnValueOnce(undefined);
      (useMe as MockedFunction<typeof useMe>).mockReturnValueOnce({
        isLoading: false,
      } as any);

      render(<Sidebar />);

      expect(screen.getByTestId("user-skeleton")).toBeInTheDocument();
    });

    it("should mount UserSkeleton if useMe hook reports loading parameters", () => {
      (useMe as MockedFunction<typeof useMe>).mockReturnValueOnce({
        user: undefined,
        fullName: "User",
        initials: "U",
        avatarUrl: undefined,
        positionName: "",
        skills: [],
        languages: [],
        isLoading: true,
        error: undefined,
      });

      render(<Sidebar />);

      expect(screen.getByTestId("user-skeleton")).toBeInTheDocument();
    });
  });

  describe("Navigation Routing Rules & Style Mutations", () => {
    it("should display all standard NAV_ITEMS and apply font-bold indicators onto active paths", () => {
      render(<Sidebar />);

      expect(screen.getByText("Employees")).toBeInTheDocument();
      const activeLink = screen.getByTestId("link--employees");
      expect(activeLink.className).toContain(
        "bg-secondary text-foreground font-semibold",
      );
    });
  });

  describe("Profile Presentation & Logout Triggers", () => {
    it("should render client user records information parameters seamlessly", () => {
      render(<Sidebar />);

      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("should trigger useLogout callback logic when logout action button fires", async () => {
      const user = userEvent.setup();
      render(<Sidebar />);

      await user.click(screen.getByTestId("logout-btn"));
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });

  describe("SyncExternalStore Internal Callbacks Coverage", () => {
    it("should invoke getUserIdFromToken successfully inside useSyncExternalStore callback layers", () => {
      let captureStoreCallback: any = null;
      (
        useSyncExternalStore as MockedFunction<typeof useSyncExternalStore>
      ).mockImplementationOnce((subscribe, getSnapshot) => {
        captureStoreCallback = getSnapshot;
        return "user-123";
      });

      render(<Sidebar />);

      if (typeof captureStoreCallback === "function") {
        const resultId = captureStoreCallback();
        expect(getUserIdFromToken).toHaveBeenCalled();
        expect(resultId).toBe("user-123");
      } else {
        throw new Error(
          "getSnapshot callback loop context could not be captured safely",
        );
      }
    });

    it("should handle undefined user tokens gracefully inside useSyncExternalStore snapshot layers", () => {
      (
        getUserIdFromToken as MockedFunction<typeof getUserIdFromToken>
      ).mockReturnValueOnce(undefined);
      let captureStoreCallback: any = null;
      (
        useSyncExternalStore as MockedFunction<typeof useSyncExternalStore>
      ).mockImplementationOnce((subscribe, getSnapshot) => {
        captureStoreCallback = getSnapshot;
        return undefined;
      });

      render(<Sidebar />);

      if (typeof captureStoreCallback === "function") {
        const resultId = captureStoreCallback();
        expect(resultId).toBeUndefined();
      }
    });
  });
});
