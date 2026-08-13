import React from "react";
import { Check, Minus, Sparkles } from "lucide-react";
import { PRICING_COMPARISON, PRICING_PLANS } from "@/config/pricing";

export function PricingTable() {
  const renderCell = (val: string | boolean) => {
    if (typeof val === "boolean") {
      return val ? (
        <div className="flex justify-center">
          <div className="w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Check className="w-4 h-4" />
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <Minus className="w-4 h-4 text-slate-300 dark:text-slate-600" />
        </div>
      );
    }
    return <span className="font-semibold text-slate-700 dark:text-slate-200 text-xs sm:text-sm">{val}</span>;
  };

  return (
    <section className="py-16 md:py-24 max-w-6xl mx-auto">
      <div className="text-center mb-12 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-600 border border-red-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Detailed Feature Matrix</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Compare Plans Side-by-Side
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          See exactly what each BachatLal listing tier includes so you can choose with complete confidence.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            {/* Table Header */}
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
                <th className="p-5 sm:p-6 text-sm font-bold text-slate-900 dark:text-white w-2/6">
                  Features & Capabilities
                </th>
                {PRICING_PLANS.map((plan) => (
                  <th
                    key={plan.id}
                    className={`p-5 sm:p-6 text-center w-1/6 ${
                      plan.highlight
                        ? "bg-red-50/50 dark:bg-red-950/20 text-red-600 dark:text-red-400 font-extrabold"
                        : "text-slate-900 dark:text-white font-bold"
                    }`}
                  >
                    <div className="text-base sm:text-lg">{plan.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                      {plan.price} <span className="text-[10px]">/ {plan.period}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body Groups */}
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {PRICING_COMPARISON.map((categoryGroup, cIdx) => (
                <React.Fragment key={cIdx}>
                  {/* Category Header Row */}
                  <tr className="bg-slate-100/60 dark:bg-slate-800/80">
                    <td
                      colSpan={5}
                      className="py-3 px-5 sm:px-6 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300"
                    >
                      {categoryGroup.category}
                    </td>
                  </tr>

                  {/* Feature Rows */}
                  {categoryGroup.features.map((feature, fIdx) => (
                    <tr
                      key={fIdx}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="p-4 sm:p-5 text-slate-800 dark:text-slate-200 font-medium text-xs sm:text-sm">
                        {feature.name}
                      </td>
                      <td className="p-4 sm:p-5 text-center">{renderCell(feature.free)}</td>
                      <td className="p-4 sm:p-5 text-center bg-red-50/20 dark:bg-red-950/10">
                        {renderCell(feature.pro)}
                      </td>
                      <td className="p-4 sm:p-5 text-center">{renderCell(feature.premium)}</td>
                      <td className="p-4 sm:p-5 text-center">{renderCell(feature.enterprise)}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
