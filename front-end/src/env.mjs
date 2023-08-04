import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    THIRDWEB_AUTH_PRIVATE_KEY: z.string().min(1),
    THIRDWEB_SDK_SECRET_KEY: z.string().min(1),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN: z.string().min(1),
    NEXT_PUBLIC_THIRDWEB_CLIENT_ID: z.string().min(1),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    THIRDWEB_AUTH_PRIVATE_KEY: process.env.THIRDWEB_AUTH_PRIVATE_KEY,
    THIRDWEB_SDK_SECRET_KEY: process.env.THIRDWEB_SDK_SECRET_KEY,
    NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN:
      process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN,
    NEXT_PUBLIC_THIRDWEB_CLIENT_ID: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
   * This is especially useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});