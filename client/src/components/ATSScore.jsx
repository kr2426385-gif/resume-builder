import React from "react";
import { Sparkles, CheckCircle2, AlertCircle } from "lucide-react";

const ATSScore = ({ score = 85, accentColor = "6366F1" }) => {
  // Determine status details based on score
  let statusText = "Excellent Match";
  let statusColor = "text-emerald-650 bg-emerald-50 border-emerald-100";
  let description = "Your resume is highly optimized for applicant tracking systems.";

  if (score < 50) {
    statusText = "Needs Work";
    statusColor = "text-rose-650 bg-rose-50 border-rose-100";
    description = "Add more detailed experience and core skills to pass automated screenings.";
  } else if (score < 80) {
    statusText = "Good Match";
    statusColor = "text-amber-650 bg-amber-50 border-amber-100";
    description = "Very close! Try adding specific metrics and keywords from your target job.";
  }

  const radius = 30;
  const stroke = 6;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Normalise accentColor to ensure it is in hex hash format
  const colorHex = accentColor.startsWith("#") ? accentColor : `#${accentColor}`;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-6">
      {/* Circle Progress */}
      <div className="relative flex-shrink-0">
        <svg width="80" height="80" className="-rotate-90">
          <circle
            cx="40"
            cy="40"
            r={normalizedRadius}
            stroke="#F1F5F9"
            strokeWidth={stroke}
            fill="transparent"
          />
          <circle
            cx="40"
            cy="40"
            r={normalizedRadius}
            stroke={colorHex}
            strokeWidth={stroke}
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-slate-800">{score}%</span>
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="text-sm font-semibold text-slate-900">ATS Scan Score</h4>
          <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${statusColor}`}>
            {statusText}
          </span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
      </div>

      {/* Mini Tip */}
      <div className="hidden sm:flex items-center gap-2.5 bg-slate-50 border border-slate-100 p-3 rounded-xl max-w-xs">
        <Sparkles className="size-4 text-indigo-500 flex-shrink-0" />
        <span className="text-[11px] text-slate-600 leading-normal">
          Tip: Enhance your professional summary and job experience with AI to naturally include key industry metrics.
        </span>
      </div>
    </div>
  );
};

export default ATSScore;