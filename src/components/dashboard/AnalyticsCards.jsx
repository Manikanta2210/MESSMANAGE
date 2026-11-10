import React from 'react';
import { CATEGORIES, PRIORITIES, CATEGORY_CONFIG, PRIORITY_CONFIG } from '../../utils/constants';
import { PieChart, BarChart3, CheckCircle2 } from 'lucide-react';

export default function AnalyticsCards({ tasks, onFilterCategory, onFilterPriority }) {
  const total = tasks.length || 1;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Category Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <PieChart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Category Distribution</h3>
              <p className="text-xs text-slate-500">Tasks segmented by domain</p>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {CATEGORIES.map((cat) => {
            const count = tasks.filter((t) => t.category === cat).length;
            const completedCount = tasks.filter(
              (t) => t.category === cat && t.status === 'completed'
            ).length;
            const pct = Math.round((count / total) * 100);
            const conf = CATEGORY_CONFIG[cat];

            return (
              <div
                key={cat}
                onClick={() => onFilterCategory && onFilterCategory(cat)}
                className="group p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="flex items-center gap-2 text-slate-700">
                    <span className={`w-2.5 h-2.5 rounded-full ${conf.dot}`} />
                    {cat}
                  </span>
                  <span className="text-slate-500 font-normal">
                    <span className="font-semibold text-slate-800">{count}</span> tasks ({completedCount} done)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: conf.accent,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Priority Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Priority Levels</h3>
              <p className="text-xs text-slate-500">Urgency classification</p>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {PRIORITIES.map((prio) => {
            const count = tasks.filter((t) => t.priority === prio).length;
            const pendingCount = tasks.filter(
              (t) => t.priority === prio && t.status !== 'completed'
            ).length;
            const pct = Math.round((count / total) * 100);
            const conf = PRIORITY_CONFIG[prio];

            return (
              <div
                key={prio}
                onClick={() => onFilterPriority && onFilterPriority(prio)}
                className="group p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="flex items-center gap-2 text-slate-700">
                    <span className={`w-2.5 h-2.5 rounded-full ${conf.indicator}`} />
                    {prio} Priority
                  </span>
                  <span className="text-slate-500 font-normal">
                    <span className="font-semibold text-slate-800">{count}</span> total ({pendingCount} pending)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${conf.indicator}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
