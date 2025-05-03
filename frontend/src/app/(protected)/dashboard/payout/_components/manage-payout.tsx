"use client";

import { IIntegration } from "@/@types/models";
import { ApiResponse } from "@/@types/response";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { axiosDashboardInstance } from "@/lib/axios/config";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiLoader3Fill, RiMailFill } from "@remixicon/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BadgeCheck } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const ManagePayout = () => {
  const [isIntegrationDialogOpen, setIsIntegrationDialogOpen] = useState(false);
  const { getToken } = useAuth();
  const {
    data: res,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["connection"],
    queryFn: async () => {
      const token = await getToken();
      return (
        await axiosDashboardInstance.get<ApiResponse<IIntegration>>("/paypal/connect", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      ).data;
    },
  });

  const result = res?.result;

  return (
    <>
      <Card className="border-none bg-[#FFFDF4]">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 items-center justify-center rounded-full bg-[#7C3AED] hidden sm:flex">
              <BadgeCheck className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm text-gray-700 flex items-center justify-start gap-3">
              Connected to payout account{" "}
              {isLoading ? (
                <Skeleton className="h-4 w-44 inline-block" />
              ) : error ? (
                "error"
              ) : !result ? (
                "not connected. Please connect"
              ) : (
                result.paypal.email
              )}
            </span>
          </div>
          <Button
            variant="default"
            className="bg-[#FFD600] text-black hover:bg-[#FFD600]/90"
            disabled={isLoading}
            onClick={() => setIsIntegrationDialogOpen(true)}
          >
            Manage payouts
          </Button>
        </CardContent>
      </Card>

      <IntegrationGroupForm
        isIntegrationDialogOpen={isIntegrationDialogOpen}
        setIsIntegrationDialogOpen={setIsIntegrationDialogOpen}
        integration={result}
      />
    </>
  );
};

export const integrationFormSchema = z.object({
  email: z.string().email().trim(),
});

export type TIntegrationGroupForm = z.infer<typeof integrationFormSchema>;

export const IntegrationGroupForm = ({
  isIntegrationDialogOpen,
  setIsIntegrationDialogOpen,
  integration,
}: {
  isIntegrationDialogOpen: boolean;
  setIsIntegrationDialogOpen: Dispatch<SetStateAction<boolean>>;
  integration: IIntegration | undefined;
}) => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  const form = useForm<TIntegrationGroupForm>({
    resolver: zodResolver(integrationFormSchema),
    defaultValues: {
      email: integration?.paypal.email || "",
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["groups"],
    mutationFn: async (values: TIntegrationGroupForm) => {
      const token = await getToken();
      return (
        await axiosDashboardInstance.post<ApiResponse<IIntegration>>("/paypal/connect", values, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      ).data;
    },
    onSuccess: (res) => {
      queryClient.setQueryData(["connection"], (oldData: ApiResponse<IIntegration>) => {
        const newIntegration = res.result;

        const updatedData = { ...oldData, result: newIntegration };

        return updatedData;
      });

      toast("Updated", {
        description: res.message,
      });
    },
    onError: (err) => {
      toast(err.name, {
        description: err.message,
      });
    },
    onSettled: () => {
      setIsIntegrationDialogOpen(false);
    },
  });

  return (
    <Dialog open={isIntegrationDialogOpen} onOpenChange={setIsIntegrationDialogOpen}>
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter Paypal email</FormLabel>
                    <FormControl>
                      <div className="flex items-center justify-start gap-3 border rounded-2xl px-3 py-2">
                        <RiMailFill />
                        <Input className={cn("input")} placeholder="paypal email here..." {...field} />
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
                {!isPending ? "Add" : <RiLoader3Fill className="animate-spin" />}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManagePayout;
