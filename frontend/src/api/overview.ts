import { ApiResponse, OverviewResponse } from "@/@types/response";
import { axiosDashboardInstance } from "@/lib/axios/config";

export const getOverview = async (): Promise<ApiResponse<OverviewResponse | null>> => {
  try {
    const response = await axiosDashboardInstance.get("/overview");
    return response.data;
  } catch (err) {
    throw err;
  }
};
