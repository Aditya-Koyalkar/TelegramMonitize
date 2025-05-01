"use client";

import { useEffect, useState } from "react";
import { Paddle, initializePaddle } from "@paddle/paddle-js";
import { NEXT_PUBLIC_PADDLE_CLIENT_TOKEN } from "@/utils/env";
import { toast } from "sonner";

function usePaddle() {
  const [paddle, setPaddle] = useState<Paddle>();

  useEffect(() => {
    async function initiatePaddle() {
      if (paddle?.Initialize) {
        return;
      }
      try {
        const paddleInstance = await initializePaddle({
          environment: "sandbox",
          token: NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
          eventCallback: (data) => {
            console.log(data);
          },
          checkout: {
            settings: {
              displayMode: "overlay",
              theme: "light",
              locale: "en",
            },
          },
        });
        if (paddleInstance) {
          setPaddle(paddleInstance);
        }
      } catch (e) {
        console.log(e);
        toast("Error in initializing");
      }
    }
    initiatePaddle();
  }, []);
  return paddle;
}

export default usePaddle;
