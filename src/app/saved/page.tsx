import { Bookmark } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSavedResources } from "@/lib/data/resources";
import { stackServerApp } from "@/stack/server";

export default async function SavedPage() {
  const user = await stackServerApp.getUser();
  if (!user) redirect("/handler/signin?redirect=/saved");

  const saved = await getSavedResources();

  return (
    <main className="min-h-[calc(100vh-56px)] bg-[#f4f4f5] py-6 md:py-8">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950 flex items-center gap-2">
            <Bookmark className="size-5" />
            Saved Resources
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {saved.length} saved resource{saved.length !== 1 ? "s" : ""}
          </p>
        </div>

        {saved.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 py-20 text-center space-y-3">
            <p className="text-sm text-slate-500">
              You haven&apos;t saved any resources yet.
            </p>
            <Button asChild variant="outline" className="rounded-xl">
              <Link href="/library">Browse Library</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {saved.map((resource) => (
              <Card
                key={resource.id}
                className="flex flex-col rounded-[24px] border-slate-200 bg-white shadow-[0_8px_30px_-12px_rgba(15,23,42,0.18)] transition hover:shadow-[0_12px_40px_-12px_rgba(15,23,42,0.28)]"
              >
                <div className="h-36 w-full overflow-hidden rounded-t-[22px] bg-slate-100">
                  {resource.thumbnail ? (
                    <Image
                      src={resource.thumbnail}
                      alt={resource.title}
                      className="h-full w-full object-cover"
                      width={400}
                      height={300}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-3xl text-slate-300">
                      📄
                    </div>
                  )}
                </div>

                <CardHeader className="px-5 pt-4 pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="line-clamp-2 text-base leading-snug text-slate-950">
                      {resource.title}
                    </CardTitle>
                    {resource.category && (
                      <Badge className="shrink-0 bg-violet-100 text-violet-700 hover:bg-violet-100">
                        {resource.category.name}
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="mt-1 text-slate-500">
                    {resource.category?.name ?? "Uncategorized"}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1 px-5 pb-2">
                  <p className="line-clamp-2 text-sm text-slate-600">
                    {resource.description}
                  </p>
                </CardContent>

                <CardFooter className="flex items-center justify-between px-5 pb-5">
                  <span className="text-sm font-semibold text-slate-950">
                    {resource.price === "0.00" ? (
                      <span className="text-emerald-600">Free</span>
                    ) : (
                      `$${resource.price}`
                    )}
                  </span>
                  <Button size="sm" variant="outline" className="rounded-xl">
                    View
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
