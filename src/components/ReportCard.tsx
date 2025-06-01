import React from 'react';
import { FileText, AlertTriangle } from 'lucide-react';

interface ReportCardProps {
  id: string;
  contractName: string;
  createdAt: string;
  vulnerabilityCount: number;
  riskScore: number;
  onClick: () => void;
}

const ReportCard: React.FC<ReportCardProps> = ({
  id,
  contractName,
  createdAt,
  vulnerabilityCount,
  riskScore,
  onClick
}) => {
  const getRiskColor = () => {
    if (riskScore < 30) return 'bg-green-100 text-green-800';
    if (riskScore < 60) return 'bg-yellow-100 text-yellow-800';
    if (riskScore < 80) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <FileText className="h-6 w-6 text-blue-500 mr-2" />
          <h3 className="font-semibold">{contractName}</h3>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor()}`}>
          Risk: {riskScore}%
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center text-sm text-gray-600 mb-1">
          <AlertTriangle className="h-4 w-4 mr-1 text-yellow-500" />
          <span>{vulnerabilityCount} vulnerabilities detected</span>
        </div>
        <div className="text-xs text-gray-500">
          Generated on {new Date(createdAt).toLocaleString()}
        </div>
      </div>
      
      <button 
        className="w-full py-2 bg-blue-50 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors"
      >
        View Full Report
      </button>
    </div>
  );
};

export default ReportCard;