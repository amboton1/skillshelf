"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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

interface MyResourcesGridProps {
  userResources: ResourceWithCategory[];
}

type SortOption =
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc"
  | "newest";

export function MyResourcesGrid({ userResources }: MyResourcesGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");

  const filtered = userResources
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950">
            My Resources
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {userResources.length} resource
            {userResources.length !== 1 ? "s" : ""} in your library
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

      {userResources.length === 0 ? (
        <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 py-20 text-center text-sm text-slate-500">
          You have not uploaded any resources yet.
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 py-20 text-center text-sm text-slate-500">
          No resources match your search.
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
                  <Badge
                    variant={resource.published ? "default" : "secondary"}
                    className={
                      resource.published
                        ? "shrink-0 bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                        : "shrink-0 bg-slate-100 text-slate-500 hover:bg-slate-100"
                    }
                  >
                    {resource.published ? "Published" : "Draft"}
                  </Badge>
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
                <Button
                  asChild
                  className="rounded-xl"
                  size="sm"
                  variant="outline"
                >
                  <Link href={`/dashboard/my-resources/${resource.id}`}>
                    View
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
