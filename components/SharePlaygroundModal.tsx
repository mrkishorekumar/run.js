import React, { useEffect } from "react";

interface SharePlaygroundModalProps {
  isModalOpen: boolean;
  close: () => void;
  url: string;
}

function SharePlaygroundModal({
  isModalOpen,
  close,
  url,
}: SharePlaygroundModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [close]);

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 text-white">
      <div
        className="absolute inset-0 opacity-50"
        onClick={close}
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      ></div>
      <div className="bg-modalBg rounded shadow-lg p-6 z-10 max-w-md w-full flex flex-col gap-3">
        <h1 className="font-semibold text-xl">
          Do you want share the Playground?
        </h1>
        <h5 className="text-base">
          Anyone on the Internet with the link can view
        </h5>
        <input
          type="url"
          disabled={true}
          className="bg-modalBg border focus:outline-none rounded p-2"
          value={`https://runjs.rigial.com/playground/${url}`}
        />
        <button className="bg-blueBtn flex justify-center items-center bg-blue-500 text-white p-2 rounded-md shadow gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#FFFFFF"
          >
            <path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z" />
          </svg>
          Share
        </button>
      </div>
    </div>
  );
}

export default SharePlaygroundModal;
