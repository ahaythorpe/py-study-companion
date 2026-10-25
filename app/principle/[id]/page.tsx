import { notFound } from "next/navigation";
import { StudySession } from "@/components/StudySession";
import { PRINCIPLES, QUESTIONS } from "@/lib/questions";

export function generateStaticParams() {
  return PRINCIPLES.map((p) => ({ id: p.id }));
}

export default async function PrinciplePage({ params }: PageProps<"/principle/[id]">) {
  const { id } = await params;
  const principle = PRINCIPLES.find((p) => p.id === id);
  if (!principle) notFound();
  const variants = QUESTIONS.filter((q) => q.principle === id);

  return <StudySession mode="cards" title={principle.label} questions={variants} length={variants.length} />;
}
