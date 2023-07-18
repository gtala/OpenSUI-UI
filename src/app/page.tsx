/* eslint-disable @next/next/no-img-element */
'use client'
import { WalletProvider } from "@suiet/wallet-kit";
import Main from './components/main'

export default function Home() {
  return (
    <WalletProvider>
     <Main/>
    </WalletProvider>
  );
}
