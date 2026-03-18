import { ChartColumn } from "lucide-react";
import {
  CategoryBreakdownChart,
  LikesByResourceChart,
  PublishedVsDraftChart,
  SalesByResourceChart,
} from "@/components/dashboard/analytics-charts";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { getAnalyticsData } from "@/lib/data/resources";
import { stackServerApp } from "@/stack/server";

export default async function AnalyticsPage() {
  await stackServerApp.getUser({ or: "redirect" });
  const data = await getAnalyticsData();

  return (
    <main className="min-h-[calc(100vh-56px)] bg-[#f4f4f5] py-6 md:py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 md:px-6 lg:flex-row lg:px-8">
        <DashboardSidebar />

        <div className="flex-1 space-y-6">
          <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] md:p-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
              <ChartColumn className="size-3.5" />
              Analytics
            </div>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-950">
              How your library is performing.
            </h2>
            <p className="mt-3 max-w-xl text-base text-slate-500">
              A breakdown of likes, sales, and how your resources are
              distributed across categories.
            </p>
          </section>

          {data ? (
            <div className="grid gap-6 md:grid-cols-2">
              <LikesByResourceChart data={data.likesByResource} />
              <CategoryBreakdownChart data={data.categoryBreakdown} />
              <PublishedVsDraftChart data={data.publishedVsDraft} />
              <SalesByResourceChart data={data.salesByResource} />
            </div>
          ) : (
            <div className="rounded-[24px] border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.4)]">
              Could not load analytics. Please try again.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
