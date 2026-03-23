"use client";

import {
  ChartColumn,
  FolderOpen,
  LayoutDashboard,
  Settings,
  Star,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
  { label: "My Resources", icon: FolderOpen, href: "/dashboard/my-resources" },
  { label: "Analytics", icon: ChartColumn, href: "/dashboard/analytics" },
  { label: "Saved", icon: Star, href: "/saved" },
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
];

const _quickActions = [
  "Upload a new resource",
  "Edit resource details",
  "Browse the library",
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
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
            Upload resources, track performance, and keep your library organised
            in one place.
          </p>
        </div>

        <nav className="mt-6 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition ${
                  isActive
                    ? "bg-slate-950 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                <Icon className="size-4" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
