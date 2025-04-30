"use client";

import { IPayout, IWallet } from "@/@types/models";
import { ApiResponse } from "@/@types/response";
import { P } from "@/components/custom/P";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import useWebsocket from "@/hooks/use-websocket";
import { axiosDashboardInstance } from "@/lib/axios/config";
import socket from "@/lib/socket/config";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiLoader3Fill, RiMoneyDollarCircleFill } from "@remixicon/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const BalanceCard = ({ userId }: { userId: string }) => {
  const [isPayoutDialogOpen, setIsPayoutDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: wallet,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["wallet"],
    queryFn: async () => {
      const res = await axiosDashboardInstance.get<ApiResponse<IWallet>>("/wallet");

      return res.data.result;
    },
  });

  if (error) {
    toast(error.name, {
      description: error.message,
    });
  }

  useWebsocket(() => {
    socket.on("update-wallet", () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
    });

    socket.on("update-overview", () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
    });
  }, userId);

  return (
    <>
      <Card className="border-none">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-sm font-medium uppercase text-gray-500">OUTSTANDING BALANCE</h2>
              {isLoading && <Skeleton className="w-14 h-12" />}
              {!isLoading && (
                <P weight="bold" className="text-4xl">
                  {!wallet ? "error" : `$${wallet.balance}`}
                </P>
              )}
            </div>
            <div className="flex gap-2">
              <Button disabled={isLoading} variant="default" onClick={() => setIsPayoutDialogOpen(true)}>
                Withdraw
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <IntegrationGroupForm isPayoutDialogOpen={isPayoutDialogOpen} setIsPayoutDialogOpen={setIsPayoutDialogOpen} />
    </>
  );
};

export const payoutFormSchema = z.object({
  amount: z.string().trim(),
});

export type TPayoutGroupForm = z.infer<typeof payoutFormSchema>;

export const IntegrationGroupForm = ({
  isPayoutDialogOpen,
  setIsPayoutDialogOpen,
}: {
  isPayoutDialogOpen: boolean;
  setIsPayoutDialogOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const form = useForm<TPayoutGroupForm>({
    resolver: zodResolver(payoutFormSchema),
    defaultValues: {
      amount: "",
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (values: TPayoutGroupForm) => (await axiosDashboardInstance.post<ApiResponse<IPayout>>("/paypal/payout", values)).data,
    onSuccess: (res) => {
      toast("Payout Requested", {
        description: res.message,
      });
    },
    onError: (err) => {
      toast(err.name, {
        description: err.message,
      });
    },
    onSettled: () => {
      setIsPayoutDialogOpen(false);
    },
  });

  return (
    <Dialog open={isPayoutDialogOpen} onOpenChange={setIsPayoutDialogOpen}>
      <DialogContent>
        <DialogHeader className="hidden">
          <DialogTitle>title</DialogTitle>
          <DialogDescription>description</DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((values) => mutateAsync(values))} className="space-y-8">
              {/* Email */}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter Amount</FormLabel>
                    <FormControl>
                      <div className="flex items-center justify-start gap-3 border rounded-2xl px-3 py-2">
                        <RiMoneyDollarCircleFill />
                        <Input type="number" className={cn("input")} placeholder="payout amount here..." {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      Currency: <b>USD</b>
                    </FormDescription>
                  </FormItem>
                )}
              />
              <Button disabled={isPending} type="submit" variant="lift">
                {!isPending ? "Withdraw" : <RiLoader3Fill className="animate-spin" />}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BalanceCard;
