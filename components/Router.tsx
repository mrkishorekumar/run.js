"use client";

import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";

type ProtectedRouteProps = Record<string, unknown>;
type PublicRouteProps = Record<string, unknown>;

// TypeScript HOC for public routes
export function withPublic<P extends PublicRouteProps>(
  Component: React.ComponentType<P>,
) {
  return function WithPublic(props: P) {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (user === undefined) {
        setLoading(true);
      } else if (!user?.uid) {
        setLoading(false);
      } else if (user?.uid) {
        router.replace("/playground");
      }
    }, [user, router]);

    if (loading) {
      return <h1>Loading...</h1>;
    }

    return <Component {...props} />;
  };
}

// TypeScript HOC for protected routes - Done
export function withProtected<P extends ProtectedRouteProps>(
  Component: React.ComponentType<P>,
) {
  return function WithProtected(props: P) {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (user === undefined) {
        setLoading(true);
      } else if (!user?.uid) {
        router.replace("/login");
      } else if (user?.uid) {
        setLoading(false);
      }
    }, [user, router]);

    if (loading) {
      return <h1>Loading...</h1>;
    }

    return <Component {...props} />;
  };
}
