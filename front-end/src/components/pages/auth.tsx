import { Heading, Stack, Text, useColorMode } from "@chakra-ui/react";
import { ConnectWallet, useUser } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";

export const AuthPage = () => {
  const router = useRouter();
  const {
    query: { redirectTo },
  } = router;
  const { isLoggedIn } = useUser();
  const { colorMode } = useColorMode();

  const redirectAfterLogin = useCallback(
    (redirectTo?: string) => {
      router
        .push(typeof redirectTo === "string" ? redirectTo : "/game")
        .catch((e) => {
          console.error("Something went wrong navigating after signing in", e);
        });
    },
    [router]
  );

  useEffect(() => {
    if (isLoggedIn) {
      redirectAfterLogin(
        typeof redirectTo === "string" ? redirectTo : undefined
      );
    }
  }, [isLoggedIn, redirectAfterLogin, redirectTo]);

  return (
    <Stack flexGrow={1} justify={"center"} pb={20}>
      <Stack maxW="md" w={"container.md"} alignItems={"start"} spacing={5}>
        <Stack textAlign={"start"}>
          <Heading>Sign In</Heading>
          <Text opacity={0.6}>Be the winner today</Text>
        </Stack>
        {!isLoggedIn && (
          <ConnectWallet style={{ width: "100%" }} theme={colorMode} />
        )}
      </Stack>
    </Stack>
  );
};
