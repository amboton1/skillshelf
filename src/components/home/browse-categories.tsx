import type { LucideIcon } from "lucide-react";
import {
  Blocks,
  FileText,
  GraduationCap,
  LayoutTemplate,
  Palette,
  SquareCode,
} from "lucide-react";
import type { Category as DBCategory } from "@/db/schema";

interface Category extends DBCategory {
  title: string;
  description: string;
  Icon: LucideIcon;
}

// Map database categories to UI categories with icons and descriptions
const getCategoryConfig = (name: string) => {
  const config: Record<string, { Icon: LucideIcon; description: string }> = {
    "UI Kits": {
      Icon: Palette,
      description: "Complete design systems and components",
    },
    Templates: {
      Icon: LayoutTemplate,
      description: "Ready-to-use layouts and structures",
    },
    "Code Snippets": {
      Icon: SquareCode,
      description: "Reusable functions and components",
    },
    Icons: {
      Icon: Blocks,
      description: "Icons, illustrations, and graphics",
    },
    Courses: {
      Icon: GraduationCap,
      description: "Comprehensive learning materials",
    },
    "E-books": {
      Icon: FileText,
      description: "Guides, checklists, and manuals",
    },
  };

  return (
    config[name] || {
      Icon: Blocks,
      description: "Digital resources and assets",
    }
  );
};

interface BrowseCategoriesProps {
  categories: DBCategory[];
}

export function BrowseCategories({ categories }: BrowseCategoriesProps) {
  const uiCategories: Category[] = categories.map((category) => {
    const config = getCategoryConfig(category.name);
    return {
      ...category,
      title: category.name,
      description: config.description,
      Icon: config.Icon,
    };
  });

  return (
    <section className="mt-24 w-full border-t border-gray-300 pt-16">
      <div className="mx-auto mb-10 w-full flex max-w-6xl flex-col items-center text-center">
        <h2 className="text-4xl font-bold tracking-tight text-[#1f2937]">
          Browse by Category
        </h2>
        <p className="mt-3 text-sm text-gray-500">
          Find exactly what you need for your next project
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 mx-auto max-w-6xl">
        {uiCategories.map((category) => (
          <article
            key={category.id}
            className="flex min-h-[220px] flex-col items-center justify-center border border-dashed border-gray-300 px-6 py-8 text-center"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center border border-gray-300 bg-gray-100/80 text-gray-600">
              <category.Icon className="h-6 w-6" aria-hidden="true" />
            </div>
            <h3 className="text-[31px] font-semibold text-[#1f2937]">
              {category.title}
            </h3>
            <p className="mt-2 text-sm text-gray-500">{category.description}</p>
            <div className="mt-4 border border-gray-200 bg-gray-100 px-3 py-1 text-xs text-gray-500">
              {category.resources || 0} resources
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
