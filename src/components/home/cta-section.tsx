import { Blocks } from "lucide-react";

interface CtaSectionProps {
  onListResource?: () => void;
}

export function CtaSection({ onListResource }: CtaSectionProps) {
  return (
    <section className="w-full border-t border-gray-300 pt-16 pb-20">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mx-auto flex max-w-4xl flex-col items-center border border-dashed border-gray-300 bg-[#F5F5F7] px-8 py-16 text-center md:px-12">
          <div className="mb-6 flex h-14 w-14 items-center justify-center border border-gray-300 bg-gray-100 text-[#1f2937]">
            <Blocks className="h-8 w-8" aria-hidden="true" />
          </div>

          <h2 className="text-5xl font-bold tracking-tight text-[#1f2937] md:text-6xl">
            Start Selling Your Resources
          </h2>

          <p className="mt-6 max-w-2xl text-xl leading-relaxed text-gray-500 md:text-2xl">
            Turn your expertise into income. Share your templates, code, and
            guides with thousands of professionals looking to save time.
          </p>

          <button
            type="button"
            onClick={onListResource}
            className="mt-10 bg-[#1f2937] px-10 py-4 text-lg font-semibold text-white transition hover:bg-[#111827]"
          >
            List a Resource
          </button>
        </div>
      </div>
    </section>
  );
}
