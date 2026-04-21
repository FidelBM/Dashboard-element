import Link from "next/link";
import { RoleCode } from "@prisma/client";
import { requireRole } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { listUsers } from "@/lib/services/users";
import { PageContainer } from "@/components/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { UserForm } from "@/components/forms/user-form";
import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { getRoleLabel } from "@/lib/presentation";
import { UserStatusAction } from "@/components/forms/user-status-action";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

type UsersPageProps = {
  searchParams?: Promise<{
    q?: string;
    roleCode?: string;
    companyId?: string;
    status?: string;
  }>;
};

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const session = await requireRole([RoleCode.SUPER_ADMIN, RoleCode.ADMIN_ELEMENT]);
  const filters = await searchParams;
  const [users, companies] = await Promise.all([
    listUsers(
      {
        id: session.user.id,
        name: session.user.name,
        role: session.user.role
      },
      {
        q: filters?.q || undefined,
        roleCode: filters?.roleCode || undefined,
        companyId: filters?.companyId || undefined,
        status: filters?.status || undefined
      }
    ),
    prisma.company.findMany({
      orderBy: { name: "asc" }
    })
  ]);

  return (
    <PageContainer>
      <Card>
        <CardHeader>
          <CardTitle>Filtros de usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-5">
            <Input name="q" defaultValue={filters?.q ?? ""} placeholder="Buscar por nombre o correo" />
            <Select name="roleCode" defaultValue={filters?.roleCode ?? ""}>
              <option value="">Todos los roles</option>
              <option value="SUPER_ADMIN">Superadministrador</option>
              <option value="ADMIN_ELEMENT">Admin Element</option>
              <option value="FLEET_MANAGER">Gestor de flota</option>
              <option value="ANALYST_OPERATIONS">Operaciones / Analista</option>
            </Select>
            <Select name="companyId" defaultValue={filters?.companyId ?? ""}>
              <option value="">Todas las empresas</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </Select>
            <Select name="status" defaultValue={filters?.status ?? ""}>
              <option value="">Todos los estados</option>
              <option value="ACTIVE">Activos</option>
              <option value="INACTIVE">Inactivos</option>
            </Select>
            <Button type="submit">Aplicar filtros</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Usuarios del sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              rows={users}
              columns={[
                {
                  key: "name",
                  title: "Usuario",
                  render: (user) => (
                    <div>
                      <p className="font-semibold text-slate-900">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  )
                },
                {
                  key: "role",
                  title: "Rol",
                  render: (user) => <Badge variant="outline">{getRoleLabel(user.role.code)}</Badge>
                },
                {
                  key: "company",
                  title: "Empresa",
                  render: (user) => user.company?.name ?? "Corporativo"
                },
                {
                  key: "status",
                  title: "Estado",
                  render: (user) => <StatusBadge status={user.status} />
                },
                {
                  key: "actions",
                  title: "Acciones",
                  render: (user) => (
                    <div className="flex items-center gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/users/${user.id}`}>Editar</Link>
                      </Button>
                      <UserStatusAction userId={user.id} active={user.status === "ACTIVE"} />
                    </div>
                  )
                }
              ]}
            />
          </CardContent>
        </Card>

        <UserForm mode="create" companies={companies} />
      </div>
    </PageContainer>
  );
}
