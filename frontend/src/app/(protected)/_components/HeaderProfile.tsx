"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RiClipboardFill, RiLogoutCircleFill } from "@remixicon/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { paragraphVariants } from "@/components/custom/P";
import { toast } from "sonner";
import { SignOutButton, useUser } from "@clerk/nextjs";

const HeaderProfile = () => {
  const session = useUser();
  const router = useRouter();
  const { isLoaded, user } = session;
  if (!isLoaded || !user) {
    return <Skeleton className="size-10 rounded-full" />;
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user?.imageUrl || ""} />
          <AvatarFallback>{(user?.firstName || "U").slice(0, 1)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel
          className={cn(
            paragraphVariants({
              size: "medium",
              weight: "bold",
            })
          )}
        >
          My Account
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            navigator.clipboard
              .writeText(user.id || "")
              .then(() => {
                toast("Colpied!", {
                  description: "User Key copied",
                });
              })
              .catch((err) => toast("Failed", { description: `${err}` }));
          }}
          className="flex items-center justify-center gap-2 px-3 py-4"
        >
          <RiClipboardFill />
          <span
            className={cn(
              paragraphVariants({
                size: "small",
                weight: "medium",
              })
            )}
          >
            User Key
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center justify-center gap-2 px-3 py-4">
          <RiLogoutCircleFill />
          <SignOutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeaderProfile;
