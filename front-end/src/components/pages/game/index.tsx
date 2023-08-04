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
import { useState } from "react";
import { z } from "zod";
import { AuthGate } from "~/components/AuthGate";
import { api } from "~/utils/api";
import { pollForTransactionStatus } from "~/utils/web3Api";

export const ChessGameListPage = () => {
  const address = useAddress();

  const router = useRouter();

  const {
    data,
    isInitialLoading: isLoading,
    error,
  } = api.web3api.readChessContract.useQuery({
    args: "1,1000",
    functionName: "getAvailableRooms",
  });

  const apiContext = api.useContext();

  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const { mutate } = api.web3api.writeChessContract.useMutation({
    onSuccess: (txnId) => {
      console.log("txnId", txnId);
      pollForTransactionStatus({
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
          setIsCreatingRoom(false);
        },
        onError() {
          setIsCreatingRoom(false);

        }
      });

    },
  });
  const createRoom = () => {
    setIsCreatingRoom(true);
    mutate({
      function_name: "createRoom",
      args: [address ?? "0x"],
    });
  };

  if (error) {
    console.error(error);
  }
  const parsedData = z.coerce.string().array().optional().safeParse(data);
  if (!parsedData.success) {
    return <Text>Something went wrong</Text>;
  }

  let ChessGameList = (
    <Center>
      <Spinner />
    </Center>
  );
  if (!isLoading) {
    ChessGameList = (
      <Stack>
        {parsedData.data?.length ? (
          parsedData.data?.map((roomId: string) => {
            return (
              <Flex key={roomId} justifyContent={"space-between"}>
                <Text>Room {roomId}</Text>
                <Button>Join Room</Button>
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
      <Stack flexGrow={1} m={10} spacing={7} w="md">
        <Flex w="full" justifyContent={"space-between"} alignItems={"center"}>
          <Heading fontSize={"lg"}>Online Rooms</Heading>
          <Button
            onClick={createRoom}
            isDisabled={!address}
            isLoading={isCreatingRoom}
          >
            Create Room
          </Button>
        </Flex>
        {ChessGameList}
      </Stack>
    </AuthGate>
  );
};
