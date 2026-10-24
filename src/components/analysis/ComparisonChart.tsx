import React from 'react';
import { motion } from 'motion/react';
import { Zap, Gauge, Scale, Layers } from 'lucide-react';
import { DataConfidenceBadge } from './DataConfidenceBadge';
import { ConfidenceLevel } from '../../types/analysis';

interface ComparisonMetricProps {
  title: string;
  unit: string;
  stockValue: number;
  projectedMin: number;
  projectedMax: number;
  icon: React.ReactNode;
  confidence: ConfidenceLevel;
  type?: 'increase_good' | 'decrease_good'; // power/torque (increase good), weight (decrease good)
}

export const ComparisonMetricCard: React.FC<ComparisonMetricProps> = ({
  title,
  unit,
  stockValue,
  projectedMin,
  projectedMax,
  icon,
  confidence,
  type = 'increase_good'
}) => {
  const isWeight = type === 'decrease_good';
  const deltaMin = projectedMin - stockValue;
  const deltaMax = projectedMax - stockValue;
  const avgProjected = (projectedMin + projectedMax) / 2;

  // Percentage calculations for relative bar visual
  const maxValue = Math.max(stockValue, projectedMax) * 1.15;
  const stockPct = Math.min(100, Math.max(10, (stockValue / maxValue) * 100));
  const modMinPct = Math.min(100, Math.max(10, (projectedMin / maxValue) * 100));
  const modMaxPct = Math.min(100, Math.max(10, (projectedMax / maxValue) * 100));

  const isGain = isWeight ? deltaMax < 0 : deltaMin > 0;

  return (
    <div className="p-5 rounded-2xl bg-[#FAFAF7] border border-[#292927]/15 shadow-sm space-y-4">
      {/* Card Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#E8E2D8] border border-[#292927]/10 flex items-center justify-center text-[#28483D]">
            {icon}
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-[#4A4843] uppercase tracking-wider block">
              {title}
            </span>
            <span className="text-xs font-mono font-black text-[#171717]">
              {unit}
            </span>
          </div>
        </div>

        <DataConfidenceBadge level={confidence} size="sm" />
      </div>

      {/* Numerical Comparison Grid */}
      <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#E8E2D8] border border-[#292927]/12 text-xs font-mono">
        <div>
          <span className="text-[10px] text-[#4A4843] font-bold block uppercase">Stock Baseline</span>
          <span className="text-base font-black text-[#171717]">
            {stockValue} <span className="text-xs font-semibold text-[#4A4843]">{unit}</span>
          </span>
        </div>

        <div>
          <span className="text-[10px] text-[#4A4843] font-bold block uppercase">Build Estimate</span>
          <span className="text-base font-black text-[#28483D]">
            {projectedMin === projectedMax ? projectedMin : `${projectedMin}–${projectedMax}`}{' '}
            <span className="text-xs font-semibold text-[#4A4843]">{unit}</span>
          </span>
        </div>
      </div>

      {/* Visual Relative Progress Bars */}
      <div className="space-y-2 text-[11px] font-mono">
        {/* Stock Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[#4A4843] text-[10px] font-bold">
            <span>OEM Stock</span>
            <span>{stockValue} {unit}</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#E8E2D8] border border-[#292927]/10 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stockPct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-[#4A4843] rounded-full"
            />
          </div>
        </div>

        {/* Build Estimate Range Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px]">
            <span className="text-[#28483D] font-black">Build Range</span>
            <span className="text-[#171717] font-black">
              {projectedMin === projectedMax ? projectedMin : `${projectedMin}–${projectedMax}`} {unit}
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-[#E8E2D8] border border-[#292927]/10 relative overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${modMaxPct}%` }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className={`h-full rounded-full ${
                isWeight
                  ? 'bg-[#28483D]'
                  : 'bg-gradient-to-r from-[#28483D] to-[#1E362E]'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Delta Badge */}
      <div className="pt-2 border-t border-[#292927]/10 flex items-center justify-between text-xs font-mono">
        <span className="text-[#4A4843] font-bold">Net Delta:</span>
        <span className={`font-black ${
          isGain ? 'text-[#28483D]' : (deltaMin === 0 && deltaMax === 0) ? 'text-[#4A4843]' : 'text-[#B47A52]'
        }`}>
          {isWeight
            ? (deltaMax === 0 ? 'No change' : `${deltaMin > 0 ? '+' : ''}${deltaMin} kg`)
            : (deltaMin === 0 ? 'No change' : `+${deltaMin} to +${deltaMax} ${unit}`)}
        </span>
      </div>
    </div>
  );
};
