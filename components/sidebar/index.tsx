"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

export const Sidebar = () => {
  const pathname = usePathname();
  const userId = getUserIdFromToken();

  const { fullName, initials, avatarUrl, isLoading } = useMe(userId);

  return (
    <aside className="w-[200px] shrink-0 bg-background min-h-screen flex flex-col pt-11 pb-1 mr-6">
      <nav className="space-y-1 w-full">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3.5 pl-4 pr-4 py-4 w-full text-sm font-medium transition-colors rounded-r-[20px]",
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

      <div className="pl-4 pr-3 mt-auto space-y-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <Avatar size="lg">
            <AvatarImage src={avatarUrl} alt={fullName} />
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              {isLoading ? "..." : initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-foreground truncate">
            {isLoading ? "Loading..." : fullName}
          </span>
        </div>

        <button
          type="button"
          className="p-1 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Collapse sidebar"
        >
          <Icon variant="arrow-back" size="sm" />
        </button>
      </div>
    </aside>
  );
};
