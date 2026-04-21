import Link from "next/link";
import { RoleCode } from "@prisma/client";
import { requireRole } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { PageContainer } from "@/components/page-container";
import { UserForm } from "@/components/forms/user-form";
import { Button } from "@/components/ui/button";

type EditUserPageProps = {
  params: Promise<{
    userId: string;
  }>;
};

export default async function EditUserPage({ params }: EditUserPageProps) {
  await requireRole([RoleCode.SUPER_ADMIN, RoleCode.ADMIN_ELEMENT]);
  const { userId } = await params;

  const [user, companies] = await Promise.all([
    prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: {
        role: true
      }
    }),
    prisma.company.findMany({
      orderBy: { name: "asc" }
    })
  ]);

  return (
    <PageContainer>
      <div className="flex justify-end">
        <Button asChild variant="outline">
          <Link href="/users">Volver a usuarios</Link>
        </Button>
      </div>
      <UserForm mode="edit" user={user} companies={companies} />
    </PageContainer>
  );
}
