import { signInWithGooglePopup } from "@/firebase";
import Link from "next/link";
import React from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";

function Login() {
  const handleGoogleLogin = async () => {
    const id = toast.loading("Connecting to Google, hold tight...");
    try {
      await signInWithGooglePopup();
      toast.update(id, {
        render: "Login successful! Enjoy your experience.",
        type: "success",
        isLoading: false,
      });
    } catch {
      toast.update(id, {
        render: "Login failed. Please check your credentials and try again.",
        type: "error",
        isLoading: false,
      });
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-navbarBg select-none">
        <div className="bg-headerBg p-8 rounded-lg shadow-lg flex flex-col justify-center items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="80px"
            viewBox="0 -960 960 960"
            width="80px"
            fill="#FFFFFF"
          >
            <path d="M80-200v-61h800v61H80Zm38-254-40-22 40-68H40v-45h78l-40-68 40-22 38 67 38-67 40 22-40 68h78v45h-78l40 68-40 22-38-67-38 67Zm324 0-40-24 40-68h-78v-45h78l-40-68 40-22 38 67 38-67 40 22-40 68h78v45h-78l40 68-40 24-38-67-38 67Zm324 0-40-24 40-68h-78v-45h78l-40-68 40-22 38 67 38-67 40 22-40 68h78v45h-78l40 68-40 24-38-67-38 67Z" />
          </svg>
          <h1 className="text-2xl font-bold text-center mb-6 text-white">
            Log in or sign up
          </h1>
          <div className="flex justify-center">
            <div className="px-6 sm:px-0 max-w-sm">
              <button
                onClick={handleGoogleLogin}
                type="button"
                className="text-white w-full  bg-blueBtn focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between mr-2 mb-2"
              >
                <svg
                  className="mr-2 -ml-1 w-4 h-4"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fab"
                  data-icon="google"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 488 512"
                >
                  <path
                    fill="currentColor"
                    d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                  ></path>
                </svg>
                Sign up with Google<div></div>
              </button>
            </div>
          </div>
          <p className="mt-4 text-center text-sm text-gray-600">
            We do not use any data from your Google account.
          </p>
          <div className="mt-4 text-center text-sm text-gray-500">
            <Link href="/terms-of-use" className="hover:underline">
              Terms and Conditions
            </Link>{" "}
            |
            <Link href="/privacy-policy" className="hover:underline">
              {" "}
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
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

export default Login;
