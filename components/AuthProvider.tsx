"use client";

import { auth } from "@/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";

{
  /*
  undefined -> loading  
  null -> not loggedin
  User -> logged in
*/
}
type AuthContextType = {
  user: User | null | undefined;
};

const AuthContext = createContext<AuthContextType>({ user: null });

function AuthProvider({ children }: { children: JSX.Element }) {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) =>
      setUser(user || null),
    );

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}

export default AuthProvider;

export const useAuth = () => useContext(AuthContext);
