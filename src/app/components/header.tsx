"use client";
import { getObjectFromAddress } from "@/utils/sui";
import { SuiWalletConnect } from "@/utils/useSuiWallet";
import { Button } from "./button";

export default function Header() {
  const { connect, address, balance, disconnect } = SuiWalletConnect();

  if (address) {
    const metadata = getObjectFromAddress(address as string);
    console.log(metadata);
  }

  return (
    <div className="z-10 w-full px-12 items-center justify-between font-mono flex h-24 absolute top-0 border-b-[0.3px] border-gray-600">
      <a href="/">
        <p className="text-3xl">OpenSui</p>
      </a>
      {!!address ? (
        <div className="flex gap-8">
          <div className="flex flex-col gap-2">
            <p>{address.slice(0, 6).concat("...").concat(address.slice(-4))}</p>
            <p>Balance: {Number(balance)} </p>
          </div>
          <Button callback={disconnect} placeholder="Disconnect" />
        </div>
      ) : (
        <Button callback={connect} placeholder="Connect Wallet" />
      )}
    </div>
  );
}
