import { Sidebar } from "@/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="">
      <Sidebar />
      <main className="ml-0 lg:ml-50">
        {children}
      </main>
    </div>
  );
}
