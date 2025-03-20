import { cookies } from "next/headers";
import { axiosBaseInstance } from "../axios/config";
import { UserWithSession } from "./auth-types";

const getServerSession = async (): Promise<UserWithSession | null> => {
  try {
    const cookieHeader = (await cookies()).toString();

    const res = await axiosBaseInstance.get("/user/session", {
      headers: {
        Cookie: cookieHeader,
      },
    });
    return res.data;
  } catch (e) {
    console.log("ERROR :: " + e);
    return null;
  }
};

export default getServerSession;
