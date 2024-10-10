import React, { memo } from "react";

interface PlaygroundHeaderProps {
  fullScreen: boolean;
}

function PlaygroundHeader({ fullScreen }: PlaygroundHeaderProps) {
  return (
    <header
      className={`${fullScreen ? "h-7vh" : "h-12vh"} bg-headerBg border-b-2 border-borderColor w-full px-14 flex items-center justify-between`}
    >
      <div
        className={`${fullScreen ? "flex flex-row items-center h-full gap-4" : ""}`}
      >
        <h1 className="font-sans font-medium text-white text-2xl">RunJs.in</h1>
        <h5 className="font-sans text-white text-base">
          Free Online Javascript Complier
        </h5>
      </div>
      <button
        className={`bg-transparent text-white font-semibold py-${fullScreen ? "1" : "2"} px-3 border border-white rounded flex flex-row items-center`}
      >
        RunJs Pro
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="18px"
          viewBox="0 -960 960 960"
          width="18px"
          fill="#FFFFFF"
        >
          <path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" />
        </svg>
      </button>
    </header>
  );
}

export default memo(PlaygroundHeader);
