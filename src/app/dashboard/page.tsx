import { DashboardHero } from "@/components/dashboard/dashboard-hero";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { LibraryOverviewCard } from "@/components/dashboard/library-overview-card";
import { ResourcesList } from "@/components/dashboard/resources-list";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { UploadResourceCard } from "@/components/dashboard/upload-resource-card";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCategories } from "@/lib/data/categories";
import { getDashboardStats, getUsersResources } from "@/lib/data/resources";
import { stackServerApp } from "@/stack/server";

export default async function DashboardPage() {
  await stackServerApp.getUser({ or: "redirect" });
  const [userResources, stats, categories] = await Promise.all([
    getUsersResources(),
    getDashboardStats(),
    getCategories(),
  ]);

  return (
    <main className="min-h-[calc(100vh-56px)] bg-[#f4f4f5] py-6 md:py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 md:px-6 lg:flex-row lg:px-8">
        <DashboardSidebar />

        <div className="flex-1 space-y-6">
          <DashboardHero userResources={userResources} stats={stats} />
          <StatsGrid stats={stats} />

          <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <ResourcesList userResources={userResources} />

            <div className="space-y-6">
              <Card className="rounded-[28px] border-slate-200 bg-slate-950 py-6 text-white shadow-[0_20px_60px_-40px_rgba(15,23,42,0.7)]">
                <CardHeader className="px-6">
                  <CardTitle className="text-xl">Upload new resource</CardTitle>
                  <CardDescription className="text-slate-400">
                    Share a PDF, template, UI kit, snippet, or study guide.
                  </CardDescription>
                </CardHeader>
                <UploadResourceCard categories={categories} />
              </Card>

              <LibraryOverviewCard stats={stats} />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
