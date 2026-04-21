import { ok, handleRouteError } from "@/lib/http";
import { requireApiAuth } from "@/lib/api/auth";
import { updateCampaign } from "@/lib/services/campaigns";

type Context = {
  params: Promise<{
    campaignId: string;
  }>;
};

export async function PATCH(request: Request, context: Context) {
  try {
    const session = await requireApiAuth();
    const { campaignId } = await context.params;
    const campaign = await updateCampaign(
      {
        id: session.user.id,
        name: session.user.name,
        role: session.user.role
      },
      campaignId,
      await request.json()
    );

    return ok(campaign);
  } catch (error) {
    return handleRouteError(error);
  }
}
