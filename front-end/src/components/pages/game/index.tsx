import {
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { z } from "zod";
import { AuthGate } from "~/components/AuthGate";
import { api } from "~/utils/api";
import { pollForTransactionStatus } from "~/utils/web3Api";

export const ChessGameListPage = () => {
  const address = useAddress();
  const router = useRouter();
  const apiContext = api.useContext();

  const {
    data: availableRooms,
    isInitialLoading: isLoadingAvailableRooms,
    error: errorGettingAvailableRooms,
  } = api.web3api.readChessContract.useQuery({
    args: "1,1000",
    functionName: "getAvailableRooms",
  });

  const {
    data: playerRoom,
    isInitialLoading: isLoadingPlayerRoom,
    error: errorGettingPlayerRoom,
  } = api.web3api.readChessContract.useQuery(
    {
      args: address,
      functionName: "playerToActiveRoom",
    },
    {
      enabled: !!address,
    }
  );

  const [isJoiningGame, setIsJoiningGame] = useState(false);
  const { mutate } = api.web3api.writeChessContract.useMutation({
    onSuccess: (txnId) => {
      console.log("txnId", txnId);
      pollForTransactionStatus({
        apiContext,
        txnId,
        async onSuccess() {
          const roomId = await apiContext.web3api.readChessContract.fetch({
            functionName: "playerToActiveRoom",
            args: address,
          });
          const parsedRoomId = z.coerce.string().parse(roomId);
          router.push(`/game/play/${parsedRoomId}`).catch((e) => {
            console.error("ERROR navigating to game", e);
          });
          setIsJoiningGame(false);
        },
        onError() {
          setIsJoiningGame(false);
        },
      });
    },
  });
  const createRoom = () => {
    setIsJoiningGame(true);
    mutate({
      function_name: "createRoom",
      args: [address ?? "0x"],
    });
  };
  const joinRoom = (roomId: string) => () => {
    setIsJoiningGame(true);
    mutate({
      function_name: "joinRoom",
      args: [roomId, address ?? "0x"],
    });
  };

  const resumeGame = () => {
    setIsJoiningGame(true);
    if (typeof playerRoom !== "string") {
      return;
    }
    router.push(`/game/play/${playerRoom}`).catch((e) => {
      console.error("ERROR navigating to game", e);
    });
  };

  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  if (errorGettingAvailableRooms || errorGettingPlayerRoom) {
    console.error("errorGettingAvailableRooms", errorGettingAvailableRooms);
    console.error("errorGettingPlayerRoom", errorGettingPlayerRoom);
  }
  const parsedData = z.coerce
    .string()
    .array()
    .optional()
    .safeParse(availableRooms);
  if (!parsedData.success) {
    return <Text>Something went wrong</Text>;
  }

  let ChessGameList = (
    <Center>
      <Spinner />
    </Center>
  );
  if (!isLoadingAvailableRooms) {
    ChessGameList = (
      <Stack>
        {parsedData.data?.length ? (
          parsedData.data?.map((roomId: string) => {
            return (
              <Flex key={roomId} justifyContent={"space-between"}>
                <Text>Room {roomId}</Text>
                <Button
                  variant="ghost"
                  onClick={joinRoom(roomId)}
                  isLoading={isJoiningGame}
                  isDisabled={!address || playerRoom !== "0"}
                >
                  Join Room
                </Button>
              </Flex>
            );
          })
        ) : (
          <Flex>No rooms yet, create one to get started</Flex>
        )}
      </Stack>
    );
  }

  return (
    <AuthGate>
      <Stack flexGrow={1} m={10} spacing={7} w="full" maxW="lg" px={4}>
        {!isLoadingPlayerRoom &&
          typeof playerRoom === "string" &&
          playerRoom !== "0" && (
            <>
              <Flex
                justifyContent={"space-between"}
                alignItems={"center"}
                w="full"
              >
                <Text fontSize={"xl"}>In Game: Room {playerRoom}</Text>
                <Button variant="solid" onClick={resumeGame}>
                  Resume Game
                </Button>
              </Flex>
              <Divider />
            </>
          )}
        <Flex w="full" justifyContent={"space-between"} alignItems={"center"}>
          <Heading fontSize={"lg"}>Online Rooms</Heading>
          <Button
            onClick={createRoom}
            isDisabled={!address || playerRoom !== "0"}
            isLoading={isJoiningGame}
          >
            Create Room
          </Button>
        </Flex>
        {ChessGameList}
      </Stack>
    </AuthGate>
  );
};
