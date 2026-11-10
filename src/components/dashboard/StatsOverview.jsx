import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Layers,
  TrendingUp,
} from 'lucide-react';

export default function StatsOverview({ tasks, onFilterClick }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const pending = tasks.filter((t) => t.status === 'pending').length;

  const todayStr = new Date().toISOString().split('T')[0];
  const overdue = tasks.filter(
    (t) => t.status !== 'completed' && t.dueDate && t.dueDate < todayStr
  ).length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const stats = [
    {
      label: 'Total Tasks',
      value: total,
      subtext: 'All active & closed items',
      icon: Layers,
      color: 'indigo',
      bgIcon: 'bg-indigo-50 text-indigo-600',
      borderAccent: 'border-b-indigo-500',
      filterTarget: 'all',
    },
    {
      label: 'Pending',
      value: pending,
      subtext: 'Awaiting completion',
      icon: Clock,
      color: 'blue',
      bgIcon: 'bg-blue-50 text-blue-600',
      borderAccent: 'border-b-blue-500',
      filterTarget: 'pending',
    },
    {
      label: 'Completed',
      value: completed,
      subtext: `${completionRate}% completion rate`,
      icon: CheckCircle2,
      color: 'emerald',
      bgIcon: 'bg-emerald-50 text-emerald-600',
      borderAccent: 'border-b-emerald-500',
      filterTarget: 'completed',
    },
    {
      label: 'Overdue',
      value: overdue,
      subtext: overdue > 0 ? 'Requires attention' : 'No overdue tasks',
      icon: AlertTriangle,
      color: 'rose',
      bgIcon: 'bg-rose-50 text-rose-600',
      borderAccent: 'border-b-rose-500',
      filterTarget: 'overdue',
      highlight: overdue > 0,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              onClick={() => onFilterClick && onFilterClick(stat.filterTarget)}
              className="group relative bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${stat.bgIcon}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                <span>{stat.subtext}</span>
                <span className="text-indigo-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  View →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Progress Bar Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg shadow-indigo-950/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-indigo-500/20 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-medium backdrop-blur-xs">
              <TrendingUp className="w-3.5 h-3.5" />
              Productivity Score
            </div>
            <h3 className="text-xl font-bold tracking-tight text-white mt-1">
              {completionRate === 100 && total > 0
                ? 'All Tasks Finished! Outstanding Work!'
                : completionRate >= 50
                ? 'Steady Momentum! More than halfway done.'
                : 'Stay focused on your highest priority targets.'}
            </h3>
            <p className="text-sm text-indigo-200/80">
              {completed} of {total} total tasks marked completed ({completionRate}%)
            </p>
          </div>

          <div className="w-full md:w-72 bg-white/10 p-4 rounded-xl backdrop-blur-xs border border-white/10">
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="text-indigo-200">Overall Progress</span>
              <span className="text-white text-sm font-bold">{completionRate}%</span>
            </div>
            <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-indigo-300 rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
