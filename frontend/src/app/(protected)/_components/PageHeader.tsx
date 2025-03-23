import { P } from "@/components/custom/P";

const PageHeader = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold">{title}</h1>
      <P>{description}</P>
    </div>
  );
};

export default PageHeader;
