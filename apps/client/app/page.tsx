import Hero from "@/components/sections/Hero";
import PropertySearch from "@/components/sections/PropertySearch";
import PropertyCategories from "@/components/sections/PropertyCategories";

import Agents from "@/components/sections/Agents";
import CTA from "@/components/sections/CTA";

import AllAgencies from "@/components/agency/AllAgencies";

type HomeProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;

  return (
    <div className="space-y-15">
      {/* Головний екран: заголовок, опис і основні CTA */}
      <Hero />
      {/* Пошук нерухомості за параметрами */}
      <PropertySearch />

      {/* Добірка рекомендованих об'єктів нерухомості */}
      <PropertyCategories searchParams={params} />

    

      {/* Агенти: фото, ім'я, посада та кількість об'єктів */}
      <Agents />

      <AllAgencies />

      {/* Фінальний заклик до дії: знайти нерухомість або зв'язатися */}
      <CTA />
    </div>
  );
}
