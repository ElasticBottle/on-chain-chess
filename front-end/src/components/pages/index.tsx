import { Button, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";

import { BrandIcon } from "../BrandIcon";

export const HomePage = () => {
  const router = useRouter();
  const onBegin = () => {
    router.push("/auth").catch((e) => {
      console.error("Something went wrong navigating to sign in page", e);
    });
  };
  return (
    <>
      <Head>
        <title>Thirdweb Chess - Verifiable Chess Games</title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          property="og:title"
          content="Thirdweb Chess - Verifiable Chess Games"
          key="title"
        />
      </Head>
      <Stack
        flex={1}
        w="full"
        maxW="2xl"
        marginTop={-20}
        alignItems="center"
        justifyContent={"center"}
        spacing={8}
      >
        <Stack alignItems={"center"}>
          <Flex>
            <BrandIcon size="lg" />
            <Heading ml={2} fontSize={"5xl"}>
              Thirdweb Chess
            </Heading>
          </Flex>
          <Text opacity={0.7}>Verifiable Chess Games</Text>
          <Button mt={10} onClick={onBegin} colorScheme="orange" w="full">
            Begin
          </Button>
        </Stack>
      </Stack>
    </>
  );
};
