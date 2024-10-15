import React, { useEffect, useState } from "react";

interface RenameModalProps {
  isModalOpen: boolean;
  close: () => void;
  currentTitle: string;
}

function RenameModal({ isModalOpen, close, currentTitle }: RenameModalProps) {
  const [fileName, setFileName] = useState("");

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
      <div className="bg-modalBg rounded shadow-lg p-6 z-10 max-w-sm w-full flex flex-col gap-3">
        <h1 className="font-semibold text-xl">{currentTitle}</h1>
        <h5 className="text-base">Enter a new title for this playground:</h5>
        <form className="flex flex-col pt-3">
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
          <div className="flex justify-end gap-5 mt-5">
            <button
              className="bg-red-500 text-white py-2 px-3 rounded"
              type="button"
              onClick={close}
            >
              Cancel
            </button>
            <button
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
