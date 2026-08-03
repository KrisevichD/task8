"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";

import { UserSkeleton } from "../ui/user-skeleton";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icon, IconVariants } from "@/components/ui/icon";
import { useMe } from "@/hooks/auth/useMe";
import { getUserIdFromToken } from "@/utils/jwt";
import { cn } from "@/utils/shadcn";

interface INavItem {
  label: string;
  href: string;
  icon: IconVariants;
}

const NAV_ITEMS: INavItem[] = [
  { label: "Employees", href: "/employees", icon: "employees" },
  { label: "Skills", href: "/skills", icon: "skills" },
  { label: "Languages", href: "/languages", icon: "languages" },
  { label: "CVs", href: "/cvs", icon: "cvs" },
];

const emptySubscribe = () => () => {};

export const Sidebar = () => {
  const pathname = usePathname();

  const userId = useSyncExternalStore(
    emptySubscribe,
    () => {
      const id = getUserIdFromToken();
      return id !== undefined ? String(id) : undefined;
    },
    () => undefined,
  );

  const { fullName, initials, avatarUrl, isLoading } = useMe(userId);

  const isProfileLoading = isLoading || !userId;

  return (
    <aside className="w-50 min-h-screen flex flex-col pt-11 pb-1 mr-6 shrink-0 bg-background max-lg:w-full max-lg:min-h-0 max-lg:h-[60px] max-lg:sticky max-lg:bottom-0 max-lg:z-50 max-lg:flex-row max-lg:items-center max-lg:justify-between max-lg:p-3 max-lg:mr-0 max-lg:border-t max-lg:border-border">
      <nav className="space-y-1 w-full max-lg:flex max-lg:space-y-0 max-lg:gap-1 max-lg:w-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3.5 pl-4 pr-4 py-4 w-full text-sm font-medium transition-colors rounded-r-[20px] max-lg:rounded-full max-lg:px-3 max-lg:py-1.5 max-lg:text-xs",
                isActive
                  ? "bg-secondary text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
              )}
            >
              <Icon variant={item.icon} size="md" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="pl-4 pr-3 mt-auto space-y-4 max-lg:pl-0 max-lg:pr-0 max-lg:mt-0 max-lg:space-y-0 max-lg:flex max-lg:items-center max-lg:gap-3">
        {isProfileLoading ? (
          <UserSkeleton />
        ) : (
          <div className="flex items-center gap-3 overflow-hidden transition-all duration-300">
            <Avatar size="lg" className="max-lg:size-7">
              <AvatarImage src={avatarUrl} alt={fullName} />
              <AvatarFallback className="bg-muted text-muted-foreground font-semibold">
                {initials || "U"}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-foreground truncate max-lg:text-xs">
              {fullName}
            </span>
          </div>
        )}

        <button
          type="button"
          className="p-1 text-muted-foreground hover:text-foreground transition-colors max-lg:hidden"
          aria-label="Collapse sidebar"
        >
          <Icon variant="arrow-back" size="sm" />
        </button>
      </div>
    </aside>
  );
};
