"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icon } from "@/components/ui/icon";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type Employee = {
  id: string;
  avatarUrl?: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position?: string;
};

interface IEmployeeTableProps {
  employees: Employee[];
}

type SortOrder = "asc" | "desc";

export const EmployeeTable = ({ employees }: IEmployeeTableProps) => {
  const router = useRouter();
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const sortedEmployees = [...employees].sort((a, b) => {
    const deptA = a.department.toLowerCase();
    const deptB = b.department.toLowerCase();

    if (sortOrder === "asc") {
      return deptA.localeCompare(deptB);
    }
    return deptB.localeCompare(deptA);
  });

  const handleRowClick = (id: string) => {
    router.push(`/employees/${id}`);
  };

  return (
    <div className="w-full h-full overflow-y-auto">
      <Table className="[&>div]:overflow-visible border-collapse">
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b border-border">
            <TableHead className="w-18.5 sticky top-0 z-30 bg-background" />
            <TableHead className="text-foreground font-medium text-xs sticky top-0 z-30 bg-background">
              First Name
            </TableHead>
            <TableHead className="text-foreground font-medium text-xs sticky top-0 z-30 bg-background">
              Last Name
            </TableHead>
            <TableHead className="text-foreground font-medium text-xs sticky top-0 z-30 bg-background">
              Email
            </TableHead>

            <TableHead className="text-foreground font-medium text-xs sticky top-0 z-30 bg-background">
              <button
                type="button"
                onClick={toggleSort}
                className="flex items-center gap-1 cursor-pointer select-none hover:text-foreground/80 transition-colors"
              >
                <span>Department</span>
                <Icon
                  variant="arrow-back"
                  className={`size-3 transition-transform duration-200 ${
                    sortOrder === "asc" ? "rotate-90" : "-rotate-90"
                  }`}
                />
              </button>
            </TableHead>

            <TableHead className="text-foreground font-medium text-xs sticky top-0 z-30 bg-background">
              Position
            </TableHead>
            <TableHead className="w-12 pr-6 sticky top-0 z-30 bg-background" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {sortedEmployees.length > 0 ? (
            sortedEmployees.map((emp) => {
              const initials =
                `${emp.firstName[0] || ""}${emp.lastName[0] || ""}`.toUpperCase() ||
                "U";

              return (
                <TableRow
                  key={emp.id}
                  onClick={() => handleRowClick(emp.id)}
                  className="h-16 hover:bg-secondary/30 transition-colors cursor-pointer border-b border-border/50"
                >
                  <TableCell className="py-2">
                    <Avatar size="lg">
                      <AvatarImage src={emp.avatarUrl} alt={emp.firstName} />
                      <AvatarFallback className="bg-muted text-muted-foreground font-medium text-sm">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>

                  <TableCell className="text-sm text-foreground">
                    {emp.firstName}
                  </TableCell>

                  <TableCell className="text-sm text-foreground">
                    {emp.lastName || "-"}
                  </TableCell>

                  <TableCell className="text-sm text-muted-foreground">
                    {emp.email}
                  </TableCell>

                  <TableCell className="text-sm text-foreground">
                    {emp.department}
                  </TableCell>

                  <TableCell className="text-sm text-foreground">
                    {emp.position || "-"}
                  </TableCell>

                  <TableCell className="pr-6 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(emp.id);
                      }}
                      className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Actions"
                    >
                      <Icon
                        variant="arrow-back"
                        className="rotate-180 size-4"
                      />
                    </button>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={7}
                className="h-24 text-center text-muted-foreground text-sm"
              >
                No employees found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
