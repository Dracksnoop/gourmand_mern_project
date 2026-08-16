// Accounts created by `npm run seed`. They exist so anyone can look around the
// deployed app without registering: the free Mailtrap tier only delivers to the
// address the account is registered under, so a new signup can never be verified.
export type DemoAccount = {
  role: string;
  description: string;
  email: string;
  password: string;
};

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: "Customer",
    description: "Browse, order and cancel",
    email: "demo@gourmand.app",
    password: "demo1234",
  },
  {
    role: "Restaurant owner",
    description: "Manage a menu and its orders",
    email: "anita@kesarrasoi.in",
    password: "gourmand123",
  },
];
