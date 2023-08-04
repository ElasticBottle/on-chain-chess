import { z } from "zod";
import { type api } from "./api";

export function pollForTransactionStatus({
  txnId,
  onError,
  onSuccess,
  apiContext,
}: {
  txnId: string;
  onSuccess: () => void | Promise<void>;
  onError: (e: unknown) => void;
  apiContext: ReturnType<(typeof api)["useContext"]>;
}) {
  const interval = setInterval(() => {
    apiContext.web3api.getTransactionStatus
      .fetch({
        txnId,
      })
      .then(async ({ status }) => {
        if (status === "submitted") {
          clearInterval(interval);
          await onSuccess();
        } else if (status === "errored") {
          clearInterval(interval);
          onError("Transaction error");
        }
      })
      .catch((e) => {
        onError(e);
        console.error(
          "ERROR: something went wrong getting transaction status",
          e
        );
      });
  }, 7_000);
}

export function subscribeToFunction({
  functionName,
  args,
  onData,
  onError,
}: {
  functionName: string;
  args: string;
  onData(data: unknown): void;
  onError(e: unknown): void;
}) {
  let urlString = `${WEB3_API_URL}/contract/${CHESS_GAME_NETWORK}/${CHESS_GAME_CONTRACT_ADDRESS}/read`;
  if (urlString.startsWith("https://")) {
    urlString = urlString.replace("https://", "wss://");
  } else if (urlString.startsWith("http://")) {
    urlString = urlString.replace("http://", "ws://");
  }
  const url = new URL(urlString);
  url.searchParams.append("function_name", functionName);
  url.searchParams.append("args", args);
  const ws = new WebSocket(url.href);
  ws.addEventListener("message", (e) => {
    const json = responseSchema.parse(JSON.parse(e.data as string));
    if (typeof json.result === "object" && "error" in json.result) {
      onError(json.result.error);
    } else if (typeof json.result === "object" && "data" in json.result) {
      onData(json.result.data);
    }
  });

  return () => {
    ws.close();
  };
}

export const responseSchema = z.object({
  result: z.union([z.any().array(), z.object({}).passthrough(), z.string()]),
});

// export const WEB3_API_URL = "http://localhost:3005";
export const WEB3_API_URL =
  "https://web3-api-akbv-winston-listen-to-r-85359b.chainsaw-dev.zeet.app";

export const CHESS_GAME_CONTRACT_ADDRESS =
  "0x0870a21a264D607e038865eF0756Eb4BCc9F29Dd";
export const CHESS_GAME_NETWORK = "mumbai";

export const PieceColor = {
  None: 0,
  White: 1,
  Black: 2,
};

export const PieceType = {
  Empty: 0,
  Pawn: 1,
  Rook: 2,
  Knight: 3,
  Bishop: 4,
  Queen: 5,
  King: 6,
};

export const NO_MOVE = 255;
