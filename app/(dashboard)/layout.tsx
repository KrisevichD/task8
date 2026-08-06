import { Sidebar } from "@/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar />
      <main className="ml-0 lg:ml-50 mb-15 lg:mb-10 min-h-screen flex flex-col">
        {children}
      </main>
    </>
  );
}
