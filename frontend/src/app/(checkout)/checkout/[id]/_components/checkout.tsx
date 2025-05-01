"use client";

import { IGroup } from "@/@types/models";
import usePaddle from "@/hooks/use-paddle";
import { APP_DOMAIN } from "@/utils/env";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  group: IGroup;
  anonymouskey: string;
};

const Checkout = ({ anonymouskey, group }: Props) => {
  const paddle = usePaddle();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    paddle?.Checkout.open({
      settings: {
        successUrl: `${APP_DOMAIN}/thank-you/${anonymouskey}`,
      },
      items: [
        {
          priceId: group.price_id,
          quantity: 1,
        },
      ],
      customData: {
        entityType: "subscription",
        anonymouskey,
        group: {
          id: group._id,
          owner: group.owner,
          entityType: "group",
          price: group.price,
          priceId: group.price_id,
        },
      },
    });
    setIsLoading(false);
  }, [paddle]);

  return <div className="w-screen h-screen flex items-center justify-center">{isLoading && <Loader2 className="animate-spin" />}</div>;
};

export default Checkout;
