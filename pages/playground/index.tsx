import { useAuth } from "@/components/AuthProvider";
import CreateNewPlayground from "@/components/CreateNewPlayground";
import DeleteModal from "@/components/DeleteModal";
import Loading from "@/components/Loading";
import PlaygroundHeader from "@/components/PlaygroundHeader";
import PlaygroundTable from "@/components/PlaygroundTable";
import RenameModal from "@/components/RenameModal";
import { withProtected } from "@/components/Router";
import SharePlaygroundModal from "@/components/SharePlaygroundModal";
import { codeCollectionRef } from "@/firebase";
import { debounce } from "@/utils/commonFunction";
import firebase from "firebase/compat/app";
import { getDocs, orderBy, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";

export interface UserCodeBase {
  id: string;
  code: string;
  createdAt: firebase.firestore.Timestamp;
  fileName: string;
  isDelete: boolean;
  language: "js" | "ts";
  lastModifiedAt: firebase.firestore.Timestamp;
  share: 0 | 1;
  star: 0 | 1;
  userId: string;
}

function Playgrounds() {
  const router = useRouter();
  const [renameModal, setRenameModal] = useState({
    prevTitle: "",
    collectionId: "",
  });
  const [shareModal, setShareModal] = useState<{
    prevShare: 0 | 1;
    collectionId: string;
  }>({
    prevShare: 0,
    collectionId: "",
  });
  const [createNewModal, setCreateNewModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState("");
  const [userCodeBaseData, setUserCodeBaseData] = useState<UserCodeBase[]>([]);
  const [filterData, setFilterData] = useState<UserCodeBase[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const debouncedFilterSearchTerm = debounce((searchTerm: string) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    const searchResult = userCodeBaseData.filter(
      (val) =>
        val.fileName.toLowerCase().includes(lowerCaseSearchTerm) ||
        val.language.includes(lowerCaseSearchTerm),
    );

    setFilterData(searchResult.length > 0 ? searchResult : userCodeBaseData);
  }, 300);

  const getUserCodebase = useCallback(async () => {
    const id = toast.loading("Connecting to your Server, hold tight...");
    try {
      const data = await getDocs(
        query(
          codeCollectionRef,
          where("userId", "==", user?.uid),
          where("isDelete", "==", false),
          orderBy("lastModifiedAt", "desc"),
        ),
      );
      /* eslint-disable  @typescript-eslint/no-explicit-any */
      const result: UserCodeBase[] = data.docs.map((doc: any) => {
        return { ...doc.data(), id: doc.id };
      });

      setUserCodeBaseData(result);
      setFilterData(result);

      toast.update(id, {
        render: "Playground Fetched successfully!",
        type: "success",
        isLoading: false,
        autoClose: 1000,
      });
    } catch (error) {
      console.log(error);
      toast.update(id, {
        render: "Oops! Something went wrong. Please try again..",
        type: "error",
        isLoading: false,
        autoClose: 1000,
      });
    }
  }, [user?.uid]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      await getUserCodebase();
      setLoading(false);
    }
    loadData();
  }, [getUserCodebase]);

  if (loading)
    return (
      <Loading
        randomMessage={
          "We're working on it! Your content will be here shortly."
        }
      />
    );

  return (
    <>
      <PlaygroundHeader fullScreen={false} />
      <main className="py-4 px-14 bg-navbarBg h-88vh w-full">
        <h1 className="text-2xl font-bold text-left text-white mb-2 uppercase">
          Create playgrounds
        </h1>
        <hr className="border-t border-borderColor" />
        <p className="mt-2 mb-5 text-left text-sm text-slate-300">
          Coding playgrounds on RunJs are powered by VS Code IDE and start
          within a few seconds. Practice coding while learning for free.
        </p>
        {userCodeBaseData.length > 0 ? (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center w-1/2 bg-headerBg p-2 rounded-md shadow">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#FFFFFF"
              >
                <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
              </svg>
              <input
                type="text"
                placeholder="Search files"
                className="w-full bg-transparent outline-none ml-3 text-white"
                onChange={(e) => debouncedFilterSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <button
                className="bg-headerBg flex items-center bg-blue-500 text-white p-2 rounded-md shadow gap-3"
                onClick={() => router.push("bin")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#FFFFFF"
                >
                  <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                </svg>
                Recently Deleted
              </button>
              <button
                className="bg-blueBtn flex items-center bg-blue-500 text-white p-2 rounded-md shadow gap-3"
                onClick={() => setCreateNewModal(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#FFFFFF"
                >
                  <path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                </svg>
                Create Playground!
              </button>
            </div>
          </div>
        ) : null}
        <section
          className={`h-3/4 w-full bg-headerBg overflow-auto mt-2 rounded ${userCodeBaseData.length === 0 ? "mt-10" : ""}`}
        >
          <PlaygroundTable
            setRenameModal={setRenameModal}
            setShareModal={setShareModal}
            userCodeBaseData={filterData}
            getUserCodebase={getUserCodebase}
            setCreateNewModal={setCreateNewModal}
            setDeleteModal={setDeleteModal}
          />
        </section>
      </main>
      <RenameModal
        isModalOpen={renameModal.prevTitle.length > 0}
        info={renameModal}
        close={() => setRenameModal({ prevTitle: "", collectionId: "" })}
        getUserCodebase={getUserCodebase}
      />
      <SharePlaygroundModal
        isModalOpen={shareModal.collectionId.length > 0}
        info={shareModal}
        close={() => setShareModal({ prevShare: 0, collectionId: "" })}
        getUserCodebase={getUserCodebase}
      />
      <CreateNewPlayground
        close={() => setCreateNewModal(false)}
        isModalOpen={createNewModal}
      />
      <DeleteModal
        close={() => setDeleteModal("")}
        isModalOpen={deleteModal}
        getUserCodebase={getUserCodebase}
      />
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
    </>
  );
}

export default withProtected(Playgrounds);
