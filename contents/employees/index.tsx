"use client";

import { useState } from "react";

import { EmployeeTable } from "./table";

import { SearchInput } from "@/components/ui/search-input";
import { Spinner } from "@/components/ui/spinner";
import { useLanguage } from "@/context/language";
import { useDebounce } from "@/hooks/common/useDebounce";
import { useEmployees } from "@/hooks/employees/useEmployees";

export const EmployeesContent = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const { employees, isLoading, error } = useEmployees();
  const { t } = useLanguage();

  if (error) {
    return (
      <div className=" text-center flex justify-center items-center text-destructive">
        Error loading employees: {error.message}
      </div>
    );
  }
  const filteredEmployees = employees.filter((emp) => {
    const q = debouncedSearch.toLowerCase();
    return (
      emp.firstName?.toLowerCase().includes(q) ||
      emp.lastName?.toLowerCase().includes(q) ||
      emp.email?.toLowerCase().includes(q) ||
      emp.department?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0 pl-8 space-y-3 pb-3">
        <h1 className="text-base font-normal text-muted-foreground">
          {t("employee")}
        </h1>
        <SearchInput value={search} onChange={setSearch} />
      </div>

      <div className="flex-1 min-h-0 flex justify-center items-center">
        {isLoading ? (
          <Spinner />
        ) : (
          <EmployeeTable employees={filteredEmployees} />
        )}
      </div>
    </div>
  );
};
