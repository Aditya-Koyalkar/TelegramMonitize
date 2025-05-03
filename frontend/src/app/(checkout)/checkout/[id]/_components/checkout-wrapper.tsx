"use client";

import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { findOneGroup } from "@/api/group";
import Checkout from "./checkout";
import { P } from "@/components/custom/P";
import { Loader2 } from "lucide-react";

type Props = {
  groupId: string;
  anonymousKey: string;
};

const CheckoutWrapper = ({ groupId, anonymousKey }: Props) => {
  const { getToken } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["getsingle-group", groupId],
    queryFn: async () => {
      const token = await getToken();
      return await findOneGroup(groupId, token || "");
    },
  });

  if (isLoading || !data) return <Loader2 className="animate-spin" />;

  const group = data.result;
  if (!group) return <P>{data.message}</P>;

  return <Checkout group={group} anonymousKey={anonymousKey} />;
};

export default CheckoutWrapper;
