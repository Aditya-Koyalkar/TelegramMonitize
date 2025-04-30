import { ApiResponse } from "@/@types/response";
import { cookies } from "next/headers";
import { IGroup } from "@/@types/models";
import { axiosBaseInstance, axiosDashboardInstance } from "@/lib/axios/config";
import { parseError } from "@/lib/utils";

export const getGroups = async (): Promise<ApiResponse<IGroup[]>> => {
  const cookieHeader = (await cookies()).toString();

  try {
    const res = await axiosDashboardInstance.get<ApiResponse<IGroup[]>>("/groups", {
      headers: {
        Cookie: cookieHeader,
      },
    });

    return res.data;
  } catch (error) {
    console.log("Error in groups route: ", error);
    const err = parseError(error);

    return {
      success: false,
      message: err,
      result: [],
    };
  }
};

export const findOneGroup = async (id: string): Promise<ApiResponse<IGroup | null>> => {
  const cookieHeader = (await cookies()).toString();

  try {
    const res = await axiosBaseInstance.get<ApiResponse<IGroup>>(`/groups/${id}`, {
      headers: {
        Cookie: cookieHeader,
      },
    });

    return res.data;
  } catch (error) {
    console.log("Error in single groups route: ", error);
    const err = parseError(error);

    return {
      success: false,
      message: err,
      result: null,
    };
  }
};
