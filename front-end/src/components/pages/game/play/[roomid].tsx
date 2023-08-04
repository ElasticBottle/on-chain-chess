import {
  Button,
  Center,
  Flex,
  Heading,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { AuthGate } from "~/components/AuthGate";
import { ChessBoardBlockChain } from "~/components/game/ChessBoard";
import { api } from "~/utils/api";
import { convertTupleToChessPosition } from "~/utils/chess";
import {
  PieceColor,
  pollForTransactionStatus,
  subscribeToFunction,
} from "~/utils/web3Api";

export const ChessGamePage = () => {
  const {
    query: { roomid: roomId },
    push,
  } = useRouter();
  const address = useAddress();

  const [currentTurn, setCurrentTurn] = useState(PieceColor.White);
  const [playerColor, setPlayerColor] = useState(PieceColor.None);
  const [opponentColor, setOpponentColor] = useState(PieceColor.None);
  const [opponentAddress, setOpponentAddress] = useState<string | undefined>(
    undefined
  );
  const [opponentMove, setOpponentMove] = useState<
    { from: string; to: string } | undefined
  >(undefined);
  const [winner, setWinner] = useState<string | undefined>(undefined);

  useEffect(() => {
    const functionName = "getLastMove";
    const args = roomId;

    if (typeof args !== "string" || args === "0" || !address) {
      return;
    }
    const unsubscribeToBoardState = subscribeToFunction({
      functionName,
      args,
      onData(raw) {
        const data = z.number().array().array().parse(raw);
        console.log("board state", data);
        const from = convertTupleToChessPosition({
          x: data[0]?.[0] ?? -1,
          y: data[0]?.[1] ?? -1,
        });
        const to = convertTupleToChessPosition({
          x: data[1]?.[0] ?? -1,
          y: data[1]?.[1] ?? -1,
        });

        setOpponentMove({ from, to });
      },
      onError(e) {
        console.error("Error getting board state", e);
      },
    });
    const unsubscribeToGameState = subscribeToFunction({
      functionName: "rooms",
      args,
      onData(room) {
        if (Array.isArray(room)) {
          const player1 = z.string().parse(room[0]);
          const player1Color = z.number().parse(room[1]);
          const player2 = z.string().parse(room[2]);
          const player2Color = z.number().parse(room[3]);
          setOpponentAddress(address === player1 ? player2 : player1);
          setPlayerColor(address === player1 ? player1Color : player2Color);
          setOpponentColor(address === player1 ? player2Color : player1Color);
          setWinner(z.string().parse(room[5]));
        }
      },
      onError(e) {
        console.error("Error getting game state", e);
      },
    });
    return () => {
      unsubscribeToGameState();
      unsubscribeToBoardState();
    };
  }, [roomId, address]);

  const apiContext = api.useContext();
  api.web3api.readChessContract.useQuery(
    {
      functionName: "playerToActiveRoom",
      args: address,
    },
    {
      enabled: roomId === "0" && !!address,
      onSuccess(data) {
        if (typeof data !== "string") {
          return;
        }
        push(`/game/play/${data}`).catch((e) => {
          console.error("ERROR navigating to game", e);
        });
      },
    }
  );

  const [isClosingRoom, setIsClosingRoom] = useState(false);
  const { mutate: closeRoom } = api.web3api.writeChessContract.useMutation({
    onSuccess: (data) => {
      pollForTransactionStatus({
        apiContext,
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

  if (roomId === "0" || typeof roomId !== "string") {
    return (
      <Center flexGrow={1}>
        <Spinner />
      </Center>
    );
  }

  return (
    <AuthGate>
      <Stack m={10} spacing={5}>
        <Heading fontSize={"lg"}>Room {roomId}</Heading>
        <Text>
          You are playing as{" "}
          {playerColor === PieceColor.White ? "White" : "Black"}
        </Text>
        <Text>
          It is now{" "}
          {currentTurn === playerColor ? "your turn" : "your opponent's turn"}
        </Text>
        <ChessBoardBlockChain
          opponentMove={opponentMove}
          opponentColor={opponentColor}
          roomId={roomId}
          currentTurn={currentTurn}
          setCurrentTurn={setCurrentTurn}
          playerColor={playerColor}
        />
        <Flex w="full">
          <Button onClick={closeRoomClick} isLoading={isClosingRoom}>
            Close Room
          </Button>
        </Flex>
      </Stack>
    </AuthGate>
  );
};
