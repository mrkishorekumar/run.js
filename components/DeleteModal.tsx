import { db } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import React, { useEffect, useRef } from "react";
import { toast } from "react-toastify";

interface DeleteModalProps {
  close: () => void;
  isModalOpen: string;
  getUserCodebase: () => Promise<void>;
}

function DeleteModal({
  close,
  isModalOpen,
  getUserCodebase,
}: DeleteModalProps) {
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

  async function moveToBin() {
    if (submitButtonRef.current) {
      submitButtonRef.current.disabled = true;
      const id = toast.loading("Connecting you to Cloud, hold tight...");
      try {
        const codeCollectionRef = doc(db, "codebase", isModalOpen);
        await updateDoc(codeCollectionRef, {
          isDelete: true,
        });
        await getUserCodebase();
        toast.update(id, {
          render: `Filen moved to Bin successfully!`,
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

  if (isModalOpen.length === 0) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 text-white">
      <div
        className="absolute inset-0 opacity-50"
        onClick={close}
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      ></div>
      <div className="bg-modalBg rounded shadow-lg p-6 z-10 max-w-xs w-full flex flex-col items-center gap-3">
        <h1 className="font-semibold text-xl">Move to Bin?</h1>
        <div className="flex gap-5 mt-5">
          <button
            className="bg-red-500 text-white py-2 px-3 rounded"
            type="button"
            onClick={close}
          >
            Cancel
          </button>
          <button
            onClick={moveToBin}
            ref={submitButtonRef}
            className="bg-blueBtn text-white py-2 px-3 rounded"
            type="submit"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
