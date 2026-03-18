"use client";

import { Bookmark, Search } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ResourceWithCategory } from "@/lib/data/resources";

interface LibraryGridProps {
  resources: ResourceWithCategory[];
  bookmarkedIds: string[];
}

type SortOption =
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc"
  | "newest";

export function LibraryGrid({ resources, bookmarkedIds }: LibraryGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [saved, setSaved] = useState<Set<string>>(new Set(bookmarkedIds));
  const [pending, setPending] = useState<Set<string>>(new Set());

  const filtered = resources
    .filter((r) => r.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      switch (sort) {
        case "name-asc":
          return a.title.localeCompare(b.title);
        case "name-desc":
          return b.title.localeCompare(a.title);
        case "price-asc":
          return parseFloat(a.price) - parseFloat(b.price);
        case "price-desc":
          return parseFloat(b.price) - parseFloat(a.price);
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        default:
          return 0;
      }
    });

  async function toggleBookmark(resourceId: string) {
    if (pending.has(resourceId)) return;
    setPending((p) => new Set(p).add(resourceId));

    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(resourceId)) next.delete(resourceId);
      else next.add(resourceId);
      return next;
    });

    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resourceId }),
      });
      if (!res.ok) {
        setSaved((prev) => {
          const next = new Set(prev);
          if (next.has(resourceId)) next.delete(resourceId);
          else next.add(resourceId);
          return next;
        });
      }
    } catch {
      setSaved((prev) => {
        const next = new Set(prev);
        if (next.has(resourceId)) next.delete(resourceId);
        else next.add(resourceId);
        return next;
      });
    } finally {
      setPending((p) => {
        const next = new Set(p);
        next.delete(resourceId);
        return next;
      });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950">
            Resource Library
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {resources.length} resource
            {resources.length !== 1 ? "s" : ""} available
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              className="rounded-xl border-slate-200 bg-white pl-9 sm:w-56"
              placeholder="Search resources…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
            <SelectTrigger className="w-full rounded-xl border-slate-200 bg-white sm:w-44">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="name-asc">Name A → Z</SelectItem>
              <SelectItem value="name-desc">Name Z → A</SelectItem>
              <SelectItem value="price-asc">Price: low to high</SelectItem>
              <SelectItem value="price-desc">Price: high to low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 py-20 text-center text-sm text-slate-500">
          {resources.length === 0
            ? "No resources have been published yet."
            : "No resources match your search."}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((resource) => (
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
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleBookmark(resource.id)}
                    disabled={pending.has(resource.id)}
                    className="rounded-xl p-1.5 text-slate-400 transition hover:text-violet-600 disabled:opacity-50"
                    aria-label={
                      saved.has(resource.id) ? "Remove bookmark" : "Bookmark"
                    }
                  >
                    <Bookmark
                      className="size-4"
                      fill={saved.has(resource.id) ? "currentColor" : "none"}
                    />
                  </button>
                  <Button size="sm" variant="outline" className="rounded-xl">
                    View
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
