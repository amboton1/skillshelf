import { ArrowLeft, Heart, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getResourceBySlug } from "@/lib/data/resources";
import { ResourceActionButton } from "./resource-action-button";

interface ResourceDetailsPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ResourceDetailsPage({
  params,
}: ResourceDetailsPageProps) {
  const { slug } = await params;
  const resource = await getResourceBySlug(slug);

  if (!resource) notFound();

  const formattedDate = new Date(resource.createdAt).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric" },
  );

  return (
    <main className="min-h-[calc(100vh-56px)] bg-[#f4f4f5] py-10 md:py-14">
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <Link
          href="/library"
          className="inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-900"
        >
          <ArrowLeft className="size-4" />
          Back to Library
        </Link>

        <Card className="mt-6 rounded-[28px] border-slate-200 bg-white shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)]">
          {resource.thumbnail && (
            <div className="h-64 w-full overflow-hidden rounded-t-[26px] bg-slate-100">
              <Image
                src={resource.thumbnail}
                alt={resource.title}
                className="h-full w-full object-cover"
                width={800}
                height={400}
              />
            </div>
          )}

          <CardHeader className="px-7 pt-6 pb-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  {resource.category && (
                    <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-100">
                      <Tag className="mr-1 size-3" />
                      {resource.category.name}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-2xl text-slate-950">
                  {resource.title}
                </CardTitle>
                <p className="text-sm text-slate-400">Added {formattedDate}</p>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-3xl font-bold text-slate-950">
                  {resource.price === "0.00" ? (
                    <span className="text-emerald-600">Free</span>
                  ) : (
                    `$${resource.price}`
                  )}
                </p>
              </div>
            </div>
          </CardHeader>

          <hr className="mx-7 border-slate-100" />

          <CardContent className="space-y-6 px-7 py-6">
            <div>
              <h3 className="mb-2 text-sm font-semibold text-slate-700">
                About this resource
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                {resource.description}
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Heart className="size-4 text-rose-400" fill="currentColor" />
              <span>
                {resource.likes} {resource.likes === 1 ? "like" : "likes"}
              </span>
            </div>

            <ResourceActionButton
              price={resource.price}
              fileUrl={resource.fileUrl}
            />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
