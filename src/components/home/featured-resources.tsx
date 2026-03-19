"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { Resource } from "@/db/schema";
import type { ResourceWithCategory } from "@/lib/data/resources";
import { useRouter } from "next/navigation";

export type { Resource };

interface FeaturedResourcesProps {
  resources?: ResourceWithCategory[];
}

export function FeaturedResources({ resources }: FeaturedResourcesProps) {
  const router = useRouter();
  const formatPrice = (price: Resource["price"]) => {
    const amount = typeof price === "string" ? Number(price) : price;

    if (!Number.isFinite(amount)) {
      return "Custom pricing";
    }

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (date: Resource["createdAt"]) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  };

  const getCategoryLabel = (resource: ResourceWithCategory) => {
    if (!resource.category) {
      return "Uncategorized";
    }

    return resource.category.name;
  };

  const getCreatorLabel = (creatorId: Resource["creatorId"]) => {
    return `Creator ${creatorId.slice(0, 8)}`;
  };

  return (
    <section className="mt-24 w-full border-t border-gray-300 pt-14">
      <div className="mx-auto mb-8 flex w-full max-w-7xl items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold tracking-tight text-[#1f2937]">
            Featured Resources
          </h2>
          <p className="mt-3 text-sm text-gray-500">
            Hand-picked top quality assets
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push("/library")}
          className="inline-flex items-center gap-2 text-sm text-[#1f2937] hover:text-black"
        >
          View all
          <span aria-hidden="true" className="text-base">
            ›
          </span>
        </button>
      </div>

      <div className="mx-auto grid w-full max-w-7xl gap-5 md:grid-cols-2 xl:grid-cols-4">
        {resources?.slice(0, 4).map((resource) => (
          <Card
            key={resource.id}
            className="overflow-hidden border-gray-200 bg-white py-0 shadow-none transition-colors hover:border-gray-300"
          >
            <div className="border-b border-dashed border-gray-200 bg-gradient-to-br from-gray-50 via-white to-gray-100 px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                  <span className="inline-flex w-fit rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] font-medium tracking-[0.2em] text-gray-500 uppercase">
                    {resource.published ? "Published" : "Draft"}
                  </span>
                  <div>
                    <p className="text-xs font-medium tracking-[0.18em] text-gray-400 uppercase">
                      {getCategoryLabel(resource)}
                    </p>
                    <p className="mt-2 text-3xl font-semibold tracking-tight text-[#1f2937]">
                      {formatPrice(resource.price)}
                    </p>
                  </div>
                </div>

                <div className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-500">
                  {formatDate(resource.createdAt)}
                </div>
              </div>
            </div>

            <CardHeader className="gap-3 px-6 pt-6 pb-3">
              <CardTitle className="line-clamp-2 text-2xl leading-tight text-[#1f2937]">
                {resource.title}
              </CardTitle>
              <CardDescription className="line-clamp-3 text-sm leading-6 text-gray-600">
                {resource.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="px-6 pb-6">
              <div className="grid gap-3 text-sm text-gray-600">
                <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                  <span className="text-xs font-medium tracking-[0.18em] text-gray-400 uppercase">
                    Creator
                  </span>
                  <span className="truncate font-medium text-[#1f2937]">
                    {getCreatorLabel(resource.creatorId)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                  <span className="text-xs font-medium tracking-[0.18em] text-gray-400 uppercase">
                    Slug
                  </span>
                  <span className="truncate font-mono text-xs text-[#1f2937]">
                    {resource.slug}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                  <span className="text-xs font-medium tracking-[0.18em] text-gray-400 uppercase">
                    Thumbnail
                  </span>
                  <span className="font-medium text-[#1f2937]">
                    {resource.thumbnail ? "Available" : "None"}
                  </span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="justify-between border-t border-dashed border-gray-200 px-6 pt-4 pb-4 text-sm text-gray-600">
              <span className="text-xs font-medium tracking-[0.18em] text-gray-400 uppercase">
                Resource ID
              </span>
              <span className="font-mono text-xs text-[#1f2937]">
                {resource.id.slice(0, 12)}...
              </span>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
