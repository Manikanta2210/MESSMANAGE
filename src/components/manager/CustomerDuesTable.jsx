import React, { useState, useMemo } from 'react';
import {
  Search,
  CreditCard,
  Bell,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { useMess } from '../../context/MessContext';
import { calculateCustomerSummary, formatCurrency } from '../../utils/messCalculations';
import RecordPaymentModal from './RecordPaymentModal';
import StudentLedgerModal from './StudentLedgerModal';

export default function CustomerDuesTable() {
  const { customers, orders, transactions, showToast } = useMess();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, dues, defaulters, clean
  const [selectedStudentForPay, setSelectedStudentForPay] = useState(null);
  const [selectedStudentForLedger, setSelectedStudentForLedger] = useState(null);

  // Compute summaries for all customers
  const customerSummaries = useMemo(() => {
    return customers.map((c) => ({
      ...c,
      summary: calculateCustomerSummary(c, orders, transactions),
    }));
  }, [customers, orders, transactions]);

  // Filtered list
  const filteredCustomers = useMemo(() => {
    return customerSummaries.filter((c) => {
      // Status filter
      if (statusFilter === 'dues' && c.summary.outstandingDues <= 0) return false;
      if (statusFilter === 'defaulters' && !c.summary.isDefaulter) return false;
      if (statusFilter === 'clean' && c.summary.outstandingDues > 0) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = c.name.toLowerCase().includes(q);
        const matchRoll = c.rollNo?.toLowerCase().includes(q);
        const matchRoom = c.roomNo?.toLowerCase().includes(q);
        if (!matchName && !matchRoll && !matchRoom) return false;
      }
      return true;
    });
  }, [customerSummaries, statusFilter, searchQuery]);

  function handleSendReminder(customer) {
    showToast(
      'Due Reminder Dispatched! 📩',
      `SMS and email notification sent to ${customer.name} for ${formatCurrency(
        customer.summary.outstandingDues
      )}.`,
      'info'
    );
  }

  return (
    <div className="space-y-5">
      {/* Table Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <span>Hostel &amp; Student Dues Master Ledger</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor accounts, calculate pending dues, track defaulters, and record offline cash settlements
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start md:self-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              statusFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({customers.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('dues')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              statusFilter === 'dues'
                ? 'bg-white text-rose-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            With Dues ({customerSummaries.filter((c) => c.summary.hasDue).length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('defaulters')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
              statusFilter === 'defaulters'
                ? 'bg-white text-rose-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>High Dues (&gt;₹500)</span>
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('clean')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              statusFilter === 'clean'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cleared
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter by student name, roll number, or hostel room..."
          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 shadow-xs"
        />
      </div>

      {/* Dues Master Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredCustomers.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No students found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                  <th className="py-3 px-4">Student &amp; Roll No</th>
                  <th className="py-3 px-4">Room / Hostel</th>
                  <th className="py-3 px-4">Meals Taken</th>
                  <th className="py-3 px-4">Wallet Balance</th>
                  <th className="py-3 px-4">Total Consumed</th>
                  <th className="py-3 px-4">Net Outstanding Due</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredCustomers.map((cust) => {
                  const s = cust.summary;
                  return (
                    <tr key={cust.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Name & Roll */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">{cust.avatar || '👨‍🎓'}</span>
                          <div>
                            <div className="font-extrabold text-slate-900">{cust.name}</div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              {cust.rollNo} • {cust.plan}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Room */}
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                        {cust.roomNo}
                      </td>

                      {/* Meals Count */}
                      <td className="py-3 px-4 font-semibold text-slate-700 whitespace-nowrap">
                        {s.totalMealsCount} meals
                      </td>

                      {/* Wallet Balance */}
                      <td className="py-3 px-4 font-bold text-emerald-700 whitespace-nowrap">
                        {formatCurrency(s.walletBalance)}
                      </td>

                      {/* Total Consumed */}
                      <td className="py-3 px-4 font-semibold text-slate-800 whitespace-nowrap">
                        {formatCurrency(s.totalMealExpense)}
                      </td>

                      {/* Outstanding Due */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {s.outstandingDues > 0 ? (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-rose-700">
                              {formatCurrency(s.outstandingDues)}
                            </span>
                            {s.isDefaulter && (
                              <span className="px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-black uppercase tracking-wider">
                                Defaulter
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full text-[11px]">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Cleared</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Record Payment */}
                          <button
                            type="button"
                            onClick={() => setSelectedStudentForPay(cust)}
                            title="Record Cash/UPI payment"
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Settle</span>
                          </button>

                          {/* View Statement */}
                          <button
                            type="button"
                            onClick={() => setSelectedStudentForLedger(cust)}
                            title="View student ledger statement"
                            className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          >
                            <FileText className="w-4 h-4" />
                          </button>

                          {/* Reminder button */}
                          {s.outstandingDues > 0 && (
                            <button
                              type="button"
                              onClick={() => handleSendReminder(cust)}
                              title="Send dues reminder"
                              className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            >
                              <Bell className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Payment Modal */}
      <RecordPaymentModal
        isOpen={Boolean(selectedStudentForPay)}
        onClose={() => setSelectedStudentForPay(null)}
        customer={selectedStudentForPay}
      />

      {/* Student Ledger Statement Modal */}
      <StudentLedgerModal
        isOpen={Boolean(selectedStudentForLedger)}
        onClose={() => setSelectedStudentForLedger(null)}
        customer={selectedStudentForLedger}
      />
    </div>
  );
}
