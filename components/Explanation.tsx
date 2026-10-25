type Props = {
  correct?: boolean;
  explanation: string;
  source: string;
};

export function Explanation({ correct, explanation, source }: Props) {
  return (
    <div className="rounded-lg bg-surface-2 p-4 text-sm leading-relaxed">
      {correct !== undefined && (
        <p className={`mb-1 font-semibold ${correct ? "text-good" : "text-bad"}`}>
          {correct ? "Correct" : "Not quite"}
        </p>
      )}
      <p>{explanation}</p>
      <p className="mt-2 text-muted">Source: {source}</p>
    </div>
  );
}
