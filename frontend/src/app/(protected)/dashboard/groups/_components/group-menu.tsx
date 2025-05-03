"use client";

import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { cn } from "@/lib/utils";
import { RiDeleteBin7Fill, RiLoader3Fill, RiMoneyDollarCircleFill, RiShareFill } from "@remixicon/react";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { axiosDashboardInstance } from "@/lib/axios/config";
import { ApiResponse } from "@/@types/response";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IGroup } from "@/@types/models";
import { MenuIcon } from "lucide-react";
import { paragraphVariants } from "@/components/custom/P";
import { APP_DOMAIN } from "@/utils/env";
import { useAuth } from "@clerk/nextjs";

const GroupMenu = ({ id, price }: { id: string; price: number }) => {
  const [isPriceDialogOpen, setIsPriceDialogOpen] = React.useState(false);
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["groups"],
    mutationFn: async () => {
      const res = await axiosDashboardInstance.delete<ApiResponse<string>>(`/groups/${id}`);

      return res.data;
    },
    onSuccess: (res) => {
      queryClient.setQueryData(["groups"], (oldData: ApiResponse<IGroup[]>) => {
        const allGroups = oldData.result;

        const filteredGroups = allGroups.filter((_) => res.result != _._id);

        const newData = {
          ...oldData,
          result: filteredGroups,
        };

        return newData;
      });
    },
    onError: (err) => {
      toast(err.name, {
        description: err.message,
      });
    },
  });

  return (
    <>
      <DropdownMenu>
        {!isPending ? (
          <DropdownMenuTrigger className="hover:bg-accent rounded-md p-2">
            <MenuIcon />
          </DropdownMenuTrigger>
        ) : (
          <RiLoader3Fill className="animate-spin" />
        )}
        <DropdownMenuContent className="px-2">
          <DropdownMenuLabel className={cn(paragraphVariants({ size: "medium", weight: "bold" }))}>Action</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex items-center justify-start gap-2 px-3 py-4"
            onClick={() =>
              navigator.clipboard
                .writeText(`${APP_DOMAIN}/checkout/${id}`)
                .then(() =>
                  toast("Copied!", {
                    description: "Group checkout url is copied",
                  })
                )
                .catch((err) => toast("Failed!", { description: `${err}` }))
            }
          >
            <RiShareFill />

            <span className={cn(paragraphVariants({ size: "small", weight: "medium" }))}>Share</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center justify-start gap-2 px-3 py-4" onClick={() => setIsPriceDialogOpen(true)}>
            <RiMoneyDollarCircleFill />

            <span className={cn(paragraphVariants({ size: "small", weight: "medium" }))}>Add Pricing</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center justify-start gap-2 px-3 py-4" onClick={() => mutateAsync()}>
            <RiDeleteBin7Fill />

            <span className={cn(paragraphVariants({ size: "small", weight: "medium" }))}>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <PriceGroupForm id={id} price={price} isPriceDialogOpen={isPriceDialogOpen} setIsPriceDialogOpen={setIsPriceDialogOpen} />
    </>
  );
};

const pricingFormSchema = z.object({
  price: z.string().min(1, "Price is required").trim(),
  id: z.string().trim(),
});

export type TPriceGroupForm = z.infer<typeof pricingFormSchema>;

export const PriceGroupForm = ({
  id,
  price,
  isPriceDialogOpen,
  setIsPriceDialogOpen,
}: {
  id: string;
  price: number;
  isPriceDialogOpen: boolean;
  setIsPriceDialogOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  const form = useForm<TPriceGroupForm>({
    resolver: zodResolver(pricingFormSchema),
    defaultValues: {
      price: price?.toString() || "",
      id,
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["groups"],
    mutationFn: async (values: TPriceGroupForm) => {
      const token = await getToken();
      return (
        await axiosDashboardInstance.post<ApiResponse<IGroup>>(
          "/groups",
          {
            body: values,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
      ).data;
    },
    onSuccess: (res) => {
      queryClient.setQueryData(["groups"], (oldData: ApiResponse<IGroup[]>) => {
        const oldGroups = oldData.result;
        const newGroup = res.result;

        const updatedGroup = oldGroups.map((oldGroup) => (oldGroup._id === newGroup?._id ? newGroup : oldGroup));
        console.log(newGroup);
        const updatedData = { ...oldData, result: [...updatedGroup] };
        console.log(updatedData);
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
      setIsPriceDialogOpen(false);
    },
  });

  return (
    <Dialog open={isPriceDialogOpen} onOpenChange={setIsPriceDialogOpen}>
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
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Add Price</FormLabel>
                    <FormControl>
                      <div className="flex items-center justify-start gap-3 border rounded-2xl px-3 py-2">
                        <RiMoneyDollarCircleFill />
                        <Input type="number" className={cn("input")} placeholder="new name here..." {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
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

export default GroupMenu;
