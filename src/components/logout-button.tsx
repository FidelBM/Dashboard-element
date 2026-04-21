"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      type="button"
      onClick={async () => {
        await fetch("/api/admin/users-access", {
          method: "DELETE"
        }).catch(() => null);
        await signOut({
          redirect: false,
          callbackUrl: "/login"
        });
        router.push("/login");
        router.refresh();
      }}
    >
      Cerrar sesión
    </Button>
  );
}
