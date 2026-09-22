"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import AdminSidebar from "@/components/AdminSidebar";

const AUTH_URL =
  "http://localhost:5000/api/auth";

export default function AdminAuthShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname =
    usePathname();

  const router =
    useRouter();

  const [
    checking,
    setChecking,
  ] = useState(true);

  const isLoginPage =
    pathname ===
    "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setChecking(false);
      return;
    }

    let active = true;

    async function checkAdmin() {
      try {
        const response =
          await fetch(
            `${AUTH_URL}/me`,
            {
              credentials:
                "include",
              cache:
                "no-store",
            }
          );

        if (!response.ok) {
          if (active) {
            router.replace(
              "/admin/login"
            );
          }

          return;
        }

        if (active) {
          setChecking(false);
        }
      } catch {
        if (active) {
          router.replace(
            "/admin/login"
          );
        }
      }
    }

    checkAdmin();

    return () => {
      active = false;
    };
  }, [
    isLoginPage,
    router,
  ]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-green-700" />

          <p className="mt-4 text-sm text-gray-500">
            Checking admin
            access...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />

      <div className="lg:pl-72">
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}