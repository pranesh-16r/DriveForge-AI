import React from 'react';
import { ConfidenceLevel } from '../../types/analysis';
import { DataConfidenceBadge } from './DataConfidenceBadge';
import { Info } from 'lucide-react';

interface DataSourceLabelProps {
  label: string;
  confidence: ConfidenceLevel;
  source?: string;
  className?: string;
}

export const DataSourceLabel: React.FC<DataSourceLabelProps> = ({
  label,
  confidence,
  source,
  className = ''
}) => {
  return (
    <div className={`flex items-center justify-between gap-2 text-xs font-mono ${className}`}>
      <div className="flex items-center gap-1.5 text-gray-400">
        <span className="uppercase tracking-wider">{label}</span>
        {source && (
          <span title={source} className="text-gray-500 hover:text-gray-300 transition-colors cursor-help">
            <Info className="w-3 h-3 inline" />
          </span>
        )}
      </div>
      <DataConfidenceBadge level={confidence} size="sm" />
    </div>
  );
};
