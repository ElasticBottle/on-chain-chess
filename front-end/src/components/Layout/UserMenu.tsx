import { Button, Flex, useColorMode } from "@chakra-ui/react";
import { ConnectWallet, useLogout, useUser } from "@thirdweb-dev/react";
import { Moon, Sun } from "lucide-react";

export const UserMenu = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  const { isLoggedIn, user } = useUser();
  const { logout } = useLogout();

  const themeIcon =
    colorMode === "light" ? <Moon size="20" /> : <Sun size="20" />;

  if (!isLoggedIn) {
    return (
      <Button onClick={toggleColorMode} padding="2">
        {themeIcon}
      </Button>
    );
  }

  return (
    <Flex alignItems={"center"} gap={5}>
      <ConnectWallet theme={colorMode} />
      <Button onClick={toggleColorMode} padding="2">
        {themeIcon}
      </Button>
    </Flex>
  );
};
