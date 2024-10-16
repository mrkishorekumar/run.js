"use client";

import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import Loading from "./Loading";

export const loadingMessages = [
  "Loading, please wait...",
  "Hang tight! We're fetching your data.",
  "Just a moment! We're getting things ready for you.",
  "Please wait a moment while we load your content.",
  "Almost there! We're preparing everything you need.",
  "Loading your experience...",
  "Hang in there! Just a few seconds more...",
  "We're working on it! Your content will be here shortly.",
  "Loading... Good things come to those who wait!",
  "Fetching data... This won't take long!",
];

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
    const [loadingMessage, setLoadingMessage] = useState("");

    useEffect(() => {
      const randomMessage =
        loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
      setLoadingMessage(randomMessage);

      if (user === undefined) {
        setLoading(true);
      } else if (!user?.uid) {
        setLoading(false);
      } else if (user?.uid) {
        router.replace("/playground");
      }
    }, [user, router]);

    if (loading) {
      return <Loading randomMessage={loadingMessage} />;
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
    const [loadingMessage, setLoadingMessage] = useState("");

    useEffect(() => {
      const randomMessage =
        loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
      setLoadingMessage(randomMessage);

      if (user === undefined) {
        setLoading(true);
      } else if (!user?.uid) {
        router.replace("/login");
      } else if (user?.uid) {
        setLoading(false);
      }
    }, [user, router]);

    if (loading) {
      return <Loading randomMessage={loadingMessage} />;
    }

    return <Component {...props} />;
  };
}
