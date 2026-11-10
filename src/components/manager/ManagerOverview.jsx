import React from 'react';
import {
  ReceiptIndianRupee,
  UtensilsCrossed,
  TrendingUp,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useMess } from '../../context/MessContext';
import { formatCurrency, formatDateTime } from '../../utils/messCalculations';

export default function ManagerOverview({ onNavigateTab }) {
  const { managerStats, orders, transactions, customers } = useMess();

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Outstanding Mess Dues */}
        <div className="bg-gradient-to-br from-rose-50 to-orange-50 border border-rose-200/80 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-rose-700 uppercase tracking-wider mb-2">
            <span>Outstanding Dues</span>
            <ReceiptIndianRupee className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-3xl font-black text-rose-950">
            {formatCurrency(managerStats.totalDuesPending)}
          </div>
          <div className="mt-2 text-xs text-rose-800 flex items-center justify-between">
            <span>{managerStats.totalDefaulters} high defaulter(s)</span>
            <button
              type="button"
              onClick={() => onNavigateTab('dues')}
              className="font-bold underline hover:text-rose-950 flex items-center gap-0.5"
            >
              <span>View list</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Total Revenue Collected */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/80 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">
            <span>Revenue Collected</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-950">
            {formatCurrency(managerStats.totalRevenueCollected)}
          </div>
          <p className="mt-2 text-xs text-emerald-800">
            Across online UPI, prepaid wallets &amp; cash settlements
          </p>
        </div>

        {/* Meals Ordered Today */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">
            <span>Meals Ordered Today</span>
            <UtensilsCrossed className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-black text-amber-950">
            {managerStats.totalMealsToday}
          </div>
          <p className="mt-2 text-xs text-amber-800">
            {managerStats.totalOrdersAllTime} lifetime mess dining orders
          </p>
        </div>

        {/* Active Counter Tokens */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200/80 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-indigo-700 uppercase tracking-wider mb-2">
            <span>Pending Counter Passes</span>
            <Clock className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-black text-indigo-950">
            {managerStats.pendingTokensToServe}
          </div>
          <div className="mt-2 text-xs text-indigo-800 flex items-center justify-between">
            <span>Waiting to be served</span>
            <button
              type="button"
              onClick={() => onNavigateTab('tokens')}
              className="font-bold underline hover:text-indigo-950 flex items-center gap-0.5"
            >
              <span>Verify counter</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Section: Live Queue + Recent Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Active Diner Queue */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span>Next Diners in Kitchen Queue</span>
              </h3>
              <button
                type="button"
                onClick={() => onNavigateTab('tokens')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
              >
                Go to Counter &rarr;
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {orders
                .filter((o) => o.orderStatus === 'Active')
                .slice(0, 4)
                .map((order) => (
                  <div key={order.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-extrabold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md">
                          {order.tokenNo}
                        </span>
                        <span className="font-bold text-xs text-slate-900">
                          {order.customerName}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 mt-0.5 block">
                        {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                      </span>
                    </div>
                    <span className="text-xs font-black text-slate-800">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>
                ))}
              {orders.filter((o) => o.orderStatus === 'Active').length === 0 && (
                <div className="py-8 text-center text-xs text-slate-400">
                  No pending meals in queue right now.
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => onNavigateTab('menu')}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200/80 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>Update Today&apos;s Menu Items</span>
            </button>
          </div>
        </div>

        {/* Right: Recent Ledger & Payment Settlements */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <ReceiptIndianRupee className="w-4 h-4 text-emerald-600" />
                <span>Recent Financial Receipts</span>
              </h3>
              <button
                type="button"
                onClick={() => onNavigateTab('dues')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
              >
                View all dues &rarr;
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {transactions.slice(0, 4).map((txn) => {
                const cust = customers.find((c) => c.id === txn.customerId);
                return (
                  <div key={txn.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        {cust?.name || 'Customer'}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {txn.method} • {formatDateTime(txn.timestamp)}
                      </div>
                    </div>
                    <span className="text-xs font-black text-emerald-700">
                      +{formatCurrency(txn.amount)}
                    </span>
                  </div>
                );
              })}
              {transactions.length === 0 && (
                <div className="py-8 text-center text-xs text-slate-400">
                  No payments recorded yet.
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => onNavigateTab('dues')}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>Record Cash/UPI Settlement for Student</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
