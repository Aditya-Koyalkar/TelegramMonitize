"use client";

import { IPayout } from "@/@types/models";
import { ApiResponse } from "@/@types/response";
import { P } from "@/components/custom/P";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useWebsocket from "@/hooks/use-websocket";
import { axiosDashboardInstance } from "@/lib/axios/config";
import socket from "@/lib/socket/config";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { HandCoins } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const PayoutHistory = ({ userId }: { userId: string }) => {
  const queryClient = useQueryClient();

  const {
    data: payouts,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["payouts"],
    queryFn: async () => {
      const res = await axiosDashboardInstance.get<ApiResponse<IPayout[]>>("/payout-history");

      return res.data.result;
    },
  });

  useWebsocket(() => {
    socket.on("update-payout", () => {
      queryClient.invalidateQueries({ queryKey: ["payouts"] });
    });
  }, userId);

  if (error) {
    toast(error.name, {
      description: error.message,
    });
  }
  return (
    <Card className="border-none">
      <CardContent className="p-6">
        <div className="mb-4 space-y-1">
          <h2 className="text-xl font-semibold">Payout history</h2>
          <P variant="muted" size="small">
            Payouts can take 1-5 days to appear in your bank account. If you still need assistance,{" "}
            <Link href="#" className="text-blue-500 hover:underline">
              Read more about payouts
            </Link>
            .
          </P>
        </div>

        {isLoading && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="w-full h-12 rounded-md" />
            ))}
          </div>
        )}

        {payouts?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-gray-100 p-3">
              <HandCoins className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="mt-4 text-sm font-medium">No payout yet</h3>
            <P size="small" weight="medium" variant="muted" className="mt-2 text-center">
              Your recent payouts will appear here.
            </P>
          </div>
        )}

        {!isLoading && payouts && payouts.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-medium uppercase text-gray-500">Date</TableHead>
                <TableHead className="text-xs font-medium uppercase text-gray-500">Amount</TableHead>
                <TableHead className="text-xs font-medium uppercase text-gray-500">Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {payouts.map((payout) => (
                <TableRow key={payout._id} className="hover:bg-transparent">
                  <TableCell className="py-4 text-sm text-gray-600">{format(payout.createdAt, "dd-MMM-yyyy")}</TableCell>
                  <TableCell className="py-4 text-sm font-medium">${payout.amount}</TableCell>
                  <TableCell className="py-4">
                    <span className="text-xs font-medium text-gray-400">{payout.status}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default PayoutHistory;
