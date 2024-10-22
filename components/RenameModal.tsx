import { db } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

interface RenameModalProps {
  isModalOpen: boolean;
  close: () => void;
  info: {
    prevTitle: string;
    collectionId: string;
    tag: string;
  };
  getUserCodebase: () => Promise<void>;
}

function RenameModal({
  isModalOpen,
  close,
  info,
  getUserCodebase,
}: RenameModalProps) {
  const [fileName, setFileName] = useState("");
  const [tagName, setTag] = useState("");
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setFileName(info.prevTitle);
  }, [info.prevTitle]);

  useEffect(() => {
    setTag(info.tag);
  }, [info.tag]);

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

  async function updateFileName(e: FormEvent) {
    e.preventDefault();
    if (submitButtonRef.current) {
      submitButtonRef.current.disabled = true;
      const id = toast.loading("Connecting you to Cloud, hold tight...");
      try {
        const codeCollectionRef = doc(db, "codebase", info.collectionId);
        const payload: { fileName?: string; tag?: string } = {};
        if (
          !(info.prevTitle.toLocaleLowerCase() === fileName.toLocaleLowerCase())
        ) {
          payload.fileName = fileName.trim();
        }
        if (!(info.tag.toLocaleLowerCase() === tagName.toLocaleLowerCase())) {
          payload.tag = tagName.trim();
        }
        await updateDoc(codeCollectionRef, payload);
        await getUserCodebase();
        toast.update(id, {
          render: `Filename was renamed successfully!`,
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
      <div className="bg-modalBg rounded shadow-lg p-6 z-10 max-w-sm w-full flex flex-col gap-3">
        <h1 className="font-semibold text-xl">{info.prevTitle}</h1>
        <h5 className="text-base">Enter a new title for this playground:</h5>
        <form className="flex flex-col pt-3" onSubmit={updateFileName}>
          <input
            autoFocus={true}
            maxLength={50}
            placeholder="New title"
            className="bg-modalBg border focus:outline-none rounded p-2"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            type="text"
            required
          />
          <input
            maxLength={50}
            placeholder="New Tag"
            className="bg-modalBg border focus:outline-none rounded p-2 mt-3"
            value={tagName}
            onChange={(e) => setTag(e.target.value.toLocaleLowerCase())}
            type="text"
          />
          <div className="flex justify-end gap-5 mt-5">
            <button
              className="bg-red-500 text-white py-2 px-3 rounded"
              type="button"
              onClick={close}
            >
              Cancel
            </button>
            <button
              ref={submitButtonRef}
              className="bg-blueBtn text-white py-2 px-3 rounded"
              type="submit"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RenameModal;
