import MenuEstud from "@/components/Menu/MenuEstud";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex h-screen w-screen overflow-hidden bg-gray-50">
      <MenuEstud />
      <div className="flex-1 min-w-0 h-full overflow-y-auto p-3">
        {children}
      </div>
    </main>
  );
}