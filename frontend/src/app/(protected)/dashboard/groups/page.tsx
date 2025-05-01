import getServerSession from "@/lib/better-auth/server-session";
import { redirect } from "next/navigation";
import PageHeader from "../../_components/PageHeader";
import GroupCardWrapper from "./_components/groups-card";

export const dynamic = "force-dynamic";

const GroupsPage = async () => {
  const session = await getServerSession();

  if (!session) return redirect("/sign-in");

  return (
    <>
      {/* Header */}
      <PageHeader title="Telegram Groups" description="Manage your registered Telegram groups" />

      <GroupCardWrapper userId={session.user.id} />
    </>
  );
};

export default GroupsPage;
