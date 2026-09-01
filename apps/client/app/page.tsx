import Hero from "@/components/sections/Hero";
import PropertySearch from "@/components/sections/PropertySearch";
import FeaturedProperties from "@/components/sections/FeaturedProperties";
import PropertyCategories from "@/components/sections/PropertyCategories";
import PopularLocations from "@/components/sections/PopularLocations";
import Agents from "@/components/sections/Agents";
import CTA from "@/components/sections/CTA";

export default function Home() {
  return (
    <div className="space-y-15">
      {/* Головний екран: заголовок, опис і основні CTA */}
      <Hero />
      {/* Пошук нерухомості за параметрами */}
      <PropertySearch />

      {/* Добірка рекомендованих об'єктів нерухомості */}
      <FeaturedProperties />

      {/* Категорії нерухомості: квартири, будинки, вілли, комерція */}
      <PropertyCategories />

      {/* Популярні міста та локації */}
      <PopularLocations />

      {/* Агенти: фото, ім'я, посада та кількість об'єктів */}
      <Agents />

      {/* Фінальний заклик до дії: знайти нерухомість або зв'язатися */}
      <CTA />
    </div>
  );
}
