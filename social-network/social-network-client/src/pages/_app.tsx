import "@/styles/globals.css";
import { NextUIProvider } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { Poppins } from "next/font/google";

const poppins = Poppins({subsets: ['latin'], weight: "400"})

const queryClient = new QueryClient()


export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <main className={poppins.className}>
        <NextUIProvider>
          <Component {...pageProps} />
        </NextUIProvider>
      </main>
    </QueryClientProvider>
  )
}
