import { StudySession } from "@/components/StudySession";
import { QUESTIONS, isQuizQuestion } from "@/lib/questions";

export default function MixedQuizPage() {
  return (
    <StudySession
      mode="quiz"
      title="Exam-style mixed practice"
      questions={QUESTIONS.filter(isQuizQuestion)}
      perArea={7}
    />
  );
}
