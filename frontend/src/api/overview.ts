import { ApiResponse, OverviewResponse } from "@/@types/response";
import { axiosDashboardInstance } from "@/lib/axios/config";
import { useAuth } from "@clerk/nextjs";

export const getOverview = async (token: string): Promise<ApiResponse<OverviewResponse | null>> => {
  try {
    const response = await axiosDashboardInstance.get("/overview", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err) {
    throw err;
  }
};
