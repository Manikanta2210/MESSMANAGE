import React from 'react';
import { Calendar, ArrowRight, AlertCircle, Check } from 'lucide-react';
import { getDueStatus } from '../../utils/dateUtils';
import { CATEGORY_CONFIG } from '../../utils/constants';

export default function UpcomingDeadlines({
  tasks,
  onToggleComplete,
  onViewAll,
  onEdit,
}) {
  // Pending tasks sorted by dueDate ascending
  const upcoming = tasks
    .filter((t) => t.status !== 'completed' && t.dueDate)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 5);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col h-full">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Upcoming Deadlines</h3>
            <p className="text-xs text-slate-500">Approaching milestones and due dates</p>
          </div>
        </div>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
        >
          View all
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="mt-4 flex-1 space-y-2.5">
        {upcoming.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">
            No upcoming pending deadlines!
          </p>
        ) : (
          upcoming.map((task) => {
            const dueInfo = getDueStatus(task.dueDate, task.status);
            const catConf = CATEGORY_CONFIG[task.category] || CATEGORY_CONFIG.Work;

            return (
              <div
                key={task.id}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                  dueInfo.isOverdue
                    ? 'border-rose-200/80 bg-rose-50/30'
                    : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50/70'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => onToggleComplete(task.id)}
                    className="w-4 h-4 rounded border border-slate-300 hover:border-indigo-500 bg-white flex items-center justify-center shrink-0 cursor-pointer"
                  >
                    {/* empty checkbox */}
                  </button>
                  <div className="min-w-0">
                    <p
                      onClick={() => onEdit(task)}
                      className="text-xs font-semibold text-slate-800 truncate cursor-pointer hover:text-indigo-600"
                    >
                      {task.title}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {task.category}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] px-2 py-0.5 rounded-md border shrink-0 flex items-center gap-1 font-medium ${dueInfo.badgeClass}`}
                >
                  {dueInfo.isOverdue && <AlertCircle className="w-3 h-3" />}
                  {dueInfo.text}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
