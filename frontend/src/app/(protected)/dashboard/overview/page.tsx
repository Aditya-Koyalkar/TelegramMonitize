import { redirect } from "next/navigation";
import Overview from "./_components/overview";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

const OverviewPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }
  return <Overview userId={userId} />;
};

export default OverviewPage;
