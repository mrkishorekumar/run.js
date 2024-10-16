import { db } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import React, { useEffect, useRef } from "react";
import { toast } from "react-toastify";

interface SharePlaygroundModalProps {
  isModalOpen: boolean;
  close: () => void;
  info: {
    prevShare: 0 | 1;
    collectionId: string;
  };
  getUserCodebase: () => Promise<void>;
}

function SharePlaygroundModal({
  isModalOpen,
  close,
  info,
  getUserCodebase,
}: SharePlaygroundModalProps) {
  const submitButtonRef = useRef<HTMLButtonElement>(null);

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

  async function updateSharing() {
    if (submitButtonRef.current) {
      submitButtonRef.current.disabled = true;
      const id = toast.loading("Connecting you to Cloud, hold tight...");
      try {
        const codeCollectionRef = doc(db, "codebase", info.collectionId);
        await updateDoc(codeCollectionRef, {
          share: info.prevShare === 1 ? 0 : 1,
        });
        navigator.clipboard.writeText(
          `https://runjs.rigial.com/playground/${info.collectionId}`,
        );
        await getUserCodebase();
        toast.update(id, {
          render:
            info.prevShare === 1
              ? "Turned off Sharing successfully!"
              : `URL Copied to Clipboard!`,
          type: "success",
          isLoading: false,
          autoClose: 1000,
        });
        close();
      } catch {
        toast.update(id, {
          render: "Oops! Something went wrong. Please try again..",
          type: "error",
          isLoading: false,
          autoClose: 1000,
        });
      }
      submitButtonRef.current.disabled = false;
    }
  }

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
          {info.prevShare === 0
            ? "Do you want share the Playground?"
            : "Do want turn off Sharing?"}
        </h1>
        <h5 className="text-base">
          Anyone on the Internet with the link can view
        </h5>
        <input
          type="url"
          disabled={true}
          className="bg-modalBg border focus:outline-none rounded p-2"
          value={`https://runjs.rigial.com/playground/${info.collectionId}`}
        />
        <button
          ref={submitButtonRef}
          onClick={updateSharing}
          className="bg-blueBtn flex justify-center items-center bg-blue-500 text-white p-2 rounded-md shadow gap-3 text-lg"
        >
          {info.prevShare === 0 ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#FFFFFF"
            >
              <path d="M680-80q-50 0-85-35t-35-85q0-6 3-28L282-392q-16 15-37 23.5t-45 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q24 0 45 8.5t37 23.5l281-164q-2-7-2.5-13.5T560-760q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-24 0-45-8.5T598-672L317-508q2 7 2.5 13.5t.5 14.5q0 8-.5 14.5T317-452l281 164q16-15 37-23.5t45-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T720-200q0-17-11.5-28.5T680-240q-17 0-28.5 11.5T640-200q0 17 11.5 28.5T680-160ZM200-440q17 0 28.5-11.5T240-480q0-17-11.5-28.5T200-520q-17 0-28.5 11.5T160-480q0 17 11.5 28.5T200-440Zm480-280q17 0 28.5-11.5T720-760q0-17-11.5-28.5T680-800q-17 0-28.5 11.5T640-760q0 17 11.5 28.5T680-720Zm0 520ZM200-480Zm480-280Z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#FFFFFF"
            >
              <path d="M680-160q17 0 28.5-11.5T720-200q0-17-11.5-28.5T680-240q-17 0-28.5 11.5T640-200q0 17 11.5 28.5T680-160Zm0-560q17 0 28.5-11.5T720-760q0-17-11.5-28.5T680-800q-17 0-28.5 11.5T640-760q0 17 11.5 28.5T680-720ZM80-470v-10q0-50 35-85t85-35q24 0 45 8.5t37 23.5l281-164q-2-7-2.5-13.5T560-760q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-24 0-45-8.5T598-672L318-509q-19-5-38.5-8t-39.5-3q-45 0-85.5 13T80-470ZM680-80q-50 0-85-35t-35-85q0-6 3-28l-43-26q-2-24-7-46.5T499-345l99 57q16-15 37-23.5t45-8.5q50 0 85 35t35 85q0 50-35 85t-85 35ZM240-40q-83 0-141.5-58.5T40-240q0-83 58.5-141.5T240-440q83 0 141.5 58.5T440-240q0 83-58.5 141.5T240-40Zm0-172 70 71 29-28-71-71 71-71-28-28-71 71-71-71-28 28 71 71-71 71 28 28 71-71Zm440 12Zm0-560Z" />
            </svg>
          )}
          {info.prevShare === 0 ? "Share" : "Stop Sharing"}
        </button>
      </div>
    </div>
  );
}

export default SharePlaygroundModal;
