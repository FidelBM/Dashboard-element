import { PageContainer } from "@/components/page-container";
import { LoadingSkeleton } from "@/components/loading-skeleton";

export default function DashboardLoading() {
  return (
    <PageContainer>
      <LoadingSkeleton className="h-72 w-full" />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <LoadingSkeleton className="h-40" />
        <LoadingSkeleton className="h-40" />
        <LoadingSkeleton className="h-40" />
        <LoadingSkeleton className="h-40" />
      </div>
    </PageContainer>
  );
}
