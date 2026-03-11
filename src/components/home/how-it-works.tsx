import type { LucideIcon } from "lucide-react";
import { Download, Search, Tag } from "lucide-react";

export interface Step {
  title: string;
  description: string;
  Icon: LucideIcon;
}

const defaultSteps: Step[] = [
  {
    title: "1. Browse",
    description:
      "Search through thousands of high-quality resources created by professionals.",
    Icon: Search,
  },
  {
    title: "2. Purchase",
    description:
      "Buy securely or download free resources instantly to your account.",
    Icon: Tag,
  },
  {
    title: "3. Download",
    description:
      "Get immediate access to files and start using them in your projects.",
    Icon: Download,
  },
];

interface HowItWorksProps {
  steps?: Step[];
}

export function HowItWorks({ steps = defaultSteps }: HowItWorksProps) {
  return (
    <section className="mt-24 w-full border-t border-gray-300 bg-[#f0f0f2] pt-16 pb-20">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mx-auto mb-10 flex max-w-2xl flex-col items-center text-center">
          <h2 className="text-4xl font-bold tracking-tight text-[#1f2937]">
            How It Works
          </h2>
          <p className="mt-3 text-sm text-gray-500">
            Simple process from discovery to download
          </p>
        </div>

        <div className="relative grid gap-6 lg:grid-cols-3">
          {steps.map((step, index) => (
            <article
              key={step.title}
              className="relative flex min-h-[320px] flex-col items-center justify-center border border-gray-300 bg-[#f4f4f5] px-10 py-10 text-center"
            >
              {index < steps.length - 1 && (
                <span
                  className="absolute right-[-24px] top-1/2 hidden h-px w-12 border-t border-dashed border-gray-400 lg:block"
                  aria-hidden="true"
                />
              )}

              <div className="mb-6 flex h-24 w-24 items-center justify-center border border-gray-300 bg-gray-100 text-gray-600">
                <step.Icon className="h-10 w-10" aria-hidden="true" />
              </div>

              <h3 className="text-4xl font-semibold text-[#1f2937]">
                {step.title}
              </h3>
              <p className="mt-5 max-w-sm text-2xl leading-relaxed text-gray-500">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
