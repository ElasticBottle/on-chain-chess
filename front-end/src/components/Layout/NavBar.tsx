import { Button, Flex, useColorModeValue } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { BrandIcon } from "../BrandIcon";
import { UserMenu } from "./UserMenu";

export function Navbar() {
  const router = useRouter();

  return (
    <Flex
      bg={useColorModeValue("gray.100", "dark.600")}
      px="4"
      w="full"
      h={20}
      alignItems="center"
      justifyContent="space-between"
      gap="4"
    >
      <Button
        onClick={() => {
          router.push("/").catch((e) => {
            console.log(`Error routing to /: `, e);
          });
        }}
        h={14}
        w={14}
        p={1}
        variant={"ghost"}
      >
        <BrandIcon />
      </Button>

      <Flex alignItems={"center"} gap={2}>
        <UserMenu />
      </Flex>
    </Flex>
  );
}
