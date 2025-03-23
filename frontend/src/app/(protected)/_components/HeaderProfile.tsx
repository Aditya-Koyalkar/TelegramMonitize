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
import { signOut, useSession } from "@/lib/better-auth/auth-client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { paragraphVariants } from "@/components/custom/P";
import { toast } from "sonner";

const HeaderProfile = () => {
  const session = useSession();
  const router = useRouter();
  const { isPending, data } = session;
  if (isPending) {
    return <Skeleton className="size-10 rounded-full" />;
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={data?.user?.image || ""} />
          <AvatarFallback>{(data?.user.name || "U").slice(0, 1)}</AvatarFallback>
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
        <DropdownMenuItem className="flex items-center justify-center gap-2 px-3 py-4">
          <RiClipboardFill />
          <span
            className={cn(
              paragraphVariants({
                size: "small",
                weight: "medium",
              })
            )}
            onClick={() => {
              navigator.clipboard
                .writeText(data?.user.id || "")
                .then(() => {
                  toast("Colpied!", {
                    description: "User Key copied",
                  });
                })
                .catch((err) => toast("Failed", { description: `${err}` }));
            }}
          >
            User Key
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center justify-center gap-2 px-3 py-4">
          <RiLogoutCircleFill />
          <span
            className={cn(
              paragraphVariants({
                size: "small",
                weight: "medium",
              })
            )}
            onClick={async () => {
              await signOut();

              router.push("/sign-in");
            }}
          >
            Logout
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeaderProfile;
