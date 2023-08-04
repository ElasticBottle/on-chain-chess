import { Center, Spinner } from "@chakra-ui/react";
import { useUser } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import { useEffect, type ReactNode } from "react";

export function AuthGate({ children }: { children: ReactNode }) {
  const { isLoggedIn, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push("/auth?redirectTo=/game").catch((e) => {
        console.error("Error navigating to /auth page", e);
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

  return children;
}
