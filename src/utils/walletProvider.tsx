"use client";

import {
  WalletProvider as OriginalWalletProvider,
  SuietWallet,
  SuiWallet,
} from "@suiet/wallet-kit";
import "@suiet/wallet-kit/style.css";

export default function WalletProvider({
  children,
}: {
  children: any;
}) {
  return (
    <OriginalWalletProvider defaultWallets={[SuietWallet,
      SuiWallet]}>
      {children}
    </OriginalWalletProvider>
  );
}
