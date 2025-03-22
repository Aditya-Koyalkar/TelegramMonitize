import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import { AppSidebar } from "./_components/Sidebar";
import DashboardHeader from "./_components/Header";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <main>
      <SidebarProvider>
        <AppSidebar />
        <div className="w-full px-5">
          <DashboardHeader />
          <div className="w-full min-h-[calc(100vh-80px)] rounded-lg p-5 space-y-8 bg-primary/5">{children}</div>
        </div>
      </SidebarProvider>
    </main>
  );
};

export default Layout;
