import { ok, handleRouteError } from "@/lib/http";
import { requireApiAuth } from "@/lib/api/auth";

export async function GET() {
  try {
    const session = await requireApiAuth();
    return ok(session.user);
  } catch (error) {
    return handleRouteError(error);
  }
}
