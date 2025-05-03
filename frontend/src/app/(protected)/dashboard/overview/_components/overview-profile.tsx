"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "../../../_components/PageHeader";
import { useUser } from "@clerk/nextjs";

const OverviewProfile = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  return (
    <>
      {!isLoaded ||
        !isSignedIn ||
        (!user && (
          <div className="flex items-center gap-4">
            <Skeleton className="size-20 rounded-full" />
            <div className="space-y-3">
              <Skeleton className="h-12 w-64 rounded-md " />
              <Skeleton className="h-4 w-40 rounded-md " />
            </div>
          </div>
        ))}

      {isLoaded && (
        <div className="flex items-center gap-4">
          <Avatar className="size-20 rounded-full">
            <AvatarImage src={user?.imageUrl || "https://github.com/shadcn.png"} />
            <AvatarFallback>
              <Skeleton className="size-10 rounded-full" />
            </AvatarFallback>
          </Avatar>
          <PageHeader title={`Hii, ${user?.fullName}`} description={`${user?.emailAddresses[0].emailAddress}`} />
        </div>
      )}
    </>
  );
};

export default OverviewProfile;
