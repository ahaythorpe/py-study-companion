import { StudySession } from "@/components/StudySession";
import { QUESTIONS, isQuizQuestion } from "@/lib/questions";

export default function WeakQuizPage() {
  return (
    <StudySession
      mode="quiz"
      title="Weak questions"
      questions={QUESTIONS.filter(isQuizQuestion)}
      weakOnly
      emptyMessage="Nothing to review right now. Questions you get wrong will show up here."
    />
  );
}
