import Payout from "./_components/payout";
import { redirect } from "next/navigation";
import PageHeader from "../../_components/PageHeader";
import { auth } from "@clerk/nextjs/server";
export const dynamic = "force-dynamic";

const PayoutPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }
  return (
    <>
      <PageHeader title="Payout" description="Manage your PayPal payout account and settings" />
      <Payout userId={userId} />
    </>
  );
};

export default PayoutPage;
