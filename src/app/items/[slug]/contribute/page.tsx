import { ContributeForm } from "@/components/ContributeForm";
import { LoopStepper } from "@/components/LoopStepper";
import { PageShell } from "@/components/PageShell";
import { getItemBySlug } from "@/lib/catalogue";
import { notFound } from "next/navigation";

export default async function ContributePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getItemBySlug(slug);
  if (!item) notFound();

  return (
    <PageShell
      width="narrow"
      before={
        <div className="sticky-mini-header -mx-5 px-5 py-3 md:static md:mx-0 md:bg-transparent md:p-0">
          <LoopStepper current="contribute" itemSlug={slug} />
        </div>
      }
      crumbs={[
        { href: "/", label: "Home" },
        { href: `/items/${slug}`, label: item.title },
        { label: "Contribute" },
      ]}
      eyebrow="Contribute · human review gate"
      title="Contribute a note"
      lead="Your note stays unpublished until a reviewer accepts it. That gate is part of the product. The desk is not linked from the public nav."
      nextHref="/passport"
      nextLabel="Open passport"
      secondaryHref={`/items/${slug}`}
      secondaryLabel="Back to treasure"
    >
      <div className="page-panel p-5 sm:p-6">
        <ContributeForm slug={slug} />
      </div>
    </PageShell>
  );
}
