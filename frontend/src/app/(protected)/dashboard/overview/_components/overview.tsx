"use client";
import { getOverview } from "@/api/overview";
import { useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import OverviewProfile from "./overview-profile";
import { toast } from "sonner";
import OverviewStats from "./overview-stats";
import { ApiResponse, OverviewResponse } from "@/@types/response";
import CustomersTable from "./customers-table";
import useWebsocket from "@/hooks/use-websocket";
import socket from "@/lib/socket/config";
import { useAuth } from "@clerk/nextjs";

export type QueryRes = UseQueryResult<ApiResponse<OverviewResponse | null>, Error>;

const Overview = ({ userId }: { userId: string }) => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  const query = useQuery({
    queryKey: ["overview"],
    queryFn: async () => {
      const token = await getToken();
      return getOverview(token || "");
    },
  });
  if (query.error) {
    toast("Error", {
      description: "Error fetching data! please refresh.",
    });
  }

  useWebsocket(() => {
    socket.on("update-overview", () => {
      queryClient.invalidateQueries({ queryKey: ["overview"] });
    });
  }, userId);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <OverviewProfile />

        {/* Stats Overview */}
        <OverviewStats query={query} />

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {/* Customers Section */}
          <CustomersTable query={query} />

          {/* Transactions Section */}
          {/* <TransactionTable query={query} /> */}
        </div>
      </div>
    </div>
  );
};

export default Overview;
