// @ts-nocheck
import React from "react";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { ConnectionProvider } from "@solana/wallet-adapter-react";

import "tailwindcss/tailwind.css";
import "../styles/globals.css";
import "../styles/App.css";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});
function MyApp({ Component, pageProps }: AppProps) {
  return (
    // <ConnectionProvider endpoint={endpoint}>
    //   <WalletProvider>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <TonConnectUIProvider manifestUrl="https://minter.ton.org/tonconnect-manifest.json">
        <Component {...pageProps} />
      </TonConnectUIProvider>
    </ThemeProvider>
    //   </WalletProvider>
    // </ConnectionProvider>
  );
}

export default MyApp;
