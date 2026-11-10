import React, { useState } from 'react';
import {
  QrCode,
  CheckCircle2,
  Clock,
  Search,
  Utensils,
  AlertCircle,
  ChefHat,
} from 'lucide-react';
import { useMess } from '../../context/MessContext';
import { formatCurrency, formatDateTime } from '../../utils/messCalculations';

export default function TokenVerifier() {
  const { orders, redeemToken } = useMess();

  const [tokenSearch, setTokenSearch] = useState('');

  // Active tokens waiting to be served
  const activeOrders = orders.filter((o) => o.orderStatus === 'Active');

  // Recently served tokens
  const redeemedOrders = orders
    .filter((o) => o.orderStatus === 'Redeemed')
    .slice(0, 10);

  // Filtered by search
  const filteredActive = activeOrders.filter((o) => {
    if (!tokenSearch.trim()) return true;
    const q = tokenSearch.toLowerCase();
    return (
      o.tokenNo.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.items.some((i) => i.name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-slate-800 rounded-2xl p-5 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ChefHat className="w-5 h-5 text-indigo-300" />
            <span className="font-extrabold text-sm tracking-wide uppercase text-indigo-200">
              Kitchen &amp; Serving Counter
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            Live Meal Pass Verification &amp; Check-In
          </h2>
          <p className="text-xs text-indigo-100 mt-1 max-w-xl">
            When a student arrives at the food counter with their digital pass or token number,
            verify and click &ldquo;Mark as Served&rdquo; to fulfill the meal order.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/20 text-center min-w-36">
          <span className="block text-2xl font-black text-white">{activeOrders.length}</span>
          <span className="text-[11px] text-indigo-200 font-semibold uppercase tracking-wider">
            Waiting in Queue
          </span>
        </div>
      </div>

      {/* Quick Token Search Box */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={tokenSearch}
            onChange={(e) => setTokenSearch(e.target.value)}
            placeholder="Type Token Number (e.g. TKN-042, 045) or Student Name..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:bg-white focus:border-indigo-500"
          />
        </div>
        {tokenSearch && (
          <button
            type="button"
            onClick={() => setTokenSearch('')}
            className="text-xs text-slate-500 hover:text-slate-800 font-semibold px-2"
          >
            Clear
          </button>
        )}
      </div>

      {/* Live Serving Queue */}
      <div>
        <h3 className="text-sm font-extrabold text-slate-900 mb-3 flex items-center justify-between">
          <span>Active Diners at Counter ({filteredActive.length})</span>
          <span className="text-xs text-slate-500 font-normal">
            Click &ldquo;Serve Meal&rdquo; once food plate is handed over
          </span>
        </h3>

        {filteredActive.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">No Pending Tokens</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              All active tokens have been served. New customer meal orders will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredActive.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border-2 border-indigo-200/80 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar with Token # */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <span className="font-mono text-base font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                      {order.tokenNo}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      {order.diningOption}
                    </span>
                  </div>

                  {/* Customer Info */}
                  <div className="mt-2.5">
                    <h4 className="font-extrabold text-slate-900 text-sm">{order.customerName}</h4>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{formatDateTime(order.timestamp)}</span>
                    </span>
                  </div>

                  {/* Food Items Ordered */}
                  <div className="mt-3 bg-slate-50 rounded-xl p-2.5 space-y-1 text-xs border border-slate-100">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between font-semibold text-slate-700">
                        <span>
                          {it.quantity}x {it.name}
                        </span>
                        <span className="font-mono">{formatCurrency(it.price * it.quantity)}</span>
                      </div>
                    ))}
                    <div className="pt-1.5 border-t border-slate-200 flex justify-between font-black text-slate-900 text-xs">
                      <span>Total Billed:</span>
                      <span className="text-indigo-700">{formatCurrency(order.totalAmount)}</span>
                    </div>
                  </div>

                  {/* Payment status pill */}
                  <div className="mt-2.5 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Billing:</span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded-md ${
                        order.paymentMethod === 'credit_dues'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {order.paymentMethod === 'credit_dues' ? 'Added to Dues' : 'Paid in Advance'}
                    </span>
                  </div>
                </div>

                {/* Serve action button */}
                <button
                  type="button"
                  onClick={() => redeemToken(order.id)}
                  className="mt-4 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark as Served / Claimed</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recently Served Tokens */}
      {redeemedOrders.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Recently Served Tokens ({redeemedOrders.length})
          </h4>
          <div className="divide-y divide-slate-100 text-xs">
            {redeemedOrders.map((o) => (
              <div key={o.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-indigo-700 mr-2">{o.tokenNo}</span>
                  <span className="font-semibold text-slate-800">{o.customerName}</span>
                  <span className="text-slate-500 text-[11px] ml-2">
                    ({o.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{formatCurrency(o.totalAmount)}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                    Served
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
