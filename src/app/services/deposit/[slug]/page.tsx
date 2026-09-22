import ServiceGroupPage from "@/components/ServiceGroupPage";

export default async function DepositDetailPage({
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
      group="savings"
      title="Deposit"
      basePath="/services/deposit"
      slug={slug}
    />
  );
}