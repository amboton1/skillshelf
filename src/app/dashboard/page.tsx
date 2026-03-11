import {
  ArrowUpRight,
  Bell,
  ChartColumn,
  CirclePlus,
  Clock3,
  FileText,
  FolderOpen,
  HardDriveUpload,
  LayoutDashboard,
  Search,
  Settings,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getUsersResources } from "@/lib/data/resources";
import { stackServerApp } from "@/stack/server";

const sidebarItems = [
  { label: "Overview", icon: LayoutDashboard, active: true },
  { label: "My Resources", icon: FolderOpen },
  { label: "Uploads", icon: HardDriveUpload },
  { label: "Analytics", icon: ChartColumn },
  { label: "Saved", icon: Star },
  { label: "Settings", icon: Settings },
];

const overviewStats = [
  {
    label: "Resources shared",
    value: "24",
    detail: "+3 this week",
    icon: FileText,
    tone: "from-violet-500/20 to-fuchsia-500/10 text-violet-700",
  },
  {
    label: "Total downloads",
    value: "1.2K",
    detail: "+18% growth",
    icon: TrendingUp,
    tone: "from-emerald-500/20 to-teal-500/10 text-emerald-700",
  },
  {
    label: "Pending reviews",
    value: "06",
    detail: "2 need updates",
    icon: Clock3,
    tone: "from-amber-500/20 to-orange-500/10 text-amber-700",
  },
];

const quickActions = [
  "Upload a new resource",
  "Edit resource details",
  "Review download analytics",
];

export default async function DashboardPage() {
  await stackServerApp.getUser({ or: "redirect" });
  const userResources = await getUsersResources();

  return (
    <main className="min-h-[calc(100vh-56px)] bg-[#f4f4f5] py-6 md:py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 md:px-6 lg:flex-row lg:px-8">
        <aside className="w-full lg:sticky lg:top-24 lg:h-fit lg:w-72 lg:shrink-0">
          <div className="rounded-[28px] border border-slate-100 bg-white p-5 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)]">
            <div className="rounded-[24px] bg-slate-950 p-5 text-white">
              <p className="text-xs uppercase tracking-[0.25em] text-white/60">
                Creator dashboard
              </p>
              <h1 className="mt-3 text-2xl font-semibold leading-tight">
                Manage everything you share on SkillShelf.
              </h1>
              <p className="mt-2 text-sm text-white/75">
                Upload resources, track performance, and keep your library
                organised in one place.
              </p>
            </div>

            <nav className="mt-6 space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition ${
                      item.active
                        ? "bg-slate-950 text-white"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                    }`}
                    key={item.label}
                    type="button"
                  >
                    <Icon className="size-4" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <Card className="mt-6 gap-3 rounded-[24px] border-slate-200 bg-slate-50 py-5 shadow-none">
              <CardHeader className="px-5">
                <CardTitle className="text-base text-slate-950">
                  Quick actions
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Everything you need to keep your resources fresh.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-5">
                <div className="space-y-2">
                  {quickActions.map((action) => (
                    <div
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
                      key={action}
                    >
                      {action}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </aside>

        <div className="flex-1 space-y-6">
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
                  <Button className="rounded-xl bg-slate-950 text-white hover:bg-slate-800">
                    <CirclePlus className="size-4" />
                    Upload resource
                  </Button>
                  <Button className="rounded-xl" variant="outline">
                    View library
                    <ArrowUpRight className="size-4" />
                  </Button>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2 xl:w-[360px] xl:grid-cols-1">
                <div className="rounded-[24px] bg-slate-950 p-5 text-white">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/70">This month</span>
                    <Bell className="size-4 text-white/70" />
                  </div>
                  <p className="mt-4 text-3xl font-bold">84%</p>
                  <p className="mt-2 text-sm text-white/75">
                    of your resources received views or downloads this month.
                  </p>
                </div>
                <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Latest upload</p>
                  <p className="mt-3 text-xl font-semibold text-slate-950">
                    Design System Starter Kit
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    Uploaded 2 days ago · 47 new downloads
                  </p>
                </div>
              </div>
            </div>
          </section>

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
                        <p className="mt-2 text-sm text-slate-600">
                          {stat.detail}
                        </p>
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

          <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <Card className="rounded-[28px] border-slate-200 bg-white shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)]">
              <CardHeader className="px-6 md:px-7">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle className="text-2xl text-slate-950">
                      Your resources
                    </CardTitle>
                    <CardDescription className="mt-2 text-slate-600">
                      Review published items, drafts, and uploads waiting for
                      approval.
                    </CardDescription>
                  </div>

                  <div className="relative w-full md:max-w-sm">
                    <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      className="rounded-xl border-slate-200 bg-slate-50 pl-9"
                      placeholder="Search your resources"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 px-6 md:px-7">
                {userResources.length > 0 ? (
                  userResources.map((resource) => (
                    <div
                      className="flex flex-col gap-4 rounded-[24px] border border-slate-200 bg-slate-50 p-5 md:flex-row md:items-center md:justify-between"
                      key={resource.id}
                    >
                      <div>
                        <h3 className="text-lg font-semibold text-slate-950">
                          {resource.title}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          {resource.category?.name ?? "Uncategorized"}
                        </p>
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200">
                          {resource.published ? "Published" : "Draft"}
                        </span>
                        <span className="text-sm text-slate-600">
                          {resource.price === "0.00"
                            ? "Free"
                            : `$${resource.price}`}
                        </span>
                        <Button
                          className="rounded-xl"
                          size="sm"
                          variant="outline"
                        >
                          Manage
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
                    You have not uploaded any resources yet.
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="rounded-[28px] border-slate-200 bg-slate-950 py-6 text-white shadow-[0_20px_60px_-40px_rgba(15,23,42,0.7)]">
                <CardHeader className="px-6">
                  <CardTitle className="text-xl">Upload new resource</CardTitle>
                  <CardDescription className="text-slate-400">
                    Share a PDF, template, UI kit, snippet, or study guide.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-6">
                  <div className="rounded-[24px] border border-dashed border-white/20 bg-white/5 p-6 text-center">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-white/10">
                      <HardDriveUpload className="size-5 text-fuchsia-200" />
                    </div>
                    <p className="mt-4 text-base font-medium text-white">
                      Drag and drop your file here
                    </p>
                    <p className="mt-2 text-sm text-slate-400">
                      Supports PDF, ZIP, DOCX, PNG up to 100 MB.
                    </p>
                    <Button className="mt-5 rounded-xl bg-white text-slate-950 hover:bg-white/90">
                      Choose file
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[28px] border-slate-200 bg-white shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)]">
                <CardHeader className="px-6">
                  <CardTitle className="text-xl text-slate-950">
                    Overview
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    A quick snapshot of what needs your attention.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 px-6">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Best performer</p>
                    <p className="mt-1 font-semibold text-slate-950">
                      Product Case Study Template
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      412 downloads in the last 30 days.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Needs update</p>
                    <p className="mt-1 font-semibold text-slate-950">
                      JavaScript Patterns Cheatsheet
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      Review metadata and refresh preview before publishing.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
