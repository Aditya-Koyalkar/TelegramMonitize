import getServerSession from "@/lib/better-auth/server-session";

export default async function Page() {
  const session = await getServerSession();
  return <></>;
}
