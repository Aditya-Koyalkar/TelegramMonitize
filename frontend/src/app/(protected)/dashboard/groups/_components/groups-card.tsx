"use client";

import { IGroup } from "@/@types/models";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ApiResponse } from "@/@types/response";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosDashboardInstance } from "@/lib/axios/config";
import { toast } from "sonner";
import { RiLoader3Fill } from "@remixicon/react";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { P } from "@/components/custom/P";

interface Props {
  group: IGroup;
}

function GroupCard({ group }: Props) {
  return (
    <>
      <Card className="border-none">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center justify-start gap-4">
              <Avatar className="size-12 rounded-full">
                <AvatarImage src="/telegram.png" />
                <AvatarFallback>{group.name.slice(0, 1)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold">{group.name}</h3>
              </div>
            </div>
            {/* <GroupMenu id={group._id} price={group.price} /> */}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-accent/50 p-4 space-y-3">
              <P variant="muted" size="small" weight="medium">
                Total Revenue
              </P>
              <P className="mt-1" size="large" weight="bold">
                ${group.revenue}
              </P>
            </div>
            <div className="rounded-lg bg-accent/50 p-4 space-y-3">
              <P variant="muted" size="small" weight="medium">
                Subscription Plan
              </P>
              <P className="mt-1" size="large" weight="bold">
                ${group.price}/month
              </P>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

const GroupCardWrapper = ({ userId }: { userId: string }) => {
  const queryClient = useQueryClient();

  const {
    data: res,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["groups"],
    queryFn: async () => (await axiosDashboardInstance.get<ApiResponse<IGroup[]>>("/groups")).data,
  });

  if (error) {
    toast("Error", {
      description: res?.message,
    });
  }

  const groups = res?.result;

  return (
    <>
      {isLoading && (
        <div className="w-full h-full flex items-center justify-center">
          <RiLoader3Fill className="animate-spin" />
        </div>
      )}

      {!isLoading && (
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {groups && groups.length > 0 && groups.map((group) => <GroupCard key={group.group_id} group={group} />)}
        </div>
      )}

      {/* Empty State */}
      {groups && groups.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
          <Users className="h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-sm font-medium">No groups yet</h3>
          <p className="mt-2 text-center text-sm text-gray-500">Add your first Telegram group to start managing subscriptions.</p>
          <Button className="mt-4 gap-2">
            <Users className="h-4 w-4" />
            Add New Group
          </Button>
        </div>
      )}
    </>
  );
};

export default GroupCardWrapper;
