import { FileText, Heart, ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { getDashboardStats } from "@/lib/data/resources";

type Stats = Awaited<ReturnType<typeof getDashboardStats>>;

interface StatsGridProps {
  stats: Stats;
}

export function StatsGrid({ stats }: StatsGridProps) {
  const overviewStats = [
    {
      label: "Published resources",
      value: String(stats?.publishedCount ?? 0),
      detail: `${stats?.draftCount ?? 0} draft${(stats?.draftCount ?? 0) === 1 ? "" : "s"} unpublished`,
      icon: FileText,
      tone: "from-violet-500/20 to-fuchsia-500/10 text-violet-700",
    },
    {
      label: "Total sales",
      value: String(stats?.totalSales ?? 0),
      detail: "Across all your resources",
      icon: ShoppingBag,
      tone: "from-emerald-500/20 to-teal-500/10 text-emerald-700",
    },
    {
      label: "Total likes",
      value: String(stats?.totalLikes ?? 0),
      detail: "From the community",
      icon: Heart,
      tone: "from-rose-500/20 to-pink-500/10 text-rose-700",
    },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-3">
      {overviewStats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card
            className="rounded-[24px] border-slate-200 bg-white py-5 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.4)]"
            key={stat.label}
          >
            <CardContent className="px-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <p className="mt-3 text-3xl font-bold text-slate-950">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">{stat.detail}</p>
                </div>
                <div
                  className={`rounded-2xl bg-gradient-to-br p-3 ${stat.tone}`}
                >
                  <Icon className="size-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
