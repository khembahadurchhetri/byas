import ServiceGroupPage from "@/components/ServiceGroupPage";

export default async function LoanDetailPage({
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
      group="loans"
      title="Loans"
      basePath="/services/loans"
      slug={slug}
    />
  );
}