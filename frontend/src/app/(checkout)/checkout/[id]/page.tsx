import { randomBytes } from "crypto";
import CheckoutWrapper from "./_components/checkout-wrapper";

type Props = {
  params: Promise<{ id: string }>;
};

const Page = async ({ params }: Props) => {
  const anonymousKey = randomBytes(10).toString("hex");
  const groupId = (await params).id;

  return <CheckoutWrapper groupId={groupId} anonymousKey={anonymousKey} />;
};

export default Page;
