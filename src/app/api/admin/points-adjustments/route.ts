import { ok, handleRouteError } from "@/lib/http";
import { requireApiRole } from "@/lib/api/auth";
import { applyManualPointsAdjustment } from "@/lib/services/points";

export async function POST(request: Request) {
  try {
    const session = await requireApiRole(["SUPER_ADMIN", "ADMIN_ELEMENT"]);
    const result = await applyManualPointsAdjustment(
      {
        id: session.user.id,
        name: session.user.name
      },
      await request.json()
    );

    return ok(result, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
