import { ok, handleRouteError } from "@/lib/http";
import { requireApiAuth } from "@/lib/api/auth";
import { redeemReward } from "@/lib/services/rewards";

type Context = {
  params: Promise<{
    rewardId: string;
  }>;
};

export async function POST(request: Request, context: Context) {
  try {
    const session = await requireApiAuth();
    const { rewardId } = await context.params;
    const body = await request.json();
    const redemption = await redeemReward(
      {
        id: session.user.id,
        name: session.user.name,
        role: session.user.role,
        companyId: session.user.companyId
      },
      {
        ...body,
        rewardId
      }
    );

    return ok(redemption, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
