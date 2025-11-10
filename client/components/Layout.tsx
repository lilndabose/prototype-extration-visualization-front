import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Animated background pattern */}
      <div className="bg-pattern" />

      <Sidebar />

      {/* Main content */}
      <main className="lg:ml-60 pt-16 lg:pt-0 p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
