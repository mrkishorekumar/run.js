import PlaygroundHeader from "@/components/PlaygroundHeader";
import PlaygroundTable from "@/components/PlaygroundTable";
import RenameModal from "@/components/RenameModal";
import { withProtected } from "@/components/Router";
import React, { useState } from "react";

function Playgrounds() {
  const [renameModal, setRenameModal] = useState("");

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
            />
          </div>
          <button className="bg-blueBtn flex items-center bg-blue-500 text-white p-2 rounded-md shadow gap-3">
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
        <section className="h-3/4 w-full bg-headerBg overflow-auto mt-2 rounded">
          <PlaygroundTable setRenameModal={setRenameModal} />
        </section>
      </main>
      <RenameModal
        isModalOpen={renameModal.length > 0}
        currentTitle={renameModal}
        close={() => setRenameModal("")}
      />
    </>
  );
}

export default withProtected(Playgrounds);
