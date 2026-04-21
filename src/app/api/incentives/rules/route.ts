import { ok, handleRouteError } from "@/lib/http";
import { requireApiAuth } from "@/lib/api/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await requireApiAuth();
    const rules = await prisma.incentiveRule.findMany({
      where: { active: true },
      orderBy: { createdAt: "asc" }
    });

    return ok(rules);
  } catch (error) {
    return handleRouteError(error);
  }
}
