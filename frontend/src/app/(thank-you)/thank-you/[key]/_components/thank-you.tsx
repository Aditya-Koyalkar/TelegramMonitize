"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Key, CreditCard, Inbox } from "lucide-react";
import { cn, generateThankYouPageData } from "@/lib/utils";
import socket from "@/lib/socket/config";
import { useQuery } from "@tanstack/react-query";
import { axiosBaseInstance } from "@/lib/axios/config";
import { ApiResponse, ThankYouResponse } from "@/@types/response";
import { RiLoader3Fill } from "@remixicon/react";
import { format } from "date-fns";
import useWebsocket from "@/hooks/use-websocket";
import { P } from "@/components/custom/P";

type OrderStatus = "created" | "paid";

const ThankYou = ({ anonymousKey }: { anonymousKey: string }) => {
  const [status, setStatus] = useState<OrderStatus>("created");

  useWebsocket(() => {
    socket.on("txn-paid", (info) => setStatus(info));
  }, anonymousKey);

  const {
    data: res,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["thank-you"],
    queryFn: async () => {
      try {
        const res = await axiosBaseInstance.get<ApiResponse<ThankYouResponse>>(`/order/${anonymousKey}`);

        const status = res.data.result.transaction?.status ?? "created";

        setStatus(status);

        return res.data;
      } catch (error) {
        throw error;
      }
    },
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <RiLoader3Fill className="animate-spin" />
      </div>
    );
  }

  if (!res?.result || error) {
    return (
      <div className="space-y-4">
        <P size="large" weight="bold">
          {error?.name}
        </P>
        <P size="medium" weight="medium">
          {error?.message}
        </P>
      </div>
    );
  }

  const { customer, transaction } = res.result;

  const currentStatus = generateThankYouPageData(status);

  return (
    <Card className="overflow-hidden border-0 shadow-lg">
      {/* Status Header */}
      <div className={cn("flex flex-col items-center text-center p-8 border-b", currentStatus?.bgColor, currentStatus?.borderColor)}>
        <currentStatus.icon className={cn("w-16 h-16 mb-4", currentStatus.color)} />
        <h1 className="text-2xl font-bold mb-2">{currentStatus.title}</h1>
        <p className="text-muted-foreground">{currentStatus.description}</p>
        {status === "paid" && (
          <div className="mt-4 flex items-center gap-2 text-sm bg-blue-50 text-blue-700 px-4 py-2 rounded-full border border-blue-100">
            <Inbox className="w-4 h-4" />
            <span>Check {customer?.email} for your license key</span>
          </div>
        )}
      </div>

      <div className="p-6 md:p-8">
        {/* Order Information */}
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Key className="w-5 h-5" /> License Details
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transaction Number</span>
                <span className="font-medium">{transaction?._id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">{transaction && format(transaction?.createdAt, "dd-MMM-yyyy")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium">{customer?.email}</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" /> Payment Summary
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${transaction?.price?.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${transaction?.price?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        {status === "paid" && (
          <div className="mt-8 p-6 bg-slate-50 rounded-lg border">
            <h3 className="font-semibold mb-4">Next Steps:</h3>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Check your email for the license key and joining instructions</li>
              <li>Follow the installation guide in your email to join group</li>
              <li>If you don&apos;t receive the email within 5 minutes, click &quot;Resend Email&quot;</li>
            </ol>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ThankYou;
