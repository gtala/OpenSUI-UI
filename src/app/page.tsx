'use client';
import { WalletProvider } from "@suiet/wallet-kit";
import Main from "./components/main";
// import { sui } from "@/utils/sui";


export default function Home() {
  // sui();

  return (
    <WalletProvider>
      <Main />
    </WalletProvider>
  );
}
