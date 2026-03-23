import { ArrowLeft, FileText, Heart, ShoppingBag, Tag } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserResourceByID } from "@/lib/data/resources";
import { stackServerApp } from "@/stack/server";

interface ResourceDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ResourceDetailPage({
  params,
}: ResourceDetailPageProps) {
  await stackServerApp.getUser({ or: "redirect" });
  const { id } = await params;
  const resource = await getUserResourceByID(id);

  if (!resource) notFound();

  const formattedDate = new Date(resource.createdAt).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric" },
  );

  return (
    <main className="min-h-[calc(100vh-56px)] bg-[#f4f4f5] py-6 md:py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 md:px-6 lg:flex-row lg:px-8">
        <DashboardSidebar />

        <div className="flex-1 space-y-6">
          <Link
            className="inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-900"
            href="/dashboard/my-resources"
          >
            <ArrowLeft className="size-4" />
            Back to my resources
          </Link>

          <Card className="rounded-[28px] border-slate-200 bg-white shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)]">
            <CardHeader className="px-6 md:px-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${
                        resource.published
                          ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                          : "bg-slate-100 text-slate-600 ring-slate-200"
                      }`}
                    >
                      {resource.published ? "Published" : "Draft"}
                    </span>
                    {resource.category && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                        <Tag className="size-3" />
                        {resource.category.name}
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-2xl text-slate-950">
                    {resource.title}
                  </CardTitle>
                  <p className="text-sm text-slate-500">
                    Created {formattedDate}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-950">
                    {resource.price === "0.00" ? "Free" : `$${resource.price}`}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 px-6 md:px-7">
              {resource.thumbnail && (
                <img
                  alt={resource.title}
                  className="h-48 w-full rounded-2xl object-cover"
                  src={resource.thumbnail}
                />
              )}

              <div>
                <h3 className="mb-2 text-sm font-semibold text-slate-700">
                  Description
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  {resource.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <Heart className="size-5 text-rose-500" />
                  <div>
                    <p className="text-xl font-bold text-slate-950">
                      {resource.likes}
                    </p>
                    <p className="text-xs text-slate-500">Likes</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <ShoppingBag className="size-5 text-violet-500" />
                  <div>
                    <p className="text-xl font-bold text-slate-950">
                      {resource.sales}
                    </p>
                    <p className="text-xs text-slate-500">Sales</p>
                  </div>
                </div>
              </div>

              {resource.files.length > 0 && (
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-slate-700">
                    Files
                  </h3>
                  <div className="space-y-2">
                    {resource.files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                      >
                        <FileText className="size-4 shrink-0 text-slate-400" />
                        <span className="truncate text-sm text-slate-700">
                          {file.fileName}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
