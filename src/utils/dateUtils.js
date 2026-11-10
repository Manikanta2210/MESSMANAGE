/**
 * Date utility functions for TaskFlow
 */

// Format YYYY-MM-DD to display string like "Nov 12, 2026"
export function formatDate(dateString) {
  if (!dateString) return 'No due date';
  try {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
    const d = new Date(dateString);
    return isNaN(d.getTime())
      ? dateString
      : d.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
  } catch {
    return dateString;
  }
}

// Get standard YYYY-MM-DD for today or given date offset
export function getDateStringOffset(daysOffset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Check if a task is overdue
export function isOverdue(dueDateString, status) {
  if (!dueDateString || status === 'completed') return false;
  const todayStr = getDateStringOffset(0);
  return dueDateString < todayStr;
}

// Check if a task is due today
export function isDueToday(dueDateString) {
  if (!dueDateString) return false;
  return dueDateString === getDateStringOffset(0);
}

// Get relative due description & urgency badge metadata
export function getDueStatus(dueDateString, status) {
  if (status === 'completed') {
    return {
      text: 'Completed',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      isOverdue: false,
    };
  }

  if (!dueDateString) {
    return {
      text: 'No deadline',
      badgeClass: 'bg-slate-50 text-slate-600 border-slate-200',
      isOverdue: false,
    };
  }

  const todayStr = getDateStringOffset(0);

  if (dueDateString < todayStr) {
    // calculate days overdue
    const d1 = new Date(todayStr);
    const d2 = new Date(dueDateString);
    const diffTime = Math.abs(d1 - d2);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return {
      text: diffDays === 1 ? 'Overdue by 1 day' : `Overdue by ${diffDays} days`,
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 font-semibold',
      isOverdue: true,
      urgent: true,
    };
  }

  if (dueDateString === todayStr) {
    return {
      text: 'Due Today',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200 font-semibold',
      isOverdue: false,
      urgent: true,
    };
  }

  const tomorrowStr = getDateStringOffset(1);
  if (dueDateString === tomorrowStr) {
    return {
      text: 'Due Tomorrow',
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
      isOverdue: false,
    };
  }

  const dToday = new Date(todayStr);
  const dTarget = new Date(dueDateString);
  const diffDays = Math.ceil((dTarget - dToday) / (1000 * 60 * 60 * 24));

  return {
    text: `Due in ${diffDays} days`,
    badgeClass: 'bg-slate-50 text-slate-600 border-slate-200',
    isOverdue: false,
  };
}
