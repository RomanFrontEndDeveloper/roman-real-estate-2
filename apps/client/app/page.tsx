import Hero from "@/components/sections/Hero";
import PropertySearch from "@/components/sections/PropertySearch";
import FeaturedProperties from "@/components/sections/FeaturedProperties";
import PropertyCategories from "@/components/sections/PropertyCategories";
import PopularLocations from "@/components/sections/PopularLocations";
import Agents from "@/components/sections/Agents";
import CTA from "@/components/sections/CTA";

export default function Home() {
  return (
    <div className="space-y-20">
      <Hero />
      <PropertySearch />
      <FeaturedProperties /> fluorlocation
      <PropertyCategories />
      <PopularLocations />
      <Agents />
      <CTA />
    </div>
  );
}
