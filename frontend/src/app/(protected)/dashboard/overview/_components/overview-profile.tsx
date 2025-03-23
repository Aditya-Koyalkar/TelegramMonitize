"use client";

import PageHeader from "@/app/(protected)/_components/PageHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/lib/better-auth/auth-client";

const OverviewProfile = () => {
  const { data, isPending } = useSession();

  return (
    <>
      {isPending && (
        <div className="flex items-center gap-4">
          <Skeleton className="size-20 rounded-full" />
          <div className="space-y-3">
            <Skeleton className="h-12 w-64 rounded-md " />
            <Skeleton className="h-4 w-40 rounded-md " />
          </div>
        </div>
      )}

      {!isPending && (
        <div className="flex items-center gap-4">
          <Avatar className="size-20 rounded-full">
            <AvatarImage src={data?.user?.image || "https://github.com/shadcn.png"} />
            <AvatarFallback>
              <Skeleton className="size-10 rounded-full" />
            </AvatarFallback>
          </Avatar>
          <PageHeader title={`Hii, ${data?.user.name}`} description={`${data?.user.email}`} />
        </div>
      )}
    </>
  );
};

export default OverviewProfile;
