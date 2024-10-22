import { db } from "@/firebase";
import { UserCodeBase } from "@/pages/playground";
import { doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useRef } from "react";
import { toast } from "react-toastify";

interface DeletedTableProps {
  userCodeBaseData: UserCodeBase[];
  filterData: UserCodeBase[];
  getUserCodebase: () => Promise<void>;
  setConfirmDeleteModal: React.Dispatch<
    React.SetStateAction<{
      name: string;
      id: string;
    }>
  >;
}

function DeletedTable({
  userCodeBaseData,
  filterData,
  getUserCodebase,
  setConfirmDeleteModal,
}: DeletedTableProps) {
  const router = useRouter();

  const restoreButtonRef = useRef<HTMLButtonElement>(null);

  async function restoreColeection(collectionId: string) {
    if (restoreButtonRef.current) {
      restoreButtonRef.current.disabled = true;
      const id = toast.loading("Connecting you to Cloud, hold tight...");
      try {
        const codeCollectionRef = doc(db, "codebase", collectionId);
        await updateDoc(codeCollectionRef, {
          isDelete: false,
        });
        await getUserCodebase();
        toast.update(id, {
          render: `Filen Restored successfully!`,
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
      restoreButtonRef.current.disabled = false;
    }
  }

  if (userCodeBaseData.length === 0) {
    return (
      <main className="w-full h-full flex flex-col justify-center items-center gap-7 pb-16">
        <h1 className="font-sans text-9xl mb-3 text text-white animate-slow-bounce">
          {"(;-;)"}
        </h1>
        <h1 className="font-sans font-bold text-xl text text-white">
          Nothing in the bin.
        </h1>
        <button
          className="bg-blueBtn flex items-center bg-blue-500 text-white p-2 rounded-md shadow gap-3"
          onClick={() => router.back()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#FFFFFF"
          >
            <path d="M182-200q-51 0-79-35.5T82-322l42-300q9-60 53.5-99T282-760h396q60 0 104.5 39t53.5 99l42 300q7 51-21 86.5T778-200q-21 0-39-7.5T706-230l-90-90H344l-90 90q-15 15-33 22.5t-39 7.5Zm16-86 114-114h336l114 114q2 2 16 6 11 0 17.5-6.5T800-304l-44-308q-4-29-26-48.5T678-680H282q-30 0-52 19.5T204-612l-44 308q-2 11 4.5 17.5T182-280q2 0 16-6Zm482-154q17 0 28.5-11.5T720-480q0-17-11.5-28.5T680-520q-17 0-28.5 11.5T640-480q0 17 11.5 28.5T680-440Zm-80-120q17 0 28.5-11.5T640-600q0-17-11.5-28.5T600-640q-17 0-28.5 11.5T560-600q0 17 11.5 28.5T600-560ZM310-440h60v-70h70v-60h-70v-70h-60v70h-70v60h70v70Zm170-40Z" />
          </svg>
          Go to Playground!
        </button>
      </main>
    );
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
        {filterData.map((val) => {
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
                  ref={restoreButtonRef}
                  className="focus:outline-none"
                  onClick={async (e) => {
                    e.stopPropagation();
                    await restoreColeection(val.id);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="30px"
                    viewBox="0 -960 960 960"
                    width="30px"
                    fill="#FFFFFF"
                  >
                    <path d="M440-320h80v-166l64 62 56-56-160-160-160 160 56 56 64-62v166ZM280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z" />
                  </svg>{" "}
                </button>
                <button
                  className="focus:outline-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmDeleteModal({ id: val.id, name: val.fileName });
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="30px"
                    viewBox="0 -960 960 960"
                    width="30px"
                    fill="#FFFFFF"
                  >
                    <path d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z" />
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

export default DeletedTable;
