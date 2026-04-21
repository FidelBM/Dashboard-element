import { DefaultSession } from "next-auth";
import { RoleCode, UserStatus } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: RoleCode;
      companyId?: string | null;
      status: UserStatus;
    };
  }

  interface User {
    id: string;
    role: RoleCode;
    companyId?: string | null;
    status: UserStatus;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: RoleCode;
    companyId?: string | null;
    status: UserStatus;
  }
}
