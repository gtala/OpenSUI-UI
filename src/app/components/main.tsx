/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { getObjectsFromAddress } from "@/utils/sui";
import { SuiWalletConnect } from "@/utils/useSuiWallet";

export default function Main() {
  const { address } = SuiWalletConnect();
  const [metadata, setMetadata] = useState([]);

  async function getAsyncObject() {
    const data = await getObjectsFromAddress(address as string);
    setMetadata(data);
  }

  useEffect(() => {
    if (address) {
      getAsyncObject();
    }
  }, [address]);

  const handleRedirect = (packageId: string) => {
    window.location.href = `/${packageId}`;
  };


  const renderNfts = () => {
    return metadata?.length > 0 ? (
      metadata?.map(
        (data: any, index) =>
          data.content.fields.image_url && (
            <div
              key={index}
              onClick={() => handleRedirect(data.objectId)}
              className="w-[30%] m-4 bg-black lg:relative cursor-pointer"
            >
              <img
                src={
                  "https://ipfs.io/ipfs/" +
                  data.content.fields.image_url.replace("ipfs://", "")
                }
                alt="Nft Img"
                className="rounded-xl border-[5px] fit-cover min-h-[330px]"
              />
            </div>
          )
      )
    ) : (
      <div className="flex m-auto text-4xl"> NO NFT OWNED </div>
    );
  };
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full max-w-6xl items-start justify-between font-mono text-sm lg:flex lg:py-20 lg:flex-wrap">
        {renderNfts()}
      </div>
    </main>
  );
}
