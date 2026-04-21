import { ok, handleRouteError } from "@/lib/http";
import { requireApiAuth } from "@/lib/api/auth";
import { createPurchase, listPurchases } from "@/lib/services/fleet";

export async function GET(request: Request) {
  try {
    const session = await requireApiAuth();
    const { searchParams } = new URL(request.url);
    const purchases = await listPurchases(
      {
        id: session.user.id,
        name: session.user.name,
        role: session.user.role,
        companyId: session.user.companyId
      },
      {
        companyId: searchParams.get("companyId") ?? undefined
      }
    );

    return ok(purchases);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireApiAuth();
    const purchase = await createPurchase(
      {
        id: session.user.id,
        name: session.user.name,
        role: session.user.role,
        companyId: session.user.companyId
      },
      await request.json()
    );

    return ok(purchase, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
