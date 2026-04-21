import { ok, handleRouteError } from "@/lib/http";
import { requireApiAuth } from "@/lib/api/auth";
import { getDashboardSummary } from "@/lib/services/dashboard";

export async function GET(request: Request) {
  try {
    const session = await requireApiAuth();
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId") ?? undefined;
    const data = await getDashboardSummary(
      {
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
