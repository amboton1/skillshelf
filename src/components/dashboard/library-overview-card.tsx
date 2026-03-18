import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { getDashboardStats } from "@/lib/data/resources";

type Stats = Awaited<ReturnType<typeof getDashboardStats>>;

interface LibraryOverviewCardProps {
  stats: Stats;
}

export function LibraryOverviewCard({ stats }: LibraryOverviewCardProps) {
  return (
    <Card className="rounded-[28px] border-slate-200 bg-white shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)]">
      <CardHeader className="px-6">
        <CardTitle className="text-xl text-slate-950">Overview</CardTitle>
        <CardDescription className="text-slate-600">
          A quick snapshot of your library.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 px-6">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Most liked</p>
          {stats?.mostLikedResource ? (
            <>
              <p className="mt-1 font-semibold text-slate-950">
                {stats.mostLikedResource.title}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {stats.mostLikedResource.likes} like
                {stats.mostLikedResource.likes === 1 ? "" : "s"} from the
                community.
              </p>
            </>
          ) : (
            <p className="mt-1 text-sm text-slate-600">
              No likes yet — keep sharing!
            </p>
          )}
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Drafts</p>
          <p className="mt-1 font-semibold text-slate-950">
            {stats?.draftCount ?? 0} unpublished resource
            {(stats?.draftCount ?? 0) === 1 ? "" : "s"}
          </p>
          <p className="mt-1 text-sm text-slate-600">
            {(stats?.draftCount ?? 0) > 0
              ? "Ready to publish? Review and go live."
              : "All your resources are published."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
