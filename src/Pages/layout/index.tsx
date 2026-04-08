import MenuEstud from "@/components/Menu/MenuEstud";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex h-screen overflow-hidden bg-gray-50">
      <MenuEstud />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden custom_scroll">
        {children}
      </div>
    </main>
  );
}