import { LibraryGrid } from "@/components/library/library-grid";
import { getBookmarkedResourceIds, getResources } from "@/lib/data/resources";

export default async function LibraryPage() {
  const [allResources, bookmarkedIds] = await Promise.all([
    getResources(),
    getBookmarkedResourceIds(),
  ]);
  const publishedResources = allResources.filter((r) => r.published);

  return (
    <main className="min-h-[calc(100vh-56px)] bg-[#f4f4f5] py-6 md:py-8">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <LibraryGrid resources={publishedResources} bookmarkedIds={bookmarkedIds} />
      </div>
    </main>
  );
}
