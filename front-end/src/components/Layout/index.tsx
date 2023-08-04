import React from "react";
import { Flex } from "@chakra-ui/react";

import { Navbar } from "./NavBar";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Flex
      direction="column"
      alignItems={"center"}
      w="full"
      h="full"
      minH={"100vh"}
    >
      <Navbar />
      {children}
    </Flex>
  );
}
