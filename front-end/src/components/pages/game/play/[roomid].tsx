import { Button, Flex, Heading, Stack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { AuthGate } from "~/components/AuthGate";
import { ChessBoardBlockChain } from "~/components/game/ChessBoard";
import { api } from "~/utils/api";
import { pollForTransactionStatus } from "~/utils/web3Api";

export const ChessGamePage = () => {
  const {
    query: { roomid: roomId },
    push,
  } = useRouter();

  const [isClosingRoom, setIsClosingRoom] = useState(false);
  const { mutate: closeRoom } = api.web3api.writeChessContract.useMutation({
    onSuccess: (data) => {
      pollForTransactionStatus({
        txnId: data,
        onSuccess() {
          push("/game").catch((e) => {
            console.error("ERROR navigating to game list", e);
          });
          setIsClosingRoom(false);
        },
        onError() {
          setIsClosingRoom(false);
        },
      });
    },
  });

  const closeRoomClick = () => {
    if (typeof roomId !== "string") {
      return;
    }
    setIsClosingRoom(true);
    closeRoom({
      function_name: "closeRoom",
      args: [roomId],
    });
  };

  return (
    <AuthGate>
      <Stack m={10} spacing={5}>
        <Heading fontSize={"lg"}>Room {roomId}</Heading>
        <ChessBoardBlockChain />
        <Flex w="full">
          <Button onClick={closeRoomClick} isLoading={isClosingRoom}>
            Close Room
          </Button>
        </Flex>
      </Stack>
    </AuthGate>
  );
};
