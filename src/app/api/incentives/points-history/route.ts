import { AppError } from "@/lib/errors";
import { ok, handleRouteError } from "@/lib/http";
import { requireApiCompanyAccess } from "@/lib/api/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId");
    if (!companyId) {
      throw new AppError("companyId is required", 400, "COMPANY_REQUIRED");
    }

    await requireApiCompanyAccess(companyId);
    const history = await prisma.pointTransaction.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" }
    });

    return ok(history);
  } catch (error) {
    return handleRouteError(error);
  }
}
