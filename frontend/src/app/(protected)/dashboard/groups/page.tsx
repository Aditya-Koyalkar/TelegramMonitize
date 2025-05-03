import { redirect } from "next/navigation";
import PageHeader from "../../_components/PageHeader";
import GroupCardWrapper from "./_components/groups-card";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

const GroupsPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }
  return (
    <>
      {/* Header */}
      <PageHeader title="Telegram Groups" description="Manage your registered Telegram groups" />

      <GroupCardWrapper userId={userId} />
    </>
  );
};

export default GroupsPage;
