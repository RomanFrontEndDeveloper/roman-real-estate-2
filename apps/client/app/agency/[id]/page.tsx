import AgencyProfile from "@/components/agency/AgencyProfile";

type AgencyPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AgencyPage({ params }: AgencyPageProps) {
  const { id } = await params;

  return <AgencyProfile agencyId={id} />;
}
