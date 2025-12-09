import NPSScoreDisplay from '../campaigns/NPSScoreDisplay';

export default function NPSScoreDisplayExample() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <NPSScoreDisplay score={72} size="sm" />
      <NPSScoreDisplay score={55} size="md" />
      <NPSScoreDisplay score={35} size="lg" />
    </div>
  );
}
