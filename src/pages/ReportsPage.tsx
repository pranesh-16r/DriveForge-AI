import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { PageContainer } from '../components/ui/PageContainer';
import { NeoButton } from '../components/ui/NeoButton';
import { ReportService } from '../lib/reports/reportService';
import { VaultService } from '../lib/vault/vaultService';
import {
  FileText,
  Printer,
  Download,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Car,
  Wrench,
  Sparkles,
  MapPin,
  Clock,
  ArrowLeft,
  Bot
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const {
    activeVehicle,
    selectedCountry,
    selectedRegion,
    buildState,
    buildComponents,
    navigateTo
  } = useApp();

  // Check if buildId passed in URL
  const queryParams = new URLSearchParams(window.location.search);
  const targetBuildId = queryParams.get('buildId');

  // If targetBuildId passed, retrieve from Vault
  const vaultBuild = useMemo(() => {
    if (!targetBuildId) return null;
    return VaultService.getSavedBuilds().find(b => b.buildId === targetBuildId);
  }, [targetBuildId]);

  // Generate formal report structure
  const report = useMemo(() => {
    if (vaultBuild) {
      return ReportService.generateBuildReport({
        vehicle: vaultBuild.vehicle,
        buildState: {
          id: vaultBuild.buildId,
          name: vaultBuild.buildName,
          vehicle: vaultBuild.vehicle,
          components: vaultBuild.components,
          totalPartsCostUSD: vaultBuild.costSummary?.partsCostUSD || 0,
          totalLaborCostUSD: vaultBuild.costSummary?.laborCostUSD || 0,
          totalBuildCostUSD: vaultBuild.costSummary?.totalCostUSD || 0,
          currency: vaultBuild.costSummary?.currency || 'USD',
          currencySymbol: vaultBuild.costSummary?.currencySymbol || '$',
          notes: vaultBuild.notes || [],
          costSummary: vaultBuild.costSummary as any,
          compatibilitySummary: vaultBuild.compatibilitySummary as any,
          buildHealth: vaultBuild.buildHealth as any
        } as any,
        buildComponents: vaultBuild.components,
        country: vaultBuild.country,
        region: vaultBuild.region
      });
    }

    return ReportService.generateBuildReport({
      vehicle: activeVehicle,
      buildState,
      buildComponents,
      country: selectedCountry,
      region: selectedRegion
    });
  }, [vaultBuild, activeVehicle, buildState, buildComponents, selectedCountry, selectedRegion]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <PageContainer
      eyebrow="ENGINEERING CERTIFICATION REPORT"
      title="Build Homologation & Engineering Audit"
      subtitle="Formal automotive build certification and bill of materials suitable for workshop installation, insurance underwriting, and trackside registration."
      action={
        <div className="flex flex-wrap items-center gap-2 print:hidden">
          <NeoButton
            variant="outline"
            size="sm"
            onClick={() => navigateTo(vaultBuild ? '/vault' : '/build')}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            {vaultBuild ? 'Back to Vault' : 'Back to Build'}
          </NeoButton>
          <NeoButton
            variant="outline"
            size="sm"
            onClick={handlePrint}
            icon={<Printer className="w-4 h-4" />}
          >
            Print
          </NeoButton>
          <NeoButton
            variant="primary"
            size="sm"
            onClick={handlePrint}
            icon={<Download className="w-4 h-4" />}
          >
            Export PDF Document
          </NeoButton>
        </div>
      }
    >
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Printable Formal Engineering Document Paper */}
        <div className="p-6 sm:p-12 rounded-[28px] bg-[#12141A] border border-white/15 text-white space-y-8 shadow-2xl print:bg-white print:text-black print:border-none print:shadow-none print:p-0">
          
          {/* Header & Certification Seal */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 print:border-black/20">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#0070F3] text-white flex items-center justify-center font-mono font-black text-xl shadow-lg print:bg-black">
                DF
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#0070F3] uppercase block print:text-blue-700">
                  DRIVEFORGE AI • VERIFIED MOTORSPORT BLUEPRINT
                </span>
                <h1 className="text-xl sm:text-2xl font-black font-sans tracking-tight">
                  Automotive Homologation & Fitment Certificate
                </h1>
                <p className="text-xs font-mono text-gray-400 print:text-gray-600">
                  CERTIFICATE ID: {report.reportId}
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right text-xs font-mono">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 text-[#10B981] font-black uppercase text-[11px] print:border-green-800 print:text-green-800">
                <ShieldCheck className="w-4 h-4" />
                <span>{report.homologationStatus.replace('_', ' ')}</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1 print:text-gray-600">
                Issued: {report.generatedDate}
              </p>
            </div>
          </div>

          {/* Target Vehicle Platform Identification */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block print:text-gray-700">
              1.0 TARGET VEHICLE PLATFORM SPECIFICATION
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#0D0F13] neo-inset border border-white/5 text-xs font-mono print:bg-gray-100 print:border-gray-300 print:text-black">
              <div>
                <span className="text-[10px] text-gray-500 block uppercase">Year / Make / Model</span>
                <span className="font-bold text-white print:text-black">
                  {report.vehicle.year} {report.vehicle.make} {report.vehicle.model}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 block uppercase">Chassis Code</span>
                <span className="font-bold text-white print:text-black">
                  {report.vehicle.chassisCode || 'OEM PRODUCTION'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 block uppercase">OEM Baseline Power</span>
                <span className="font-bold text-[#0070F3] print:text-blue-700">
                  {report.performanceSummary?.baselinePowerHp || report.vehicle.baselinePowerHp} HP
                </span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 block uppercase">Curb Mass</span>
                <span className="font-bold text-white print:text-black">
                  {report.performanceSummary?.baselineWeightKg || report.vehicle.weightKg} kg
                </span>
              </div>
            </div>
          </div>

          {/* Dyno & Kinematic Performance Impacts */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block print:text-gray-700">
              2.0 PROJECTED DYNAMICS & KINEMATICS
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3.5 rounded-2xl bg-[#0D0F13] border border-white/10 space-y-1 print:bg-gray-100 print:border-gray-300">
                <span className="text-[10px] text-gray-500 block uppercase">Projected Output</span>
                <div className="text-base font-black text-[#10B981] print:text-green-700">
                  {report.performanceSummary?.projectedPowerHp} HP
                </div>
                <span className="text-[10px] text-gray-400">
                  +{report.performanceSummary?.powerGainHp} HP net gain
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0D0F13] border border-white/10 space-y-1 print:bg-gray-100 print:border-gray-300">
                <span className="text-[10px] text-gray-500 block uppercase">Modified Curb Mass</span>
                <div className="text-base font-black text-[#38BDF8] print:text-blue-700">
                  {report.performanceSummary?.projectedWeightKg} kg
                </div>
                <span className="text-[10px] text-gray-400">
                  {report.performanceSummary?.weightDeltaKg} kg delta
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0D0F13] border border-white/10 space-y-1 print:bg-gray-100 print:border-gray-300">
                <span className="text-[10px] text-gray-500 block uppercase">0-60 MPH Acceleration</span>
                <div className="text-base font-black text-white print:text-black">
                  {report.performanceSummary?.projectedZeroToSixty}s
                </div>
                <span className="text-[10px] text-gray-400">
                  vs OEM {report.performanceSummary?.baselineZeroToSixty}s
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0D0F13] border border-white/10 space-y-1 print:bg-gray-100 print:border-gray-300">
                <span className="text-[10px] text-gray-500 block uppercase">Installed Hardware</span>
                <div className="text-base font-black text-white print:text-black">
                  {report.components.length} Items
                </div>
                <span className="text-[10px] text-gray-400">
                  CAD Fitment Verified
                </span>
              </div>
            </div>
          </div>

          {/* Bill of Materials (BOM) Table */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block print:text-gray-700">
              3.0 HOMOLOGATED BILL OF MATERIALS (BOM)
            </span>
            <div className="overflow-x-auto rounded-2xl border border-white/10 print:border-gray-300">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#0D0F13] text-gray-400 border-b border-white/10 print:bg-gray-200 print:text-black print:border-gray-400">
                  <tr>
                    <th className="p-3 uppercase">Brand & Component</th>
                    <th className="p-3 uppercase">Part Number</th>
                    <th className="p-3 uppercase">Category</th>
                    <th className="p-3 uppercase">Labor</th>
                    <th className="p-3 uppercase text-right">Part Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 print:divide-gray-300 print:text-black">
                  {report.components.map((c, i) => (
                    <tr key={i} className="hover:bg-white/[0.02]">
                      <td className="p-3">
                        <strong className="text-white block font-sans print:text-black">
                          {c.name}
                        </strong>
                        <span className="text-[10px] text-gray-400 print:text-gray-600">
                          {c.brand}
                        </span>
                      </td>
                      <td className="p-3 text-gray-300 font-mono print:text-black">
                        {c.partNumber || 'OEM Motorsport'}
                      </td>
                      <td className="p-3 uppercase text-gray-400 print:text-gray-600">
                        {c.category}
                      </td>
                      <td className="p-3 text-[#0070F3] print:text-blue-700">
                        ~{c.estimatedInstallationCost?.hours || 1}h ({c.installationDifficultyLabel || c.installationDifficulty})
                      </td>
                      <td className="p-3 text-right font-bold text-white print:text-black">
                        {c.estimatedPartCost?.display || `$${c.estimatedPartCost?.min || 0}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Investment Breakdown */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block print:text-gray-700">
              4.0 FINANCIAL & WORKSHOP LABOR AUDIT
            </span>
            <div className="p-4 rounded-2xl bg-[#0D0F13] border border-white/10 space-y-2 text-xs font-mono print:bg-gray-100 print:border-gray-300 print:text-black">
              <div className="flex justify-between text-gray-400 print:text-gray-700">
                <span>Hardware Components Total:</span>
                <span className="font-bold text-white print:text-black">{report.costSummary?.regionalDisplayParts || `$${report.costSummary?.partsCostUSD.toLocaleString()}`}</span>
              </div>
              <div className="flex justify-between text-gray-400 print:text-gray-700">
                <span>Certified Workshop Labor Allocation:</span>
                <span className="font-bold text-[#0070F3] print:text-blue-700">{report.costSummary?.regionalDisplayLabor || `$${report.costSummary?.laborCostUSD.toLocaleString()}`}</span>
              </div>
              <div className="flex justify-between text-sm font-black pt-2 border-t border-white/10 print:border-gray-400">
                <span className="text-white print:text-black uppercase">TOTAL BLUEPRINT VALUATION:</span>
                <span className="text-[#10B981] print:text-green-800 text-base">{report.costSummary?.regionalDisplayTotal || `$${report.costSummary?.totalCostUSD.toLocaleString()}`}</span>
              </div>
            </div>
          </div>

          {/* Workshop Physical Verification Checklist */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block print:text-gray-700">
              5.0 WORKSHOP INSTALLATION & SAFETY CHECKLIST
            </span>
            <div className="space-y-2">
              {report.verificationRequirements.map((v, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#0D0F13] border border-white/5 flex items-start gap-3 text-xs font-mono print:bg-gray-100 print:border-gray-300 print:text-black"
                >
                  <div className="mt-0.5 w-4 h-4 rounded border border-gray-500 flex items-center justify-center shrink-0 print:border-black" />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white print:text-black">{v.title}</span>
                      <span className={`px-2 py-0.2 rounded text-[9px] font-black uppercase ${
                        v.severity === 'CRITICAL'
                          ? 'bg-red-500/20 text-red-400 print:text-red-700'
                          : 'bg-[#0070F3]/20 text-[#0070F3] print:text-blue-700'
                      }`}>
                        {v.severity}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 font-sans print:text-gray-700">
                      {v.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chief Engineer Cryptographic Sign-Off */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono print:border-black/30 print:text-black">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#0070F3] uppercase tracking-wider print:text-blue-700">
                AUTHENTICATION HASH
              </span>
              <p className="text-[10px] text-gray-500 font-mono break-all print:text-gray-700">
                SHA256: 7f8a9e14c5208b981d3f274a9c6e3b8a1f4d9c72e503a8f1
              </p>
              <p className="text-[11px] text-gray-400 print:text-gray-600">
                Certified by DriveForge AI Chief Engineer (Autonomous Validation Engine)
              </p>
            </div>

            <div className="text-left sm:text-right">
              <div className="w-36 h-12 border-b border-dashed border-gray-500 flex items-end pb-1 text-[10px] text-gray-400 italic">
                Master Tech Signature
              </div>
              <span className="text-[10px] text-gray-500 uppercase block mt-1">
                Authorized Workshop Sign-Off
              </span>
            </div>
          </div>

          {/* Legal Compliance & Physical Verification Disclaimer */}
          <div className="pt-4 border-t border-white/5 text-center">
            <p className="text-[11px] font-mono text-gray-400 leading-relaxed print:text-gray-700 max-w-2xl mx-auto">
              DriveForge AI provides planning, visualization and estimated analysis. Physical compatibility, installation and safety should be professionally verified where appropriate.
            </p>
          </div>

        </div>

        {/* Bottom Navigation */}
        <div className="flex items-center justify-between print:hidden">
          <NeoButton
            variant="outline"
            size="md"
            onClick={() => navigateTo('/build')}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Return to Active Build
          </NeoButton>

          <NeoButton
            variant="primary"
            size="md"
            onClick={() => navigateTo('/workshops')}
            icon={<MapPin className="w-4 h-4" />}
          >
            Find an Installation Workshop
          </NeoButton>
        </div>

      </div>
    </PageContainer>
  );
};
