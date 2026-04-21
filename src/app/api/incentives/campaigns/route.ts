import { ok, handleRouteError } from "@/lib/http";
import { requireApiAuth } from "@/lib/api/auth";
import { createCampaign, listActiveCampaigns } from "@/lib/services/campaigns";

export async function GET(request: Request) {
  try {
    await requireApiAuth();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") as "STANDARD" | "WORLD_CUP" | null;
    const campaigns = await listActiveCampaigns(type ?? undefined);
    return ok(campaigns);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireApiAuth();
    const campaign = await createCampaign(
      {
        id: session.user.id,
        name: session.user.name,
        role: session.user.role
      },
      await request.json()
    );

    return ok(campaign, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
