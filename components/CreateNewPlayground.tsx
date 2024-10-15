import React, { FormEvent, useEffect, useState } from "react";
import { addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "./AuthProvider";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { Codebase, MASTER_DATA } from "@/utils/firebaseSchema";
import { codeCollectionRef } from "@/firebase";

interface CreateNewPlaygroundProps {
  isModalOpen: boolean;
  close: () => void;
}

function CreateNewPlayground({ isModalOpen, close }: CreateNewPlaygroundProps) {
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<"js" | "ts">("js");
  const { user } = useAuth();
  const router = useRouter();

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

  async function createNewPlayGroundFunction(e: FormEvent) {
    e.preventDefault();
    const id = toast.loading("Connecting you to Cloud, hold tight...");
    setLoading(true);
    try {
      if (user?.uid) {
        const Payload: Codebase = {
          ...MASTER_DATA,
          fileName: fileName,
          language: lang,
          userId: user?.uid,
          createdAt: serverTimestamp(),
          lastModifiedAt: serverTimestamp(),
        };
        const docRef = await addDoc(codeCollectionRef, Payload);
        toast.update(id, {
          render: "Playground created successfully!",
          type: "success",
          isLoading: false,
          autoClose: 1000,
        });
        close();
        if (docRef.id) {
          router.push(`/playground/${docRef.id}`);
        }
      }
    } catch {
      toast.update(id, {
        render: "Oops! Something went wrong. Please try again..",
        type: "error",
        isLoading: false,
        autoClose: 1000,
      });
    }
    setLoading(false);
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
        <h1 className="font-semibold text-xl">Create A Playground</h1>
        <h5 className="text-base">Give it a nice name like,</h5>
        <form
          className="flex flex-col pt-1"
          onSubmit={createNewPlayGroundFunction}
        >
          <input
            autoFocus={true}
            maxLength={50}
            placeholder="my-awesome-project"
            className="bg-modalBg border focus:outline-none rounded p-2"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            type="text"
            required
          />
          <div className="flex gap-3 mt-3 justify-center">
            <button
              className={`bg-transparent p-1 border ${lang === "js" ? "border-white" : "border-borderColor"} rounded`}
              onClick={() => setLang("js")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 1052 1052"
              >
                <path fill="#f0db4f" d="M0 0h1052v1052H0z" />
                <path
                  d="M965.9 801.1c-7.7-48-39-88.3-131.7-125.9-32.2-14.8-68.1-25.399-78.8-49.8-3.8-14.2-4.3-22.2-1.9-30.8 6.9-27.9 40.2-36.6 66.6-28.6 17 5.7 33.1 18.801 42.8 39.7 45.4-29.399 45.3-29.2 77-49.399-11.6-18-17.8-26.301-25.4-34-27.3-30.5-64.5-46.2-124-45-10.3 1.3-20.699 2.699-31 4-29.699 7.5-58 23.1-74.6 44-49.8 56.5-35.6 155.399 25 196.1 59.7 44.8 147.4 55 158.6 96.9 10.9 51.3-37.699 67.899-86 62-35.6-7.4-55.399-25.5-76.8-58.4-39.399 22.8-39.399 22.8-79.899 46.1 9.6 21 19.699 30.5 35.8 48.7 76.2 77.3 266.899 73.5 301.1-43.5 1.399-4.001 10.6-30.801 3.199-72.101zm-394-317.6h-98.4c0 85-.399 169.4-.399 254.4 0 54.1 2.8 103.7-6 118.9-14.4 29.899-51.7 26.2-68.7 20.399-17.3-8.5-26.1-20.6-36.3-37.699-2.8-4.9-4.9-8.7-5.601-9-26.699 16.3-53.3 32.699-80 49 13.301 27.3 32.9 51 58 66.399 37.5 22.5 87.9 29.4 140.601 17.3 34.3-10 63.899-30.699 79.399-62.199 22.4-41.3 17.6-91.3 17.4-146.6.5-90.2 0-180.4 0-270.9z"
                  fill="#323330"
                />
              </svg>
            </button>
            <button
              className={`bg-transparent p-1 border ${lang === "ts" ? "border-white" : "border-borderColor"} rounded`}
              onClick={() => setLang("ts")}
            >
              <svg
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 400 400"
                width="40"
                height="40"
              >
                {" "}
                <path fill="#007acc" className="st0" d="M0 200V0h400v400H0" />
                <path
                  className="st1"
                  fill="#fff"
                  d="M87.7 200.7V217h52v148h36.9V217h52v-16c0-9 0-16.3-.4-16.5 0-.3-31.7-.4-70.2-.4l-70 .3v16.4l-.3-.1zM321.4 184c10.2 2.4 18 7 25 14.3 3.7 4 9.2 11 9.6 12.8 0 .6-17.3 12.3-27.8 18.8-.4.3-2-1.4-3.6-4-5.2-7.4-10.5-10.6-18.8-11.2-12-.8-20 5.5-20 16 0 3.2.6 5 1.8 7.6 2.7 5.5 7.7 8.8 23.2 15.6 28.6 12.3 41 20.4 48.5 32 8.5 13 10.4 33.4 4.7 48.7-6.4 16.7-22 28-44.3 31.7-7 1.2-23 1-30.5-.3-16-3-31.3-11-40.7-21.3-3.7-4-10.8-14.7-10.4-15.4l3.8-2.4 15-8.7 11.3-6.6 2.6 3.5c3.3 5.2 10.7 12.2 15 14.6 13 6.7 30.4 5.8 39-2 3.7-3.4 5.3-7 5.3-12 0-4.6-.7-6.7-3-10.2-3.2-4.4-9.6-8-27.6-16-20.7-8.8-29.5-14.4-37.7-23-4.7-5.2-9-13.3-11-20-1.5-5.8-2-20-.6-25.7 4.3-20 19.4-34 41-38 7-1.4 23.5-.8 30.4 1l-.2.2z"
                />
              </svg>
            </button>
          </div>
          <button
            disabled={loading}
            className="bg-blueBtn text-white py-2 px-3 rounded mt-3"
            type="submit"
          >
            Create Playground
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateNewPlayground;
