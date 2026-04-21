import { UserStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { getStatusTone } from "@/lib/presentation";

export function StatusBadge({ status }: { status: UserStatus | "ACTIVE" | "INACTIVE" }) {
  return <Badge variant={getStatusTone(status)}>{status === "ACTIVE" ? "Activo" : "Inactivo"}</Badge>;
}
