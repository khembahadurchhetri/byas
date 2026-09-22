import ServiceGroupPage from "@/components/ServiceGroupPage";

export default async function DigitalServiceDetailPage({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } =
    await params;

  return (
    <ServiceGroupPage
      group="digital"
      title="Digital Services"
      basePath="/services/digital"
      slug={slug}
    />
  );
}