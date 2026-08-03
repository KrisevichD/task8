import { Sidebar } from "@/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background text-foreground max-lg:flex-col-reverse max-lg:h-screen max-lg:overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto max-lg:h-[calc(100vh-60px)]">
        {children}
      </main>
    </div>
  );
}
