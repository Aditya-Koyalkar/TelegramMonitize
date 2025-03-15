import { SERVER_DOMAIN } from "@/utils/env";
import axios from "axios";

export const axiosBaseInstance = axios.create({
  baseURL: `${SERVER_DOMAIN}/api/v1`, // Backend server URL
  withCredentials: true, // To send cookies with requests
});

export const axiosDashboardInstance = axios.create({
  baseURL: `${SERVER_DOMAIN}/api/v1/dashboard`, // Backend server URL
  withCredentials: true, // To send cookies with requests
});
