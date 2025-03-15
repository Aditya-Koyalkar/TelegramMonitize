import { axiosBaseInstance } from "../axios/config";
import { UserWithSession } from "./auth-types";

const getServerSession = async (): Promise<UserWithSession | null> => {
  try {
    const res = await axiosBaseInstance.get("/user/session", {});
    return res.data;
  } catch (e) {
    console.log("ERROR :: " + e);
    return null;
  }
};

export default getServerSession;
