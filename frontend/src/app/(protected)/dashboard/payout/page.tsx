import getServerSession from "@/lib/better-auth/server-session";
import Payout from "./_components/payout";
import { redirect } from "next/navigation";
import PageHeader from "../../_components/PageHeader";
export const dynamic = "force-dynamic";

const PayoutPage = async () => {
  const session = await getServerSession();

  if (!session) return redirect("/sign-in");
  return (
    <>
      <PageHeader title="Payout" description="Manage your PayPal payout account and settings" />
      <Payout userId={session.user.id} />
    </>
  );
};

export default PayoutPage;
