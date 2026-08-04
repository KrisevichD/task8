"use client";

import { MoreVertical } from "lucide-react";
import React from "react";

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
}

export const CvTable = ({ items }: ICvTableProps) => {
  const { t } = useLanguage();

  return (
    <div className="w-full h-full overflow-y-auto">
      <Table className="table-fixed w-full">
        <TableHeader className="sticky top-0 z-10 bg-background">
          <TableRow className="border-b border-border/50 hover:bg-transparent">
            <TableHead className="w-[40%] text-foreground font-medium pl-5 bg-background">
              {t("name")}
            </TableHead>
            <TableHead className="w-[30%] text-foreground font-medium bg-background">
              {t("education")}
            </TableHead>
            <TableHead className="w-[25%] text-foreground font-medium pr-0 bg-background">
              {t("employee")}
            </TableHead>
            <TableHead className="w-[5%] text-right pr-0 bg-background" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {items.length > 0 ? (
            items.map((cv) => (
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
                  <TableCell className="text-right pt-6 pb-2 pr-0">
                    <button
                      type="button"
                      className="p-1 hover:text-foreground text-muted-foreground transition-colors cursor-pointer"
                    >
                      <MoreVertical size={18} />
                    </button>
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
            <TableRow>
              <TableCell
                colSpan={4}
                className="h-24 text-center text-muted-foreground text-sm"
              >
                {t("search")}...
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
