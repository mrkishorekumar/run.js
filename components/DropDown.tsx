import React, { memo, useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthProvider";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { usePathname } from "next/navigation";
import Image from "next/image";

function DropDown() {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const pathname = usePathname();

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  function handleLogOut() {
    signOut(auth).then(function () {
      router.push("/login");
    });
  }

  const dropDownList = [
    {
      title: "Start Coding",
      className: "block px-4 py-2 text-base text-white",
      href: "/",
      onClick: () => {},
      show: pathname !== "/",
    },
    {
      title: "Playground",
      className: "block px-4 py-2 text-base text-white",
      href: "/playground",
      onClick: () => {},
      show: pathname !== "/playground",
    },
    {
      title: "Logout",
      className: "block px-4 py-2 text-base text-white",
      href: "",
      onClick: () => handleLogOut(),
      show: true,
    },
    {
      title: "Privacy Policy",
      className: "block px-4 py-2 text-base text-white",
      href: "/privacy-policy",
      onClick: () => {},
      show: pathname !== "/privacy-policy",
    },
    {
      title: "Terms & Conditions",
      className: "block px-4 py-2 text-base text-white",
      href: "/terms-of-use",
      onClick: () => {},
      show: pathname !== "/terms-of-use",
    },
  ];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center focus:outline-none"
      >
        <Image
          width={40}
          height={40}
          src={user?.photoURL || ""}
          alt="Profile"
          className="rounded-full object-fill"
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 w-44 mt-2 origin-top-right bg-borderColor rounded-md shadow-lg">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {dropDownList.map((val, index) => {
              if (val.show) {
                return val.href === "" ? (
                  <button
                    key={index}
                    className={val.className}
                    onClick={val.onClick}
                  >
                    {val.title}
                  </button>
                ) : (
                  <Link
                    onClick={val.onClick}
                    key={index}
                    href={val.href}
                    className={val.className}
                  >
                    {val.title}
                  </Link>
                );
              }
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(DropDown);
