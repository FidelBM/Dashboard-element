"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  return (
    <Button
      variant="outline"
      type="button"
      onClick={async () => {
        await fetch("/api/admin/users-access", {
          method: "DELETE"
        }).catch(() => null);
        void signOut({
          callbackUrl: "/login"
        });
      }}
    >
      Cerrar sesión
    </Button>
  );
}
