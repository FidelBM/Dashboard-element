import { ok, handleRouteError } from "@/lib/http";
import { requireApiRole } from "@/lib/api/auth";
import { deactivateUser, updateUser } from "@/lib/services/users";

type Context = {
  params: Promise<{
    userId: string;
  }>;
};

export async function PATCH(request: Request, context: Context) {
  try {
    const session = await requireApiRole(["SUPER_ADMIN", "ADMIN_ELEMENT"]);
    const { userId } = await context.params;
    const body = await request.json();
    const user = await updateUser(
      {
        id: session.user.id,
        name: session.user.name,
        role: session.user.role
      },
      userId,
      body
    );

    return ok(user);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(_: Request, context: Context) {
  try {
    const session = await requireApiRole(["SUPER_ADMIN", "ADMIN_ELEMENT"]);
    const { userId } = await context.params;
    const user = await deactivateUser(
      {
        id: session.user.id,
        name: session.user.name,
        role: session.user.role
      },
      userId
    );

    return ok(user);
  } catch (error) {
    return handleRouteError(error);
  }
}
