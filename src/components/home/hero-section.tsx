"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const stats = [
  { value: "2,400+", label: "Resources" },
  { value: "850+", label: "Creators" },
  { value: "15K+", label: "Downloads" },
];

export function HeroSection() {
  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
      <div className="mb-8 inline-flex items-center border border-dashed border-gray-400/80 px-8 py-2 text-[11px] text-gray-600">
        v1.0 Digacon
      </div>

      <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight text-[#1f2937] md:text-6xl">
        Discover &amp; Share
        <br />
        Professional Resources
      </h1>

      <p className="mt-8 max-w-2xl text-2xl leading-relaxed text-gray-500 md:text-[31px]">
        A curated marketplace for PDFs, templates, code snippets, UI kits, and
        study guides. Build faster with community-driven assets.
      </p>

      <div className="relative mt-12 w-full max-w-3xl">
        <Search
          className="pointer-events-none absolute left-5 top-1/2 h-6 w-6 -translate-y-1/2 text-gray-400"
          aria-hidden="true"
        />
        <Input
          type="text"
          placeholder="Search for templates, code, guides..."
          className="h-16 rounded-none border-gray-300 bg-transparent pl-16 text-[34px] text-gray-700 placeholder:text-gray-400 focus-visible:ring-0"
        />
      </div>

      <div className="mt-14 grid w-full max-w-2xl grid-cols-3">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={`text-center ${
              index === 1 ? "border-l border-r border-gray-300" : ""
            }`}
          >
            <p className="text-4xl font-bold text-[#1f2937]">{stat.value}</p>
            <p className="mt-2 text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
