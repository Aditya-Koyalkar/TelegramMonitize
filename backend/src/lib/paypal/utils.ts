import { paypalV1AxiosInstance } from "../axios/config.js";
import { PAYPAL_CLIENT_ID, PAYPAL_SECRET_KEY } from "../env.js";

export async function generatePaypalAccessToken(): Promise<string> {
  const res = await paypalV1AxiosInstance.post(
    "/oauth2/token",
    { grant_type: "client_credentials" },
    {
      auth: {
        username: PAYPAL_CLIENT_ID,
        password: PAYPAL_SECRET_KEY,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return res.data.access_token;
}
