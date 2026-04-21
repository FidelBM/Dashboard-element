import { PageContainer } from "@/components/page-container";
import { AdminUsersAccessForm } from "@/components/admin-users-access-form";

export default function AdminUsersAccessPage() {
  return (
    <PageContainer className="min-h-[70vh] items-center justify-center">
      <AdminUsersAccessForm />
    </PageContainer>
  );
}
