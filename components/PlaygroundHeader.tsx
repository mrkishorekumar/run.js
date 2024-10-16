import React, { memo } from "react";
import DropDown from "./DropDown";
import { useAuth } from "./AuthProvider";
import Link from "next/link";

interface PlaygroundHeaderProps {
  fullScreen: boolean;
}

function PlaygroundHeader({ fullScreen }: PlaygroundHeaderProps) {
  const { user } = useAuth();

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
      {user === undefined ? (
        <div className="animate-pulse rounded-full bg-slate-300 h-10 w-10"></div>
      ) : user === null ? (
        <Link
          href={"/login"}
          className={`bg-transparent text-white font-semibold ${fullScreen ? "py-1" : "py-2"} px-3 border border-white rounded flex flex-row items-center`}
        >
          Log In to RunJs
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="18px"
            viewBox="0 -960 960 960"
            width="18px"
            fill="#FFFFFF"
          >
            <path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" />
          </svg>
        </Link>
      ) : (
        <DropDown fullScreen={fullScreen} />
      )}
    </header>
  );
}

export default memo(PlaygroundHeader);
