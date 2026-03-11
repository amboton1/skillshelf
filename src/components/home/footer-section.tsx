import { BookOpen } from "lucide-react";

export interface FooterColumn {
  title: string;
  links: string[];
}

const defaultFooterColumns: FooterColumn[] = [
  {
    title: "Product",
    links: ["Browse All", "Templates", "UI Kits", "Start Selling"],
  },
  {
    title: "Company",
    links: ["About Us", "Careers", "Blog", "Contact"],
  },
  {
    title: "Legal",
    links: ["Terms of Service", "Privacy Policy", "Licensing", "Refund Policy"],
  },
];

interface FooterSectionProps {
  columns?: FooterColumn[];
  copyrightYear?: number;
}

export function FooterSection({
  columns = defaultFooterColumns,
  copyrightYear = 2026,
}: FooterSectionProps) {
  return (
    <footer className="mt-24 w-full border-t border-gray-300 pt-14 pb-10">
      <div className="mx-auto grid w-full max-w-6xl gap-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 text-3xl font-semibold text-[#1f2937]">
            <BookOpen className="h-6 w-6" aria-hidden="true" />
            <span>SkillShelf</span>
          </div>
          <p className="mt-6 max-w-xs text-sm leading-8 text-gray-500">
            A digital resource marketplace for professionals to share, sell, and
            discover tools.
          </p>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <h3 className="text-sm font-semibold text-[#1f2937]">
              {column.title}
            </h3>
            <ul className="mt-6 space-y-5">
              {column.links.map((link) => (
                <li key={link}>
                  <a
                    href="/"
                    className="text-sm text-gray-500 hover:text-[#1f2937]"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-12 flex w-full max-w-6xl flex-col items-start justify-between gap-4 border-t border-gray-300 pt-8 text-xs text-gray-500 md:flex-row md:items-center">
        <p>© {copyrightYear} SkillShelf. All rights reserved.</p>
        <div className="border border-gray-300 bg-gray-100 px-4 py-2">
          Built with SkillShelf
        </div>
      </div>
    </footer>
  );
}
