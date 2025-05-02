import { SERVER_DOMAIN } from "@/utils/env";
import axios from "axios";
import { cookies } from "next/headers";
const cookieHeader = (await cookies()).toString();

export const axiosBaseInstance = axios.create({
  baseURL: `${SERVER_DOMAIN}/api/v1`, // Backend server URL
  withCredentials: true, // To send cookies with requests
  headers: {
    Cookie: cookieHeader,
  },
});

export const axiosDashboardInstance = axios.create({
  baseURL: `${SERVER_DOMAIN}/api/v1/dashboard`, // Backend server URL
  withCredentials: true, // To send cookies with requests
  headers: {
    Cookie: cookieHeader,
  },
});
