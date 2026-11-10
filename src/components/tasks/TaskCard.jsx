import React from 'react';
import {
  Check,
  Calendar,
  Clock,
  MoreVertical,
  Pencil,
  Trash2,
  AlertCircle,
  Folder,
} from 'lucide-react';
import { CATEGORY_CONFIG, PRIORITY_CONFIG } from '../../utils/constants';
import { formatDate, getDueStatus } from '../../utils/dateUtils';

export default function TaskCard({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}) {
  const isCompleted = task.status === 'completed';
  const categoryConf = CATEGORY_CONFIG[task.category] || CATEGORY_CONFIG.Work;
  const priorityConf = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.Medium;
  const dueInfo = getDueStatus(task.dueDate, task.status);

  return (
    <div
      className={`group relative bg-white rounded-2xl border transition-all duration-200 p-5 shadow-xs hover:shadow-md hover:border-slate-300 ${
        isCompleted
          ? 'border-slate-200 bg-slate-50/50 opacity-80'
          : 'border-slate-200/90'
      }`}
    >
      {/* Priority accent pill on left border */}
      <div
        className={`absolute top-4 left-0 bottom-4 w-1 rounded-r-full ${
          isCompleted ? 'bg-slate-300' : priorityConf.indicator
        }`}
      />

      <div className="flex items-start gap-3.5">
        {/* Toggle Checkbox */}
        <button
          onClick={() => onToggleComplete(task.id)}
          className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
            isCompleted
              ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs'
              : 'border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/50 bg-white'
          }`}
          title={isCompleted ? 'Mark as pending' : 'Mark as completed'}
        >
          {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header badges */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            {/* Category */}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${categoryConf.badge}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${categoryConf.dot}`} />
              {task.category}
            </span>

            {/* Priority */}
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${priorityConf.badge}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${priorityConf.indicator}`} />
              {task.priority}
            </span>

            {/* Due date urgency badge */}
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] border ${dueInfo.badgeClass}`}
            >
              {dueInfo.isOverdue ? (
                <AlertCircle className="w-3 h-3 text-rose-500" />
              ) : (
                <Clock className="w-3 h-3 text-slate-400" />
              )}
              {dueInfo.text}
            </span>
          </div>

          {/* Title */}
          <h3
            className={`text-base font-semibold leading-snug transition-colors ${
              isCompleted
                ? 'line-through text-slate-400'
                : 'text-slate-800 group-hover:text-indigo-600'
            }`}
          >
            {task.title}
          </h3>

          {/* Description */}
          {task.description && (
            <p
              className={`mt-1.5 text-xs sm:text-sm line-clamp-2 leading-relaxed ${
                isCompleted ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Footer Metadata & Actions */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(task.dueDate)}</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit(task)}
                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                title="Edit task"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(task)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
