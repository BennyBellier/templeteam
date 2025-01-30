import "server-only";

import { env } from "@/env.mjs";

const smtpOptions = {
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: true,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
};

export default smtpOptions;