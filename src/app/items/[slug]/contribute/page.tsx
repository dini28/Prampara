import { ContributeForm } from "@/components/ContributeForm";
import { LoopStepper } from "@/components/LoopStepper";
import { PageShell } from "@/components/PageShell";
import { UserNeedBanner } from "@/components/UserNeedBanner";
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
        <>
          <LoopStepper current="contribute" itemSlug={slug} />
          <div className="mt-4">
            <UserNeedBanner ids={["UR-07", "UR-09"]} />
          </div>
        </>
      }
      crumbs={[
        { href: "/", label: "Home" },
        { href: `/items/${slug}`, label: item.title },
        { label: "Contribute" },
      ]}
      eyebrow="Contribute · human review gate"
      title="Contribute a note"
      lead="Your note stays unpublished until a reviewer accepts it. That gate is part of the product. The desk is not linked from the public nav."
      nextHref="/me"
      nextLabel="Open Profile"
      secondaryHref={`/items/${slug}`}
      secondaryLabel="Back to card"
    >
      <div className="page-panel p-5 sm:p-6">
        <ContributeForm slug={slug} />
      </div>
    </PageShell>
  );
}
