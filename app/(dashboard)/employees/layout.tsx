"use client";

interface IEmployeesLayoutProps {
  children: React.ReactNode;
}

export default function EmployeesLayout({ children }: IEmployeesLayoutProps) {
  return (
    <div className="flex flex-col h-screen overflow-hidden py-4">
      <div className="flex-1 min-h-0 overflow-y-auto">{children}</div>
    </div>
  );
}
