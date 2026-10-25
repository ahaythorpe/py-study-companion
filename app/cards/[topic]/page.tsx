import { notFound } from "next/navigation";
import { StudySession } from "@/components/StudySession";
import { isTopic, questionsFor, topicLabel } from "@/lib/questions";
import { TOPICS } from "@/lib/types";

export function generateStaticParams() {
  return TOPICS.map((t) => ({ topic: t.id }));
}

export default async function CardsPage({ params }: PageProps<"/cards/[topic]">) {
  const { topic } = await params;
  if (!isTopic(topic)) notFound();

  return (
    <StudySession
      mode="cards"
      title={`${topicLabel(topic)} cards`}
      questions={questionsFor(topic)}
    />
  );
}
