import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      {" "}
      <Loader2 className="animate-spin" />
    </div>
  );
};

export default Loading;
