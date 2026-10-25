import { notFound } from "next/navigation";
import { StudySession } from "@/components/StudySession";
import { isTopic, questionsFor, topicLabel } from "@/lib/questions";
import { TOPICS } from "@/lib/types";

export function generateStaticParams() {
  return TOPICS.map((t) => ({ topic: t.id }));
}

export default async function QuizPage({ params }: PageProps<"/quiz/[topic]">) {
  const { topic } = await params;
  if (!isTopic(topic)) notFound();

  return (
    <StudySession
      mode="quiz"
      title={`${topicLabel(topic)} quiz`}
      questions={questionsFor(topic).filter((q) => q.kind === "mcq")}
    />
  );
}
