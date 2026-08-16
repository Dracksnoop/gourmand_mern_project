import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config();

export const client = new MailtrapClient({ token: process.env.MAILTRAP_API_TOKEN! });

export const sender = {
  email: process.env.MAIL_FROM_EMAIL || "hello@demomailtrap.co",
  name: process.env.MAIL_FROM_NAME || "Restaurant App",
};
