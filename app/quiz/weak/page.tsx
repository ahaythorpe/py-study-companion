import { StudySession } from "@/components/StudySession";
import { QUESTIONS } from "@/lib/questions";

export default function WeakQuizPage() {
  return (
    <StudySession
      mode="quiz"
      title="Weak questions"
      questions={QUESTIONS.filter((q) => q.kind === "mcq")}
      weakOnly
      emptyMessage="Nothing to review right now. Questions you get wrong will show up here."
    />
  );
}
