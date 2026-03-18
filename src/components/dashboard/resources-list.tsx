"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { ResourceWithCategory } from "@/lib/data/resources";

interface ResourcesListProps {
  userResources: ResourceWithCategory[];
}

export function ResourcesList({ userResources }: ResourcesListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredResources = userResources.filter((item) =>
    item.title.toLowerCase().includes(searchQuery),
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <Card className="rounded-[28px] border-slate-200 bg-white shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)]">
      <CardHeader className="px-6 md:px-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-2xl text-slate-950">
              Your resources
            </CardTitle>
            <CardDescription className="mt-2 text-slate-600">
              Review published items and drafts in your library.
            </CardDescription>
          </div>

          <div className="relative w-full md:max-w-sm">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              className="rounded-xl border-slate-200 bg-slate-50 pl-9"
              placeholder="Search your resources"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 px-6 md:px-7">
        {userResources.length > 0 ? (
          filteredResources.map((resource) => (
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
                  {resource.price === "0.00" ? "Free" : `$${resource.price}`}
                </span>
                <Button className="rounded-xl" size="sm" variant="outline">
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
  );
}
