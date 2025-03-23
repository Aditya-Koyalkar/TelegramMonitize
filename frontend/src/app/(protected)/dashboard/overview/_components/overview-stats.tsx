"use client";

import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { P } from "@/components/custom/P";
import { UseQueryResult } from "@tanstack/react-query";
import { OverviewResponse } from "@/@types/response";
import { QueryRes } from "./overview";

const OverviewStats = ({ query }: { query: QueryRes }) => {
  const { data: res, isLoading, error } = query;

  let earnings = res?.result?.earnings;
  let totalCustomers = res?.result?.totalCustomers;
  let totalTransactions = res?.result?.totalTransactions;

  if (error) {
    earnings = 0;
    totalCustomers = 0;
    totalTransactions = 0;
  }
  return (
    <Card className="border-none">
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Earnings</h2>
          <div className="mt-2 flex items-baseline gap-2">
            {!isLoading ? (
              <P weight="bold" className="text-4xl">
                ${earnings}
              </P>
            ) : (
              <Skeleton className="size-11 rounded-sm" />
            )}
            <P size="small" variant="muted">
              Last 30 days
            </P>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-4 bg-accent/50 p-5 rounded-md">
            <div className="rounded-full bg-orange-100 p-2 sm:p-4">
              <Users className="size-3 sm:size-5 text-orange-600" />
            </div>
            <div>
              {!isLoading ? (
                <P weight="medium" size="large">
                  {totalCustomers}
                </P>
              ) : (
                <Skeleton className="size-8 rounded-sm" />
              )}
              <P variant="muted" size="small">
                Customers
              </P>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-accent/50 p-5 rounded-md">
            <div className="rounded-full bg-blue-100 p-2 sm:p-4">
              <DollarSign className="size-3 sm:size-5 text-blue-600" />
            </div>
            <div>
              {!isLoading ? (
                <P weight="medium" size="large">
                  {totalTransactions}
                </P>
              ) : (
                <Skeleton className="size-8 rounded-sm" />
              )}
              <P variant="muted" size="small">
                Transaction
              </P>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OverviewStats;
