import { PrivateKeyWallet } from "@thirdweb-dev/auth/evm";
import { ThirdwebAuth } from "@thirdweb-dev/auth/next";
import { env } from "~/env.mjs";

export const { ThirdwebAuthHandler, getUser } = ThirdwebAuth({
  domain: env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN,
  wallet: new PrivateKeyWallet(process.env.THIRDWEB_AUTH_PRIVATE_KEY || ""),
});

export default ThirdwebAuthHandler();
