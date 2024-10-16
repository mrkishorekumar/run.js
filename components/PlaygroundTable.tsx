import { db } from "@/firebase";
import { UserCodeBase } from "@/pages/playground";
import { doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useRef } from "react";
import { toast } from "react-toastify";

interface PlaygroundTableProp {
  setRenameModal: React.Dispatch<
    React.SetStateAction<{
      prevTitle: string;
      collectionId: string;
    }>
  >;
  setShareModal: React.Dispatch<
    React.SetStateAction<{
      prevShare: 0 | 1;
      collectionId: string;
    }>
  >;
  userCodeBaseData: UserCodeBase[];
  getUserCodebase: () => Promise<void>;
}

function PlaygroundTable({
  setRenameModal,
  setShareModal,
  userCodeBaseData,
  getUserCodebase,
}: PlaygroundTableProp) {
  const saveFile = (
    javascriptCode: string,
    fileName: string,
    lang: "js" | "ts",
  ) => {
    const file = `${fileName}.${lang}`;
    const fileContent = javascriptCode;
    const blob = new Blob([fileContent], { type: "text/javascript" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = file;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const router = useRouter();
  const starButtonRef = useRef<HTMLButtonElement>(null);

  async function updateStar(
    e: React.MouseEvent<HTMLButtonElement>,
    val: 0 | 1,
    collectionId: string,
  ) {
    e.stopPropagation();
    if (starButtonRef.current) {
      starButtonRef.current.disabled = true;
      const id = toast.loading("Connecting you to Cloud, hold tight...");
      try {
        const codeCollectionRef = doc(db, "codebase", collectionId);
        await updateDoc(codeCollectionRef, {
          star: val === 1 ? 0 : 1,
        });
        toast.update(id, {
          render: `${val === 1 ? "Unstarred" : "Starred"} successfully!`,
          type: "success",
          isLoading: false,
          autoClose: 1000,
        });
        await getUserCodebase();
      } catch {
        toast.update(id, {
          render: "Oops! Something went wrong. Please try again..",
          type: "error",
          isLoading: false,
          autoClose: 1000,
        });
      }
      starButtonRef.current.disabled = false;
    }
  }

  return (
    <table className="w-full text-sm text-left rtl:text-right text-gray-500">
      <thead className="text-base text-white bg-headerBg sticky top-0 border-b-2 border-borderColor">
        <tr>
          <th scope="col" className="pl-6 py-3">
            Language
          </th>
          <th scope="col" className="px-6 py-3">
            File Name
          </th>
          <th scope="col" className="px-6 py-3">
            Last modified
          </th>
          <th scope="col" className="px-1 py-3">
            Action
          </th>
        </tr>
      </thead>
      <tbody>
        {userCodeBaseData.map((val) => {
          return (
            <tr
              className="border-b border-borderColor text-white hover:cursor-pointer"
              key={val.id}
              onClick={() => router.push(`/playground/${val.id}`)}
            >
              <th scope="row" className="pl-6 py-4">
                {val.language === "js" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 1052 1052"
                  >
                    <path fill="#f0db4f" d="M0 0h1052v1052H0z" />
                    <path
                      d="M965.9 801.1c-7.7-48-39-88.3-131.7-125.9-32.2-14.8-68.1-25.399-78.8-49.8-3.8-14.2-4.3-22.2-1.9-30.8 6.9-27.9 40.2-36.6 66.6-28.6 17 5.7 33.1 18.801 42.8 39.7 45.4-29.399 45.3-29.2 77-49.399-11.6-18-17.8-26.301-25.4-34-27.3-30.5-64.5-46.2-124-45-10.3 1.3-20.699 2.699-31 4-29.699 7.5-58 23.1-74.6 44-49.8 56.5-35.6 155.399 25 196.1 59.7 44.8 147.4 55 158.6 96.9 10.9 51.3-37.699 67.899-86 62-35.6-7.4-55.399-25.5-76.8-58.4-39.399 22.8-39.399 22.8-79.899 46.1 9.6 21 19.699 30.5 35.8 48.7 76.2 77.3 266.899 73.5 301.1-43.5 1.399-4.001 10.6-30.801 3.199-72.101zm-394-317.6h-98.4c0 85-.399 169.4-.399 254.4 0 54.1 2.8 103.7-6 118.9-14.4 29.899-51.7 26.2-68.7 20.399-17.3-8.5-26.1-20.6-36.3-37.699-2.8-4.9-4.9-8.7-5.601-9-26.699 16.3-53.3 32.699-80 49 13.301 27.3 32.9 51 58 66.399 37.5 22.5 87.9 29.4 140.601 17.3 34.3-10 63.899-30.699 79.399-62.199 22.4-41.3 17.6-91.3 17.4-146.6.5-90.2 0-180.4 0-270.9z"
                      fill="#323330"
                    />
                  </svg>
                ) : (
                  <svg
                    id="Layer_1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 400 400"
                    width="24"
                    height="24"
                  >
                    {" "}
                    <path
                      fill="#007acc"
                      className="st0"
                      d="M0 200V0h400v400H0"
                    />
                    <path
                      className="st1"
                      fill="#fff"
                      d="M87.7 200.7V217h52v148h36.9V217h52v-16c0-9 0-16.3-.4-16.5 0-.3-31.7-.4-70.2-.4l-70 .3v16.4l-.3-.1zM321.4 184c10.2 2.4 18 7 25 14.3 3.7 4 9.2 11 9.6 12.8 0 .6-17.3 12.3-27.8 18.8-.4.3-2-1.4-3.6-4-5.2-7.4-10.5-10.6-18.8-11.2-12-.8-20 5.5-20 16 0 3.2.6 5 1.8 7.6 2.7 5.5 7.7 8.8 23.2 15.6 28.6 12.3 41 20.4 48.5 32 8.5 13 10.4 33.4 4.7 48.7-6.4 16.7-22 28-44.3 31.7-7 1.2-23 1-30.5-.3-16-3-31.3-11-40.7-21.3-3.7-4-10.8-14.7-10.4-15.4l3.8-2.4 15-8.7 11.3-6.6 2.6 3.5c3.3 5.2 10.7 12.2 15 14.6 13 6.7 30.4 5.8 39-2 3.7-3.4 5.3-7 5.3-12 0-4.6-.7-6.7-3-10.2-3.2-4.4-9.6-8-27.6-16-20.7-8.8-29.5-14.4-37.7-23-4.7-5.2-9-13.3-11-20-1.5-5.8-2-20-.6-25.7 4.3-20 19.4-34 41-38 7-1.4 23.5-.8 30.4 1l-.2.2z"
                    />
                  </svg>
                )}
              </th>
              <td className="px-6 py-4">{`${val.fileName}.${val.language}`}</td>
              <td className="px-6 py-4">
                {val?.lastModifiedAt.toDate().toLocaleString()}
              </td>
              <td className="px-1 py-4 flex gap-4">
                <button
                  className="focus:outline-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShareModal({
                      collectionId: val.id,
                      prevShare: val.share,
                    });
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 -960 960 960"
                    width="20px"
                    fill="#FFFFFF"
                  >
                    <path d="M680-80q-50 0-85-35t-35-85q0-6 3-28L282-392q-16 15-37 23.5t-45 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q24 0 45 8.5t37 23.5l281-164q-2-7-2.5-13.5T560-760q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-24 0-45-8.5T598-672L317-508q2 7 2.5 13.5t.5 14.5q0 8-.5 14.5T317-452l281 164q16-15 37-23.5t45-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T720-200q0-17-11.5-28.5T680-240q-17 0-28.5 11.5T640-200q0 17 11.5 28.5T680-160ZM200-440q17 0 28.5-11.5T240-480q0-17-11.5-28.5T200-520q-17 0-28.5 11.5T160-480q0 17 11.5 28.5T200-440Zm480-280q17 0 28.5-11.5T720-760q0-17-11.5-28.5T680-800q-17 0-28.5 11.5T640-760q0 17 11.5 28.5T680-720Zm0 520ZM200-480Zm480-280Z" />
                  </svg>{" "}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    saveFile(val.code, val.fileName, val.language);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#FFFFFF"
                  >
                    <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setRenameModal({
                      prevTitle: val.fileName,
                      collectionId: val.id,
                    });
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#FFFFFF"
                  >
                    <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
                  </svg>
                </button>
                <button
                  ref={starButtonRef}
                  onClick={(e) => updateStar(e, val.star, val.id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill={val.star === 1 ? "#FDCC0D" : "#FFFFFF"}
                  >
                    <path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z" />
                  </svg>
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default PlaygroundTable;
