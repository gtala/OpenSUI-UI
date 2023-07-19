"use client";
import { SuiWalletConnect } from "@/utils/useSuiWallet";
import { Button } from "./button";
import { ConnectButton } from "@suiet/wallet-kit";

export default function Header() {
  const { connect, address, disconnect, parsedBalance } = SuiWalletConnect();

  return (
    <div className="z-10 w-full px-12 items-center justify-between font-mono flex h-24 absolute top-0 border-b-[0.3px] border-gray-600">
      <a href="/">
        <p className="text-3xl">OpenSui</p>
      </a>
      {!!address ? (
        <div className="flex gap-8">
          <div className="flex flex-col gap-2">
            <p>{address.slice(0, 6).concat("...").concat(address.slice(-4))}</p>
            <p>Balance: {Number(parsedBalance)} </p>
          </div>
          <Button callback={disconnect} placeholder="Disconnect" />
        </div>
      ) : (
        <ConnectButton className="hover:bg-gray-600 border-b border-gray-300 bg-[#232424] pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:py-4 lg:px-8 lg:dark:bg-zinc-800/30">
          Connect Wallet
        </ConnectButton>
        // <Button callback={connect} placeholder="Connect Wallet" />
      )}
    </div>
  );
}
