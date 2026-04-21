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

    const [transactions, purchases] = await Promise.all([
      prisma.pointTransaction.findMany({
        where: { companyId },
        orderBy: { createdAt: "desc" },
        take: 20
      }),
      prisma.purchase.findMany({
        where: { companyId },
        orderBy: { purchasedAt: "desc" },
        take: 20
      })
    ]);

    return ok({
      transactions,
      purchases
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
