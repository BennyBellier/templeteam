export interface ContactProps {
  name: string;
  mail: string;
  subject: string;
  message: string;
}

export const baseUrl = process.env.URL
  ? `https://${process.env.URL}`
  : "http://localhost:3000";
