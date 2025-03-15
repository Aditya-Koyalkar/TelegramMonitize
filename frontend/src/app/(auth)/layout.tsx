import { P } from "@/components/custom/P";
import { cn } from "@/lib/utils";
import React from "react";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <main className="flex items-center justify-center w-full h-screen">
      <div className="flex-1 w-full h-full bg-primary md:flex items-center justify-center p-6 hidden">
        <div>
          <h1 className={cn("text-white tracking-wider")}>Group Gains</h1>
          <P className="text-white">The only platform that is able monetize your telegram group.</P>
        </div>
      </div>

      <div className="flex-1 w-full h-full flex items-center justify-center p-4">{children}</div>
    </main>
  );
};

export default Layout;
