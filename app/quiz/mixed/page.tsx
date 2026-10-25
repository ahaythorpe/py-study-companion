import { StudySession } from "@/components/StudySession";
import { QUESTIONS, isQuizQuestion } from "@/lib/questions";

export default function MixedQuizPage() {
  return (
    <StudySession
      mode="quiz"
      title="Mixed practice"
      questions={QUESTIONS.filter(isQuizQuestion)}
      length={20}
    />
  );
}
