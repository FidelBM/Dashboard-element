import { ok, handleRouteError } from "@/lib/http";
import { requireApiRole } from "@/lib/api/auth";
import { listUsers, createUser } from "@/lib/services/users";

export async function GET(request: Request) {
  try {
    const session = await requireApiRole(["SUPER_ADMIN", "ADMIN_ELEMENT"]);
    const { searchParams } = new URL(request.url);
    const users = await listUsers(
      {
        id: session.user.id,
        name: session.user.name,
        role: session.user.role
      },
      {
        q: searchParams.get("q") ?? undefined,
        roleCode: searchParams.get("roleCode") ?? undefined,
        companyId: searchParams.get("companyId") ?? undefined,
        status: searchParams.get("status") ?? undefined
      }
    );

    return ok(users);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireApiRole(["SUPER_ADMIN", "ADMIN_ELEMENT"]);
    const body = await request.json();
    const user = await createUser(
      {
        id: session.user.id,
        name: session.user.name,
        role: session.user.role
      },
      body
    );

    return ok(user, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
