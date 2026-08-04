"use client";

import { useState } from "react";

import { EmployeeTable } from "./table";

import { SearchInput } from "@/components/ui/search-input";
import { useLanguage } from "@/context/language";
import { useEmployees } from "@/hooks/employees/useEmployees";
import { useDebounce } from "@/hooks/useDebounce";

export const EmployeesContent = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const { employees, isLoading, error } = useEmployees();
  const { t } = useLanguage();

  const filteredEmployees = employees.filter((emp) => {
    const q = debouncedSearch.toLowerCase();
    return (
      emp.firstName?.toLowerCase().includes(q) ||
      emp.lastName?.toLowerCase().includes(q) ||
      emp.email?.toLowerCase().includes(q) ||
      emp.department?.toLowerCase().includes(q)
    );
  });

  if (error) {
    return (
      <div className="p-8 text-center text-destructive">{error.message}</div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0 pl-11 pr-8 space-y-3 pb-3">
        <h1 className="text-base font-normal text-muted-foreground">
          {t("employees")}
        </h1>
        <SearchInput value={search} onChange={setSearch} />
      </div>

      <div className="flex-1 min-h-0">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">
            {t("search")}...
          </div>
        ) : (
          <EmployeeTable employees={filteredEmployees} />
        )}
      </div>
    </div>
  );
};
