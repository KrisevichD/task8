"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLanguage } from "@/context/language";
import { ICv } from "@/graphql/cvs/queries";

interface ICvTableProps {
  items: ICv[];
  onDelete?: (cv: ICv) => void;
}

type SortOrder = "asc" | "desc";

export const CvTable = ({ items, onDelete }: ICvTableProps) => {
  const router = useRouter();
  const { t } = useLanguage();
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleNavigateToCv = (id: string) => {
    router.push(`/cvs/${id}`);
  };

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const nameA = a.name?.toLowerCase() || "";
      const nameB = b.name?.toLowerCase() || "";

      if (sortOrder === "asc") {
        return nameA.localeCompare(nameB);
      }
      return nameB.localeCompare(nameA);
    });
  }, [items, sortOrder]);

  return (
    <div className="w-full h-full overflow-y-auto">
      <Table className="table-fixed w-full">
        <TableHeader className="sticky top-0 z-10 bg-background">
          <TableRow className="border-b border-border/50 hover:bg-transparent">
            <TableHead className="w-[40%] text-foreground font-medium pl-5 bg-background">
              <button
                type="button"
                onClick={toggleSort}
                className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer select-none"
              >
                <span>{t("name")}</span>
                {sortOrder === "asc" ? (
                  <ArrowUp className="size-4 text-muted-foreground" />
                ) : (
                  <ArrowDown className="size-4 text-muted-foreground" />
                )}
              </button>
            </TableHead>
            <TableHead className="w-[30%] text-foreground font-medium bg-background">
              {t("education")}
            </TableHead>
            <TableHead className="w-[25%] text-foreground font-medium pr-0 bg-background">
              {t("employee")}
            </TableHead>
            <TableHead className="w-[10%] text-right bg-background" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {sortedItems.length > 0 ? (
            sortedItems.map((cv) => (
              <React.Fragment key={cv.id}>
                <TableRow className="border-none hover:bg-transparent">
                  <TableCell className="font-semibold text-foreground pt-6 pb-2 pl-5 truncate">
                    {cv.name}
                  </TableCell>
                  <TableCell className="font-semibold text-foreground pt-6 pb-2 truncate">
                    {cv.education || "—"}
                  </TableCell>
                  <TableCell className="font-semibold text-foreground pt-6 pb-2 truncate">
                    {cv.user?.email || "—"}
                  </TableCell>
                  <TableCell className="text-right pt-6 pb-2 pr-4">
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger
                        render={
                          <Button variant="ghost" size="icon">
                            <Icon variant="dots" label="Open settings" />
                          </Button>
                        }
                      />
                      <DropdownMenuPortal>
                        <DropdownMenuContent align="end" className="z-50">
                          <DropdownMenuGroup>
                            <DropdownMenuItem
                              onClick={() => handleNavigateToCv(cv.id)}
                            >
                              {t("edit") || "Edit"}
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                          <DropdownMenuSeparator />
                          <DropdownMenuGroup>
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => onDelete?.(cv)}
                            >
                              {t("delete") || "Delete"}
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenuPortal>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>

                <TableRow className="border-b border-border/40 hover:bg-transparent">
                  <TableCell
                    colSpan={4}
                    className="pt-0 pb-6 pl-5 pr-6 text-sm text-muted-foreground/80 leading-relaxed break-words whitespace-normal"
                  >
                    {cv.description || "—"}
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))
          ) : (
            <TableRow className="hover:bg-transparent border-b-0">
              <TableCell
                colSpan={4}
                className="h-48 text-center text-muted-foreground text-sm"
              >
                <div className="flex flex-col items-center justify-center gap-1.5">
                  <Icon variant="search" className="size-8 opacity-40 mb-1" />
                  <p className="font-medium text-base text-foreground">
                    {t("noResultsFound")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("tryAdjustingSearch")}
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
