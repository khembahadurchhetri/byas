import ServiceGroupPage from "@/components/ServiceGroupPage";

export default async function LoanDocumentDetailPage({
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
      group="loan-documents"
      title="Loans Required Document"
      basePath="/services/loan-documents"
      slug={slug}
    />
  );
}