import { ICustomer, ITransaction } from "./models";

export interface ApiResponse<T> {
  success: boolean;
  error?: string;
  message: string;
  result: T;
}

export interface PayPalLink {
  href: string;
  rel: string;
  method: string;
  description: string;
}

export interface PayPalPartnerResponse {
  links: PayPalLink[];
}

export type PaypalPartnerApiResponse = ApiResponse<PayPalPartnerResponse>;

export interface OverviewResponse {
  earnings: number;
  totalCustomers: number;
  customerDetails: ICustomer[];
  totalTransactions: number;
  transactionDetails: ITransaction[];
}

export interface ThankYouResponse {
  customer: ICustomer;
  transaction: ITransaction;
}
