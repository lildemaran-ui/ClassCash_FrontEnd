import MenuEncar from "@/components/Menu/MenuEncar";

export function LayoutEncarregado({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex h-screen w-screen overflow-hidden bg-gray-50">
     <MenuEncar/>
      <div className="flex w-full h-full mx-auto overflow-y-auto p-3">
        {children}
    </div>
    </main>
  );
}
