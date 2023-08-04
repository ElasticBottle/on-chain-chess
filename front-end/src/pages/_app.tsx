import {
  ChakraProvider,
  extendTheme,
  type StyleFunctionProps,
  type ThemeConfig,
} from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Analytics } from "@vercel/analytics/react";
import type { AppType } from "next/app";
import { Montserrat, Poppins } from "next/font/google";
import { Layout } from "~/components/Layout";
import "../styles/globals.css";

const montserrat = Montserrat({ subsets: ["latin-ext"], display: "swap" });
const poppins = Poppins({
  style: ["italic", "normal"],
  weight: ["400", "600", "700"],
  display: "swap",
  subsets: ["latin-ext"],
});

const fonts = {
  heading: poppins.style.fontFamily,
  body: montserrat.style.fontFamily,
};

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

// https://palette.saas-ui.dev/
const colors = {
  black: "#202225",
  white: "#CCD7DA",
  brandPrimary: "#DCAD52",
  gray: {
    "50": "#f9fafa",
    "100": "#f1f1f2",
    "200": "#e7e7e8",
    "300": "#d3d4d4",
    "400": "#acadae",
    "500": "#7e7f81",
    "600": "#535557",
    "700": "#353739",
    "800": "#1e2023",
    "900": "#181a1c",
  },
  yellow: {
    "50": "#fefefc",
    "100": "#fbf9ee",
    "200": "#f5edcc",
    "300": "#ede0a4",
    "400": "#e1cc6b",
    "500": "#bda746",
    "600": "#978638",
    "700": "#76682c",
    "800": "#584e21",
    "900": "#49401b",
  },
  green: {
    "50": "#f5fdf9",
    "100": "#caf4df",
    "200": "#8de8b9",
    "300": "#50d691",
    "400": "#46bb7f",
    "500": "#3ca06d",
    "600": "#31855a",
    "700": "#266746",
    "800": "#205539",
    "900": "#1a452f",
  },
  teal: {
    "50": "#f0fcfc",
    "100": "#bef2f1",
    "200": "#7fe5e4",
    "300": "#4ed0ce",
    "400": "#42b1af",
    "500": "#389695",
    "600": "#2d7a79",
    "700": "#235f5e",
    "800": "#1d4f4e",
    "900": "#184140",
  },
  cyan: {
    "50": "#f3fbfd",
    "100": "#ceeff5",
    "200": "#b7e8f0",
    "300": "#9ddfeb",
    "400": "#51c3d8",
    "500": "#4ab4c6",
    "600": "#43a2b3",
    "700": "#378694",
    "800": "#2d6e79",
    "900": "#23555e",
  },
  blue: {
    "50": "#f1f7fc",
    "100": "#cbe0f4",
    "200": "#a5caed",
    "300": "#7ab1e4",
    "400": "#5298db",
    "500": "#4683bc",
    "600": "#3b6d9d",
    "700": "#2d5478",
    "800": "#254462",
    "900": "#1e3850",
  },
  purple: {
    "50": "#f8f6fd",
    "100": "#e4daf8",
    "200": "#d0bff2",
    "300": "#b298ea",
    "400": "#9d7ce4",
    "500": "#8257dd",
    "600": "#6c47bd",
    "700": "#593a9b",
    "800": "#492f7f",
    "900": "#36235e",
  },
  pink: {
    "50": "#fdf5f9",
    "100": "#f7d9e8",
    "200": "#f1b9d6",
    "300": "#e88ebc",
    "400": "#e16da9",
    "500": "#ca4b8d",
    "600": "#ad4179",
    "700": "#8d3562",
    "800": "#6e294c",
    "900": "#511e38",
  },
  orange: {
    "50": "#fdfaf7",
    "100": "#f8ebde",
    "200": "#f1d4b8",
    "300": "#e6b281",
    "400": "#d99351",
    "500": "#bb7e46",
    "600": "#9d6b3b",
    "700": "#7d552f",
    "800": "#634325",
    "900": "#51371e",
  },
  darkColor: {
    "100": "#918d94",
    "200": "#77727b",
    "300": "#5e5963",
    "400": "#46414c",
    "500": "#302a36",
    "600": "#1b1521",
  },
  dark: {
    "100": "#8b8b8b",
    "200": "#717171",
    "300": "#575757",
    "400": "#3f3f3f",
    "500": "#282828",
    "600": "#121212",
  },
};

const styles = {
  global: (props: StyleFunctionProps) => ({
    body: {
      color: mode("blue.900", "gray.100")(props),
      bg: mode("gray.200", "darkColor.600")(props),
    },
  }),
};

export const theme = extendTheme({
  fonts,
  colors,
  config,
  styles,
});

const MyApp: AppType<Record<string, unknown>> = ({
  Component,
  pageProps: { ...pageProps },
}) => {
  console.log(
    "process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID",
    process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID
  );
  return (
    <ThirdwebProvider
      // Required configuration for the provider, but doesn't affect Auth.
      activeChain="polygon"
      clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
      authConfig={{
        // Set this to your domain to prevent phishing attacks
        domain: process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN || "",
        // The URL of your Auth API
        authUrl: "/api/auth",
      }}
    >
      <ChakraProvider
        theme={theme}
        toastOptions={{
          defaultOptions: {
            position: "bottom",
            isClosable: true,
            duration: 5_000,
            variant: "subtle",
          },
        }}
      >
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <Analytics />
      </ChakraProvider>
    </ThirdwebProvider>
  );
};

export default MyApp;
