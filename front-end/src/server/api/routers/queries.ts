import { z } from "zod";
import { env } from "~/env.mjs";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  CHESS_GAME_CONTRACT_ADDRESS,
  CHESS_GAME_NETWORK,
  WEB3_API_URL,
  responseSchema,
} from "~/utils/web3Api";

export const web3ApiRouter = createTRPCRouter({
  readChessContract: publicProcedure
    .input(z.object({ functionName: z.string(), args: z.string().optional() }))
    .query(async ({ input }) => {
      const url = new URL(
        `${WEB3_API_URL}/contract/${CHESS_GAME_NETWORK}/${CHESS_GAME_CONTRACT_ADDRESS}/read`
      );
      url.searchParams.append("function_name", input.functionName);
      url.searchParams.append("args", input.args ?? "");
      const resp = await fetch(url.href, {
        headers: {
          Authorization: "Bearer " + env.THIRDWEB_SDK_SECRET_KEY,
        },
      });
      const json = responseSchema.parse(await resp.json());
      console.log("json", json);
      return json.result;
    }),
  getTransactionStatus: publicProcedure
    .input(
      z.object({
        txnId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const url = new URL(`${WEB3_API_URL}/transaction/status/${input.txnId}`);
      const resp = await fetch(url.href, {
        headers: {
          Authorization: "Bearer " + env.THIRDWEB_SDK_SECRET_KEY,
        },
      });
      const schema = z.object({
        result: z.object({
          status: z.string(),
        }),
      });
      const json = schema.parse(await resp.json());
      console.log("json", json);
      return json.result;
    }),
  writeChessContract: publicProcedure
    .input(
      z.object({
        function_name: z.string(),
        args: z.string().array(),
      })
    )
    .mutation(async ({ input }) => {
      const url = new URL(
        `${WEB3_API_URL}/contract/${CHESS_GAME_NETWORK}/${CHESS_GAME_CONTRACT_ADDRESS}/write`
      );

      console.log("input", input);
      const resp = await fetch(url.href, {
        headers: {
          Authorization: "Bearer " + env.THIRDWEB_SDK_SECRET_KEY,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(input),
      });

      const schema = z.object({
        result: z.string(),
      });
      const json = schema.parse(await resp.json());
      console.log("json", json);
      return json.result;
    }),
});
