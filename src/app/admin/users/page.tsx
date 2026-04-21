import Link from "next/link";
import { RoleCode } from "@prisma/client";
import { requireAdminPageAccess } from "@/lib/admin-access";
import { listUsers } from "@/lib/services/users";
import { prisma } from "@/lib/prisma";
import { PageContainer } from "@/components/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { getRoleLabel } from "@/lib/presentation";
import { StatusBadge } from "@/components/status-badge";
import { UserStatusAction } from "@/components/forms/user-status-action";
import { UserRoleQuickAction } from "@/components/forms/user-role-quick-action";
import { UserForm } from "@/components/forms/user-form";

type AdminUsersPageProps = {
  searchParams?: Promise<{
    q?: string;
    roleCode?: "SUPER_ADMIN" | "ADMIN_ELEMENT" | "FLEET_MANAGER" | "ANALYST_OPERATIONS";
    companyId?: string;
    status?: "ACTIVE" | "INACTIVE";
    edit?: string;
  }>;
};

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
  const session = await requireAdminPageAccess();
  const filters = (await searchParams) ?? {};

  const [users, companies, editingUser] = await Promise.all([
    listUsers(
      {
        id: session.user.id,
        name: session.user.name,
        role: session.user.role as RoleCode
      },
      {
        q: filters.q,
        roleCode: filters.roleCode,
        companyId: filters.companyId,
        status: filters.status
      }
    ),
    prisma.company.findMany({
      orderBy: { name: "asc" }
    }),
    filters.edit
      ? prisma.user.findUnique({
          where: { id: filters.edit },
          include: {
            role: true
          }
        })
      : null
  ]);

  return (
    <PageContainer>
      <Card>
        <CardHeader>
          <CardTitle>Filtros y búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-5" action="/admin/users" method="GET">
            <Input name="q" defaultValue={filters.q ?? ""} placeholder="Buscar por nombre o correo" />
            <Select name="roleCode" defaultValue={filters.roleCode ?? ""}>
              <option value="">Todos los roles</option>
              <option value="SUPER_ADMIN">Superadministrador</option>
              <option value="ADMIN_ELEMENT">Admin Element</option>
              <option value="FLEET_MANAGER">Gestor de flota</option>
              <option value="ANALYST_OPERATIONS">Operaciones / Analista</option>
            </Select>
            <Select name="companyId" defaultValue={filters.companyId ?? ""}>
              <option value="">Todas las empresas</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </Select>
            <Select name="status" defaultValue={filters.status ?? ""}>
              <option value="">Todos los estados</option>
              <option value="ACTIVE">Activo</option>
              <option value="INACTIVE">Inactivo</option>
            </Select>
            <Button type="submit">Aplicar filtros</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Administración rápida de usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              rows={users}
              columns={[
                {
                  key: "user",
                  title: "Usuario",
                  render: (user) => (
                    <div>
                      <p className="font-semibold text-slate-900">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  )
                },
                {
                  key: "company",
                  title: "Empresa",
                  render: (user) => user.company?.name ?? "Corporativo"
                },
                {
                  key: "role",
                  title: "Privilegios",
                  render: (user) => (
                    <div className="space-y-2">
                      <Badge variant="outline">{getRoleLabel(user.role.code)}</Badge>
                      <UserRoleQuickAction
                        userId={user.id}
                        currentRole={user.role.code}
                        name={user.name}
                        email={user.email}
                        companyId={user.companyId}
                        status={user.status}
                      />
                    </div>
                  )
                },
                {
                  key: "status",
                  title: "Estado",
                  render: (user) => (
                    <div className="space-y-2">
                      <StatusBadge status={user.status} />
                      <UserStatusAction userId={user.id} active={user.status === "ACTIVE"} />
                    </div>
                  )
                },
                {
                  key: "edit",
                  title: "Editar",
                  render: (user) => (
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/admin/users?edit=${user.id}`}>Editar</Link>
                    </Button>
                  )
                }
              ]}
            />
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <UserForm mode="create" companies={companies} />
          {editingUser ? <UserForm mode="edit" user={editingUser} companies={companies} /> : null}
        </div>
      </div>
    </PageContainer>
  );
}
