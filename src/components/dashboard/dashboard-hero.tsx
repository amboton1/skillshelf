import { ArrowUpRight, CirclePlus, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type {
  getDashboardStats,
  ResourceWithCategory,
} from "@/lib/data/resources";

type Stats = Awaited<ReturnType<typeof getDashboardStats>>;

interface DashboardHeroProps {
  userResources: ResourceWithCategory[];
  stats: Stats;
}

export function DashboardHero({ userResources, stats }: DashboardHeroProps) {
  const latestResource = userResources.at(userResources.length - 1);

  return (
    <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] md:p-8">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
            <Sparkles className="size-3.5" />
            Resource command center
          </div>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
            Welcome back — your dashboard is ready.
          </h2>
          <p className="mt-4 max-w-xl text-base text-slate-600 md:text-lg">
            See your latest uploads, measure engagement, and manage the
            resources your audience relies on.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="rounded-xl" variant="outline">
              <Link href="/library" target="_blank">
                View library
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:w-[360px] xl:grid-cols-1">
          <div className="rounded-[24px] bg-slate-950 p-5 text-white">
            <p className="text-sm text-white/70">Your library</p>
            <p className="mt-4 text-3xl font-bold">{userResources.length}</p>
            <p className="mt-2 text-sm text-white/75">
              {stats?.publishedCount ?? 0} published · {stats?.draftCount ?? 0}{" "}
              draft
              {(stats?.draftCount ?? 0) === 1 ? "" : "s"}
            </p>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Latest upload</p>
            {latestResource ? (
              <>
                <p className="mt-3 text-xl font-semibold text-slate-950">
                  {latestResource.title}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  {latestResource.category?.name ?? "Uncategorized"} ·{" "}
                  {latestResource.published ? "Published" : "Draft"}
                </p>
              </>
            ) : (
              <p className="mt-3 text-sm text-slate-500">No uploads yet.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
