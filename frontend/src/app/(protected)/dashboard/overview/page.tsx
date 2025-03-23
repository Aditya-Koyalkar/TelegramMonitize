import getServerSession from "@/lib/better-auth/server-session";
import { redirect } from "next/navigation";
import Overview from "./_components/overview";

type Props = {};

const OverviewPage = async ({}: Props) => {
  const session = await getServerSession();
  if (!session) {
    return redirect("/sign-in");
  }
  return <Overview userId={session.user.id} />;
};

export default OverviewPage;
