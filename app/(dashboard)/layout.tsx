import { Sidebar } from "@/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground max-lg:flex-col-reverse">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden max-lg:h-[calc(100vh-60px)]">
        {children}
      </main>
    </div>
  );
}
