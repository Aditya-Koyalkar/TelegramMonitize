import axios from "axios";

export const paypalV2AxiosInstance = axios.create({
  baseURL: "https://api-m.sandbox.paypal.com/v2",
});

export const paypalV1AxiosInstance = axios.create({
  baseURL: "https://api-m.sandbox.paypal.com/v1",
});
