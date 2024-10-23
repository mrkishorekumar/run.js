import { db } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

interface RenameModalProps {
  tagSuggestions: string[];
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
  tagSuggestions,
}: RenameModalProps) {
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
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

  function handleInputChange(term: string) {
    if (term) {
      const filtered = tagSuggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(term.toLowerCase()),
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setTag(suggestion);
    setFilteredSuggestions([]);
  };

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
          <div className="relative">
            <input
              maxLength={50}
              placeholder="tag (optional)"
              className="bg-modalBg border focus:outline-none rounded p-2 mt-3 w-full"
              value={tagName}
              onChange={(e) => {
                setTag(e.target.value.toLocaleLowerCase());
                handleInputChange(e.target.value.toLocaleLowerCase());
              }}
              type="text"
            />
            {filteredSuggestions.length > 0 && (
              <ul className="absolute w-full mt-1 bg-modalBg border rounded shadow-lg overflow-y-auto">
                {filteredSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-4 py-2 cursor-pointer text-white"
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
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
