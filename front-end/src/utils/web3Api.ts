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
        }
      })
      .catch((e) => {
        onError(e);
        console.error(
          "ERROR: something went wrong getting transaction status",
          e
        );
      });
  }, 3_000);
}
