import { ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';

interface ThreatBadgesProps {
  threats: string[];
}

export default function ThreatBadges({ threats }: ThreatBadgesProps) {
  if (threats.length === 0 || (threats.length === 1 && threats[0].toLowerCase().includes("no identified threats"))) {
    return (
      <div className="flex flex-col p-6 bg-white rounded-xl shadow-md border border-gray-100 h-full justify-center">
        <div className="flex items-center space-x-3 text-green-600 mb-2">
          <CheckCircle size={24} />
          <h3 className="text-xl font-semibold">No Threats Detected</h3>
        </div>
        <p className="text-gray-500">This domain appears to be safe based on our checks.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-6 bg-white rounded-xl shadow-md border border-gray-100 h-full">
      <div className="flex items-center space-x-3 text-red-600 mb-4">
        <ShieldAlert size={24} />
        <h3 className="text-xl font-semibold">Identified Risks</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {threats.map((threat, index) => (
          <div key={index} className="flex items-center space-x-2 bg-red-50 text-red-700 px-3 py-2 rounded-lg border border-red-100 text-sm font-medium">
            <AlertTriangle size={16} />
            <span>{threat}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
