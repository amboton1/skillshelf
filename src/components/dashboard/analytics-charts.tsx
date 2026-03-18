"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { getAnalyticsData } from "@/lib/data/resources";

type AnalyticsData = NonNullable<Awaited<ReturnType<typeof getAnalyticsData>>>;

const PALETTE = [
  "#7c3aed",
  "#a78bfa",
  "#ec4899",
  "#f97316",
  "#10b981",
  "#3b82f6",
  "#eab308",
  "#06b6d4",
];

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-48 items-center justify-center text-sm text-slate-400">
      {message}
    </div>
  );
}

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.4)]">
      <p className="text-sm font-medium text-slate-500">{description}</p>
      <h3 className="mt-1 text-lg font-semibold text-slate-950">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export function LikesByResourceChart({ data }: { data: AnalyticsData["likesByResource"] }) {
  return (
    <ChartCard title="Likes by resource" description="Engagement">
      {data.length === 0 ? (
        <EmptyState message="No likes yet — share your resources to get started." />
      ) : (
        <ResponsiveContainer height={260} width="100%">
          <PieChart>
            <Pie
              cx="50%"
              cy="50%"
              data={data}
              dataKey="value"
              innerRadius={60}
              nameKey="name"
              outerRadius={100}
              paddingAngle={3}
            >
              {data.map((_, i) => (
                <Cell fill={PALETTE[i % PALETTE.length]} key={i} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: 13 }}
              formatter={(value) => [value, ""]}
            />
            <Legend
              formatter={(value) =>
                String(value).length > 20 ? `${String(value).slice(0, 20)}…` : value
              }
              iconSize={10}
              iconType="circle"
              wrapperStyle={{ fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}

export function CategoryBreakdownChart({ data }: { data: AnalyticsData["categoryBreakdown"] }) {
  return (
    <ChartCard title="Resources by category" description="Library composition">
      {data.length === 0 ? (
        <EmptyState message="No resources uploaded yet." />
      ) : (
        <ResponsiveContainer height={260} width="100%">
          <PieChart>
            <Pie
              cx="50%"
              cy="50%"
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              paddingAngle={3}
            >
              {data.map((_, i) => (
                <Cell fill={PALETTE[i % PALETTE.length]} key={i} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: 13 }}
              formatter={(value) => [value, ""]}
            />
            <Legend
              formatter={(value) =>
                String(value).length > 20 ? `${String(value).slice(0, 20)}…` : value
              }
              iconSize={10}
              iconType="circle"
              wrapperStyle={{ fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}

export function PublishedVsDraftChart({
  data,
}: {
  data: AnalyticsData["publishedVsDraft"];
}) {
  const chartData = [
    { name: "Published", value: data.published },
    { name: "Draft", value: data.draft },
  ].filter((d) => d.value > 0);

  return (
    <ChartCard title="Published vs draft" description="Status overview">
      {chartData.length === 0 ? (
        <EmptyState message="No resources uploaded yet." />
      ) : (
        <ResponsiveContainer height={260} width="100%">
          <PieChart>
            <Pie
              cx="50%"
              cy="50%"
              data={chartData}
              dataKey="value"
              innerRadius={60}
              nameKey="name"
              outerRadius={100}
              paddingAngle={3}
            >
              <Cell fill="#7c3aed" stroke="transparent" />
              <Cell fill="#e2e8f0" stroke="transparent" />
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: 13 }}
              formatter={(value) => [value, ""]}
            />
            <Legend
              iconSize={10}
              iconType="circle"
              wrapperStyle={{ fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}

export function SalesByResourceChart({ data }: { data: AnalyticsData["salesByResource"] }) {
  return (
    <ChartCard title="Sales by resource" description="Revenue distribution">
      {data.length === 0 ? (
        <EmptyState message="No sales recorded yet." />
      ) : (
        <ResponsiveContainer height={260} width="100%">
          <PieChart>
            <Pie
              cx="50%"
              cy="50%"
              data={data}
              dataKey="value"
              innerRadius={60}
              nameKey="name"
              outerRadius={100}
              paddingAngle={3}
            >
              {data.map((_, i) => (
                <Cell fill={PALETTE[i % PALETTE.length]} key={i} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: 13 }}
              formatter={(value) => [value, ""]}
            />
            <Legend
              formatter={(value) =>
                String(value).length > 20 ? `${String(value).slice(0, 20)}…` : value
              }
              iconSize={10}
              iconType="circle"
              wrapperStyle={{ fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}
