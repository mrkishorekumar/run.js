import Image from "next/image";
import React, { memo } from "react";

function Loading({ randomMessage }: { randomMessage: string }) {
  return (
    <main className="bg-navbarBg flex flex-col justify-center items-center gap-4 h-100vh w-full">
      <Image
        src="./runjs.png"
        alt="Bouncing RunJs Logo"
        width={200}
        height={200}
        className="animate-slow-bounce"
      />
      <h1 className="mt-5 text-white font-sans font-semibold text-lg">
        {randomMessage}
      </h1>
    </main>
  );
}

export default memo(Loading);
