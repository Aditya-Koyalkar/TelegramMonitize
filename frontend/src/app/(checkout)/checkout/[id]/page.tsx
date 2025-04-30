import { findOneGroup } from "@/api/group";
import { randomBytes } from "crypto";
import Checkout from "./_components/checkout";
import { P } from "@/components/custom/P";

type Props = {
  params: Promise<{ id: string }>;
};

const page = async ({ params }: Props) => {
  const groupId = (await params).id;
  const anonymouseKey = randomBytes(10).toString("hex");

  const response = await findOneGroup(groupId);
  const group = response.result;
  if (!group) {
    return <P>{response.message}</P>;
  }
  return <Checkout group={group} anonymouskey={anonymouseKey} />;
};

export default page;
