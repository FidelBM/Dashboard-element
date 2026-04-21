import { ok, handleRouteError } from "@/lib/http";
import { requireApiAuth } from "@/lib/api/auth";
import { createReward, listRewards } from "@/lib/services/rewards";

export async function GET(request: Request) {
  try {
    await requireApiAuth();
    const { searchParams } = new URL(request.url);
    const rewards = await listRewards({
      companyId: searchParams.get("companyId") ?? undefined,
      categorySlug: searchParams.get("categorySlug") ?? undefined,
      tier: searchParams.get("tier") ?? undefined,
      onlyWorldCup: searchParams.get("onlyWorldCup") ?? undefined
    });

    return ok(rewards);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireApiAuth();
    const reward = await createReward(
      {
        id: session.user.id,
        name: session.user.name,
        role: session.user.role,
        companyId: session.user.companyId
      },
      await request.json()
    );

    return ok(reward, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
