import { Center, Spinner } from "@chakra-ui/react";
import { useUser } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import PlayRandomMoveEngine from "~/components/game/ChessBoard";

export const ChessGamePage = () => {
  const { isLoggedIn, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push("/auth?redirectTo=/game").catch((e) => {
        console.error("Error navigating to /auth page");
      });
    }
  }, [isLoading, isLoggedIn, router]);

  if (isLoading) {
    return (
      <Center flexGrow={1}>
        <Spinner />
      </Center>
    );
  }

  return <PlayRandomMoveEngine />;
};
