import { ApiResponse } from "@/@types/response";
import { IGroup } from "@/@types/models";
import { axiosBaseInstance, axiosDashboardInstance } from "@/lib/axios/config";
import { parseError } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";

export const getGroups = async (token: string): Promise<ApiResponse<IGroup[]>> => {
  try {
    const res = await axiosDashboardInstance.get<ApiResponse<IGroup[]>>("/groups", {
      headers: {
        Authorization: `Bearer ${token}`,
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

export const findOneGroup = async (id: string, token: string): Promise<ApiResponse<IGroup | null>> => {
  try {
    const res = await axiosBaseInstance.get<ApiResponse<IGroup>>(`/groups/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
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
