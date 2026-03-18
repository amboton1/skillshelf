import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { MyResourcesGrid } from "@/components/dashboard/my-resources-grid";
import { getUsersResources } from "@/lib/data/resources";
import { stackServerApp } from "@/stack/server";

export default async function MyResourcesPage() {
  await stackServerApp.getUser({ or: "redirect" });
  const userResources = await getUsersResources();

  return (
    <main className="min-h-[calc(100vh-56px)] bg-[#f4f4f5] py-6 md:py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 md:px-6 lg:flex-row lg:px-8">
        <DashboardSidebar />

        <div className="flex-1">
          <MyResourcesGrid userResources={userResources} />
        </div>
      </div>
    </main>
  );
}
