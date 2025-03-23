"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Heart } from "lucide-react";
import { QueryRes } from "./overview";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { P } from "@/components/custom/P";

const CustomersTable = ({ query }: { query: QueryRes }) => {
  const { data: res, isLoading, error } = query;

  let customers = res?.result?.customerDetails;

  if (error) {
    customers = [];
  }
  return (
    <Card className="border-none">
      <CardContent className="p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Recent Customers</h2>
        </div>
        {isLoading && (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="w-full h-12 rounded-md" />
            ))}
          </div>
        )}
        {customers?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-gray-100 p-3">
              <Heart className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="mt-4 text-sm font-medium">No customers yet</h3>
            <P size="small" weight="medium" variant="muted" className="mt-2 text-center">
              Share your page with your audience to get started.
            </P>
          </div>
        ) : (
          <>
            {!isLoading && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers &&
                    customers.map((customer) => (
                      <TableRow key={customer._id}>
                        <TableCell className="font-medium">{customer.email}</TableCell>
                        <TableCell>{format(customer.createdAt, "dd-MMM-yyyy")}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomersTable;
