import { AppError } from "@/lib/errors";
import { ok, handleRouteError } from "@/lib/http";
import { requireApiAuth } from "@/lib/api/auth";
import { getFleetSummary } from "@/lib/services/fleet";

export async function GET(request: Request) {
  try {
    const session = await requireApiAuth();
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId") ?? session.user.companyId;
    if (!companyId) {
      throw new AppError("companyId is required", 400, "COMPANY_REQUIRED");
    }

    const data = await getFleetSummary(
      {
        id: session.user.id,
        name: session.user.name,
        role: session.user.role,
        companyId: session.user.companyId
      },
      companyId
    );

    return ok(data);
  } catch (error) {
    return handleRouteError(error);
  }
}
