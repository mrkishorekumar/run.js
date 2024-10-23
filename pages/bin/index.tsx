import PlaygroundHeader from "@/components/PlaygroundHeader";
import { withProtected } from "@/components/Router";
import React, { useCallback, useEffect, useState } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { UserCodeBase } from "../playground";
import { getDocs, orderBy, query, where } from "firebase/firestore";
import { codeCollectionRef } from "@/firebase";
import { useAuth } from "@/components/AuthProvider";
import Loading from "@/components/Loading";
import { debounce } from "@/utils/commonFunction";
import DeletedTable from "@/components/DeletedTable";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

function Mybin() {
  const { user } = useAuth();
  const [userCodeBaseData, setUserCodeBaseData] = useState<UserCodeBase[]>([]);
  const [filterData, setFilterData] = useState<UserCodeBase[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState({
    name: "",
    id: "",
  });

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
          where("isDelete", "==", true),
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
          Recently Deleted
        </h1>
        <hr className="border-t border-borderColor" />
        <p className="mt-2 mb-5 text-left text-sm text-slate-300">
          Items in this bin will be permanently deleted once you choose to
          delete them forever!
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
                placeholder="Search with Filename, js/ts or Tag name."
                className="w-full bg-transparent outline-none ml-3 text-white"
                onChange={(e) => debouncedFilterSearchTerm(e.target.value)}
              />
            </div>
          </div>
        ) : null}
        <section
          className={`h-3/4 w-full bg-headerBg overflow-auto mt-2 rounded ${userCodeBaseData.length === 0 ? "mt-10" : ""}`}
        >
          <DeletedTable
            userCodeBaseData={userCodeBaseData}
            filterData={filterData}
            getUserCodebase={getUserCodebase}
            setConfirmDeleteModal={setConfirmDeleteModal}
          />
        </section>
      </main>
      <ConfirmDeleteModal
        getUserCodebase={getUserCodebase}
        info={confirmDeleteModal}
        close={() => setConfirmDeleteModal({ name: "", id: "" })}
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

export default withProtected(Mybin);
