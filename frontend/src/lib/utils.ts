import { AxiosError } from "axios";
import { clsx, type ClassValue } from "clsx";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseError(error: unknown) {
  if (error instanceof Error) return error.message;

  if (error instanceof Response) return error.statusText;

  if (error instanceof ErrorEvent) return error.message;

  if (error instanceof AxiosError) return error.response?.data?.message || error.message;

  if (typeof error === "string") return error;

  return JSON.stringify(error);
}
export function generateThankYouPageData(status: "paid" | "created") {
  const statusConfig = {
    paid: {
      icon: CheckCircle2,
      title: "Thank You for Your Purchase!",
      description: "We've sent your license key and download joining to your email.",
      color: "text-green-600",
      bgColor: "bg-green-50/50",
      borderColor: "border-green-100",
    },
    created: {
      icon: Clock,
      title: "Payment Processing",
      description: "Please wait while we confirm your payment.",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50/50",
      borderColor: "border-yellow-100",
    },
    failed: {
      icon: XCircle,
      title: "Payment Failed",
      description: "There was an issue processing your payment. Please try again.",
      color: "text-red-600",
      bgColor: "bg-red-50/50",
      borderColor: "border-red-100",
    },
  };

  return statusConfig[status];
}
