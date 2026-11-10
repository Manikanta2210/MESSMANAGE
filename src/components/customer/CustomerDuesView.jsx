import React, { useState } from 'react';
import {
  Wallet,
  ReceiptIndianRupee,
  CreditCard,
  PlusCircle,
  History,
  Utensils,
  FileText,
} from 'lucide-react';
import { useMess } from '../../context/MessContext';
import { formatCurrency, formatDateTime } from '../../utils/messCalculations';
import Modal from '../common/Modal';

export default function CustomerDuesView({ onOpenRecharge }) {
  const {
    currentCustomer,
    currentCustomerSummary,
    orders,
    transactions,
    recordPayment,
  } = useMess();

  const [payDuesModalOpen, setPayDuesModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('UPI');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterType, setFilterType] = useState('all'); // all, orders, payments

  if (!currentCustomer || !currentCustomerSummary) return null;

  // Customer specific orders and transactions
  const myOrders = orders.filter((o) => o.customerId === currentCustomer.id);
  const myTxns = transactions.filter((t) => t.customerId === currentCustomer.id);

  // Combined chronological ledger items
  const combinedHistory = [
    ...myOrders.map((o) => ({
      type: 'order',
      id: o.id,
      title: o.items.map((i) => `${i.quantity}x ${i.name}`).join(', '),
      amount: o.totalAmount,
      date: o.timestamp,
      method: o.paymentMethod === 'credit_dues' ? 'Charge to Dues' : o.paymentMethod.toUpperCase(),
      status: o.paymentStatus === 'paid' ? 'Paid' : 'Unpaid (Due)',
      orderStatus: o.orderStatus,
      tokenNo: o.tokenNo,
    })),
    ...myTxns.map((t) => ({
      type: 'payment',
      id: t.id,
      title: t.description || 'Mess Payment',
      amount: t.amount,
      date: t.timestamp,
      method: t.method,
      status: 'Settled',
      orderStatus: 'Completed',
      tokenNo: null,
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  const filteredHistory = combinedHistory.filter((item) => {
    if (filterType === 'orders') return item.type === 'order';
    if (filterType === 'payments') return item.type === 'payment';
    return true;
  });

  function handleOpenPayDues() {
    setPayAmount(currentCustomerSummary.outstandingDues.toString());
    setPayDuesModalOpen(true);
  }

  function handleClearDuesSubmit(e) {
    e.preventDefault();
    const amt = Number(payAmount);
    if (!amt || amt <= 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      recordPayment({
        customerId: currentCustomer.id,
        amount: amt,
        paymentMethod: payMethod,
        notes: `Online Dues Clearance by ${currentCustomer.name}`,
      });
      setPayDuesModalOpen(false);
    }, 500);
  }

  return (
    <div className="space-y-6">
      {/* Top Banner / Dues Calculation Explainer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Outstanding Mess Dues */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            currentCustomerSummary.outstandingDues > 0
              ? 'bg-gradient-to-br from-rose-50 to-orange-50/50 border-rose-200 shadow-sm'
              : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            <span>Outstanding Dues</span>
            <ReceiptIndianRupee className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight">
            {formatCurrency(currentCustomerSummary.outstandingDues)}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {currentCustomerSummary.outstandingDues > 0
              ? `${currentCustomerSummary.unpaidOrdersCount} unpaid meal(s) on your credit ledger`
              : 'Zero pending dues. Your mess account is clean!'}
          </p>

          {currentCustomerSummary.outstandingDues > 0 && (
            <button
              type="button"
              onClick={handleOpenPayDues}
              className="mt-4 w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Clear Dues Now</span>
            </button>
          )}
        </div>

        {/* Card 2: Mess Wallet Balance */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            <span>Prepaid Wallet Balance</span>
            <Wallet className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight">
            {formatCurrency(currentCustomerSummary.walletBalance)}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Usable for 1-click &quot;Pay to Eat&quot; at the dining hall
          </p>

          <button
            type="button"
            onClick={onOpenRecharge}
            className="mt-4 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Top Up Wallet</span>
          </button>
        </div>

        {/* Card 3: Total Meals & Consumption */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              <span>Lifetime Food Bill</span>
              <Utensils className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {formatCurrency(currentCustomerSummary.totalMealExpense)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Across {currentCustomerSummary.totalMealsCount} meals taken since enrollment
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Student Plan:</span>
            <span className="font-bold text-slate-800">{currentCustomer.plan}</span>
          </div>
        </div>
      </div>

      {/* Transparent Calculation Ledger Formula */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4 text-amber-400" />
          Dues Calculation Breakdown
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center sm:text-left">
          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <span className="text-[11px] text-slate-400 block">Total Meals Cost</span>
            <span className="text-base font-extrabold text-white">
              {formatCurrency(currentCustomerSummary.totalMealExpense)}
            </span>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <span className="text-[11px] text-slate-400 block">Total Paid Directly</span>
            <span className="text-base font-extrabold text-emerald-400">
              - {formatCurrency(currentCustomerSummary.totalPaidOrders)}
            </span>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <span className="text-[11px] text-slate-400 block">Ledger Settlements</span>
            <span className="text-base font-extrabold text-teal-400">
              {formatCurrency(currentCustomerSummary.totalLedgerPaid)}
            </span>
          </div>
          <div className="p-3 bg-white/10 rounded-xl border border-amber-500/40">
            <span className="text-[11px] text-amber-300 font-bold block">Current Net Due</span>
            <span className="text-base font-black text-amber-400">
              {formatCurrency(currentCustomerSummary.outstandingDues)}
            </span>
          </div>
        </div>
      </div>

      {/* Itemized Transaction & Meal History Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <History className="w-4 h-4 text-slate-600" />
              <span>Itemized Statements & Meal History</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Every meal token and payment recorded on your account
            </p>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                filterType === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Records
            </button>
            <button
              type="button"
              onClick={() => setFilterType('orders')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                filterType === 'orders'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Meals Only
            </button>
            <button
              type="button"
              onClick={() => setFilterType('payments')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                filterType === 'payments'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Payments Only
            </button>
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No transaction records found for this filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200/70 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Description / Item</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredHistory.map((item) => {
                  const isOrder = item.type === 'order';
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 whitespace-nowrap text-slate-600">
                        {formatDateTime(item.date)}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 text-xs ${
                              isOrder
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {isOrder ? '🍛' : '💳'}
                          </span>
                          <div>
                            <div>{item.title}</div>
                            {item.tokenNo && (
                              <span className="text-[10px] text-amber-700 font-mono">
                                Token #{item.tokenNo} ({item.orderStatus})
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{item.method}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            item.status === 'Paid' || item.status === 'Settled'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800 animate-pulse'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td
                        className={`py-3 px-4 text-right font-black whitespace-nowrap ${
                          isOrder ? 'text-slate-900' : 'text-emerald-700'
                        }`}
                      >
                        {isOrder ? `-${formatCurrency(item.amount)}` : `+${formatCurrency(item.amount)}`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Clear Dues Modal */}
      <Modal
        isOpen={payDuesModalOpen}
        onClose={() => setPayDuesModalOpen(false)}
        title="Pay Mess Dues • Settlement"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleClearDuesSubmit} className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900">
            <p className="font-semibold">Settling Mess Account Dues</p>
            <p className="text-[11px] mt-0.5">
              Student: <strong>{currentCustomer.name}</strong> ({currentCustomer.rollNo})
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Payment Amount (₹)
            </label>
            <input
              type="number"
              min="1"
              value={payAmount}
              onChange={(e) => setPayAmount(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-black text-slate-900 focus:outline-hidden focus:bg-white focus:border-amber-500"
              required
            />
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => setPayAmount(currentCustomerSummary.outstandingDues.toString())}
                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-md text-[11px] font-semibold text-slate-700"
              >
                Full Dues ({formatCurrency(currentCustomerSummary.outstandingDues)})
              </button>
              <button
                type="button"
                onClick={() => setPayAmount('100')}
                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-md text-[11px] font-semibold text-slate-700"
              >
                ₹100
              </button>
              <button
                type="button"
                onClick={() => setPayAmount('200')}
                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-md text-[11px] font-semibold text-slate-700"
              >
                ₹200
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Payment Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['UPI (GPay/PhonePe)', 'Debit Card', 'Cash to Mess'].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setPayMethod(mode)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                    payMethod === mode
                      ? 'bg-amber-50 border-amber-400 text-amber-800 ring-2 ring-amber-400/20'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setPayDuesModalOpen(false)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md"
            >
              {isSubmitting ? 'Processing Payment...' : `Confirm Pay ₹${payAmount || 0}`}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
