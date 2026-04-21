import { ok, handleRouteError } from "@/lib/http";
import { requireApiAuth } from "@/lib/api/auth";
import { updateReward } from "@/lib/services/rewards";

type Context = {
  params: Promise<{
    rewardId: string;
  }>;
};

export async function PATCH(request: Request, context: Context) {
  try {
    const session = await requireApiAuth();
    const { rewardId } = await context.params;
    const reward = await updateReward(
      {
        id: session.user.id,
        name: session.user.name,
        role: session.user.role,
        companyId: session.user.companyId
      },
      rewardId,
      await request.json()
    );

    return ok(reward);
  } catch (error) {
    return handleRouteError(error);
  }
}
