import {
  BrowseCategories,
  CtaSection,
  FeaturedResources,
  FooterSection,
  HeroSection,
  HowItWorks,
} from "@/components/home";
import { getCategories } from "@/lib/data/categories";
import { getResources } from "@/lib/data/resources";

export default async function Home() {
  const resources = await getResources();
  const categories = await getCategories();

  return (
    <main className="min-h-[calc(100vh-56px)] bg-[#f4f4f5] py-14 md:py-20">
      <HeroSection />
      <FeaturedResources resources={resources} />
      <BrowseCategories categories={categories} />
      <HowItWorks />
      <CtaSection />
      <FooterSection />
    </main>
  );
}
