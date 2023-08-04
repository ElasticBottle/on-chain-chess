/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useColorModeValue } from "@chakra-ui/react";
import Image from "next/image";

import cat2 from "../../public/cat2.svg";

export const BrandIcon = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const imgFilter = useColorModeValue(
    "brightness(40%)",
    "brightness(0) invert(95%)"
  );
  const width = size === "sm" ? 24 : size === "md" ? 32 : 42;
  return (
    <Image
      src={cat2}
      alt="cute cat logo"
      width={width}
      style={{ filter: imgFilter }}
    />
  );
};
