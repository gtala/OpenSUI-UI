/* eslint-disable @next/next/no-img-element */
"use client";
import { SuiWalletConnect } from "@/utils/useSuiWallet";
import { getObjectById } from "@/utils/sui";
import { useEffect, useState } from "react";

export default function Details({ params }: { params: { packageId: string } }) {
  const { address } = SuiWalletConnect();
  const [metadata, setMetadata] = useState<any[]>([]);

  async function getAsyncObject() {
    const data = await getObjectById(address as string, params.packageId);
    setMetadata(data);
  }

  useEffect(() => {
    if (address) {
      getAsyncObject();
    }
  }, [address]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full max-w-6xl items-start justify-between font-mono text-sm lg:flex lg:py-20">
        <div className="w-1/3 bg-black lg:relative">
          {metadata[0]?.content?.fields.animation_url ? (
            <video
              className="rounded-xl border-[5px] object-cover min-h-[330px]"
              autoPlay
              loop
              muted
              playsInline
            >
              <source
                src={metadata[0]?.content?.fields.animation_url}
                type="video/mp4"
              />
            </video>
          ) : (
            <img
              src={metadata[0]?.content?.fields.url}
              alt="Nft Img"
              className="rounded-xl border-[5px] object-cover min-h-[330px]"
            />
          )}
        </div>

        <div className="w-2/3 mx-20">
          <h2 className="text-3xl">{metadata[0]?.content.fields.name} #1</h2>
          <h4 className="text-lg mt-4 mb-8">
            {metadata[0]?.content.fields.description}
          </h4>
          <div className="border-[0.5px] border-gray-600 rounded-md p-4">
            <p className="py-4">Traits:</p>
            <div className="flex flex-wrap -mx-2">
              {metadata[0]?.content.fields.attributes_keys.map(
                (key: string, index: number) => (
                  <div
                    key={index}
                    className="flex flex-col my-2 w-full lg:w-[30%] sm:w-full justify-center border-b border-gray-300 bg-[#232424] dark:border-neutral-800 dark:bg-zinc-800/30 rounded-xl border bg-gray-200 lg:p-4 mx-2"
                  >
                    <p className="text-sm text-gray-600">{key}:</p>
                    <p>
                      {metadata[0]?.content.fields.attributes_values[index]}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}