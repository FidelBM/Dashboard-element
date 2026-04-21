"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";

export function UserStatusAction({
  userId,
  active
}: {
  userId: string;
  active: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      size="sm"
      variant={active ? "outline" : "secondary"}
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await fetch(`/api/users/${userId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              status: active ? "INACTIVE" : "ACTIVE"
            })
          });
          router.refresh();
        });
      }}
    >
      {isPending ? "Procesando..." : active ? "Desactivar" : "Activar"}
    </Button>
  );
}
