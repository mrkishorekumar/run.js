import { useRouter } from "next/router";
import React from "react";

function NotFound() {
  const router = useRouter();

  return (
    <main className="h-100vh w-full flex flex-col items-center justify-center bg-navbarBg gap-4">
      <h1 className="font-sans font-medium text-white text-6xl">
        404 we couldn’t find that page.
      </h1>
      <p className="font-sans font-light text-white text-xl">
        Page is either removed or moved to a new location.
      </p>
      <button
        onClick={() => router.replace("/")}
        className={`bg-transparent text-white font-semibold py-2 px-3 border border-white rounded flex flex-row items-center gap-1`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#FFFFFF"
        >
          <path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z" />
        </svg>
        Go to Homepage
      </button>
    </main>
  );
}

export default NotFound;
