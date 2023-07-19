/* eslint-disable @next/next/no-img-element */
"use client";

export default function Main() {
  const metadata = {
    fields: [
      {
        url: "https://cdn.clutchy.io/ipfs/bafybeictvrpb2vdek7i3gmfihnwrl4j6egoht6em36slnbghq7jqdl7ul4/709.png?img-quality=60&img-width=400&img-height=400",
      },
      {
        url: "https://storage.googleapis.com/clutchy-f128b.appspot.com/images%2Fzyxy1xon5%2Fwiy7w0wn9-1200.webp",
      },
      {
        url: "https://storage.googleapis.com/clutchy-f128b.appspot.com/images%2Frkac5syu2%2F9t1sylc2w-1200.webp",
      },
    ],
  };
  const handleRedirect = () => {
    window.location.href = "/125125";
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full max-w-6xl items-start justify-between font-mono text-sm lg:flex lg:py-20">
        {metadata.fields.map((data, index) => (
          <div
            key={index}
            onClick={handleRedirect}
            className="w-1/3 bg-black lg:relative mx-8 cursor-pointer"
          >
            <img
              src={data.url}
              alt="Nft Img"
              className="rounded-xl border-[5px] fit-cover"
            />
          </div>
        ))}
      </div>
    </main>
  );
}
