import React from 'react';
import { Clock, ArrowRight, CheckCircle2, Check } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';
import { CATEGORY_CONFIG, PRIORITY_CONFIG } from '../../utils/constants';

export default function RecentTasks({
  tasks,
  onToggleComplete,
  onViewAll,
  onEdit,
}) {
  // Sort by createdAt descending
  const recent = [...tasks]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col h-full">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recently Created</h3>
            <p className="text-xs text-slate-500">Latest additions to your backlog</p>
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
        {recent.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No tasks recorded yet.</p>
        ) : (
          recent.map((task) => {
            const isCompleted = task.status === 'completed';
            const catConf = CATEGORY_CONFIG[task.category] || CATEGORY_CONFIG.Work;
            const prioConf = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.Medium;

            return (
              <div
                key={task.id}
                className="group flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/70 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => onToggleComplete(task.id)}
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
                      isCompleted
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-slate-300 hover:border-indigo-500 bg-white'
                    }`}
                  >
                    {isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
                  </button>
                  <div className="min-w-0">
                    <p
                      onClick={() => onEdit(task)}
                      className={`text-xs font-semibold truncate cursor-pointer hover:text-indigo-600 ${
                        isCompleted ? 'line-through text-slate-400' : 'text-slate-800'
                      }`}
                    >
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[10px] font-medium ${prioConf.iconColor}`}>
                        ● {task.priority}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {formatDate(task.dueDate)}
                      </span>
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[10px] px-2 py-0.5 rounded-md border shrink-0 ${catConf.badge}`}
                >
                  {task.category}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
