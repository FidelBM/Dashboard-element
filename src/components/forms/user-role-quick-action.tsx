"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

type RoleCode = "SUPER_ADMIN" | "ADMIN_ELEMENT" | "FLEET_MANAGER" | "ANALYST_OPERATIONS";

export function UserRoleQuickAction({
  userId,
  currentRole,
  name,
  email,
  companyId,
  status
}: {
  userId: string;
  currentRole: RoleCode;
  name: string;
  email: string;
  companyId?: string | null;
  status: "ACTIVE" | "INACTIVE";
}) {
  const router = useRouter();
  const [roleCode, setRoleCode] = useState<RoleCode>(currentRole);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2">
      <Select value={roleCode} onChange={(event) => setRoleCode(event.target.value as RoleCode)} className="h-9">
        <option value="SUPER_ADMIN">Superadministrador</option>
        <option value="ADMIN_ELEMENT">Admin Element</option>
        <option value="FLEET_MANAGER">Gestor de flota</option>
        <option value="ANALYST_OPERATIONS">Operaciones / Analista</option>
      </Select>
      <Button
        size="sm"
        disabled={isPending || roleCode === currentRole}
        onClick={() => {
          startTransition(async () => {
            await fetch(`/api/users/${userId}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                name,
                email,
                companyId: companyId ?? null,
                roleCode,
                status
              })
            });
            router.refresh();
          });
        }}
      >
        {isPending ? "Guardando..." : "Aplicar"}
      </Button>
    </div>
  );
}
