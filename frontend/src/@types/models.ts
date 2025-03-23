export interface IGroup {
  _id: string;
  group_id: string; // Use snake_case here
  name: string;
  price_id: string;
  revenue: number;
  price: number;
  owner: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICustomer {
  _id: string;
  name: string;
  anonymous_key: string;
  email: string;
  subscription: string;
  owner: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITransaction {
  _id: string;
  status: "paid" | "created";
  anonymous_key: string;
  currency_code: string;
  of_group: string;
  price: number;
  subscription: string;
  owner: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IIntegration {
  _id: string;
  owner: string;
  paypal: {
    email: string;
    currency: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IWallet {
  _id: string;
  owner: string;
  balance: number;
  withdraw: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPayout {
  _id: string;
  owner: string;
  amount: number;
  paypal: {
    payout_id: string;
  };
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
