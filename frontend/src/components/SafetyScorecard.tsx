interface SafetyScorecardProps {
  score: number;
}

export default function SafetyScorecard({ score }: SafetyScorecardProps) {
  let colorClass = "text-green-500";
  let bgClass = "bg-green-100";
  let label = "Safe";

  if (score < 50) {
    colorClass = "text-red-500";
    bgClass = "bg-red-100";
    label = "High Risk";
  } else if (score < 80) {
    colorClass = "text-yellow-500";
    bgClass = "bg-yellow-100";
    label = "Medium Risk";
  }

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">Safety Score</h3>
      <div className={`w-32 h-32 rounded-full flex items-center justify-center ${bgClass}`}>
        <span className={`text-4xl font-bold ${colorClass}`}>
          {score}
        </span>
      </div>
      <div className={`mt-4 px-4 py-1 rounded-full font-medium ${bgClass} ${colorClass}`}>
        {label}
      </div>
    </div>
  );
}
