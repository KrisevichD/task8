import { useQuery } from "@apollo/client/react";

import { Employee } from "@/contents/employees/table";
import { GET_EMPLOYEES } from "@/graphql/employees/queries";

export const useEmployees = () => {
  const { data, loading: isLoading, error } = useQuery(GET_EMPLOYEES);

  const employees: Employee[] =
    data?.users.map((user) => ({
      id: user.id,
      email: user.email,
      firstName: user.profile?.first_name || "",
      lastName: user.profile?.last_name || "",
      avatarUrl: user.profile?.avatar,
      department: user.department_name || "-",
      position: user.position_name || "-",
    })) || [];

  return {
    employees,
    isLoading,
    error,
  };
};
