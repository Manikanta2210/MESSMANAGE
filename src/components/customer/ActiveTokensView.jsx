import React from 'react';
import { QrCode, Clock, Utensils, CheckCircle2, AlertCircle } from 'lucide-react';
import { useMess } from '../../context/MessContext';
import { formatCurrency, formatDateTime } from '../../utils/messCalculations';

export default function ActiveTokensView({ onShowTokenModal }) {
  const { currentCustomer, orders } = useMess();

  if (!currentCustomer) return null;

  const myActiveOrders = orders.filter(
    (o) => o.customerId === currentCustomer.id && o.orderStatus === 'Active'
  );

  const myServedOrders = orders
    .filter((o) => o.customerId === currentCustomer.id && o.orderStatus === 'Redeemed')
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Active Passes Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Active Meal Passes ({myActiveOrders.length})
            </h3>
            <p className="text-xs text-slate-500">
              Present this pass or token number at the serving counter to receive your food plate
            </p>
          </div>
        </div>

        {myActiveOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center shadow-xs">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <QrCode className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">No Active Passes</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              You haven&apos;t generated any meal passes yet for today. Go to &ldquo;Today&apos;s Menu&rdquo; and click &ldquo;Pay to Eat&rdquo;.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myActiveOrders.map((order) => (
              <div
                key={order.id}
                className="bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-white/20">
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-100">
                      Live Dining Pass
                    </span>
                    <span className="bg-white/20 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                      {order.diningOption}
                    </span>
                  </div>

                  <div className="py-4 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-amber-100 uppercase tracking-wider block">
                        Token Number
                      </span>
                      <div className="text-3xl font-black tracking-wider text-white mt-0.5">
                        {order.tokenNo}
                      </div>
                      <span className="text-[11px] text-amber-200 mt-0.5 block">
                        {formatDateTime(order.timestamp)}
                      </span>
                    </div>

                    <div className="bg-white/95 p-2 rounded-xl text-slate-900 shadow-sm flex flex-col items-center">
                      <QrCode className="w-12 h-12" />
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-600 mt-0.5">
                        SCAN COUNTER
                      </span>
                    </div>
                  </div>

                  {/* Meals inside */}
                  <div className="bg-black/15 rounded-xl p-3 text-xs space-y-1">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between font-medium">
                        <span>
                          {it.quantity}x {it.name}
                        </span>
                        <span className="font-bold">{formatCurrency(it.price * it.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-100">
                    {order.paymentMethod === 'credit_dues' ? 'Billed to Dues' : 'Paid & Verified'}
                  </span>
                  <button
                    type="button"
                    onClick={() => onShowTokenModal(order)}
                    className="px-3 py-1.5 bg-white text-orange-700 hover:bg-amber-50 rounded-lg text-xs font-bold shadow-xs transition-colors"
                  >
                    View Pass
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recently Served History */}
      {myServedOrders.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Recently Claimed & Served Meals</span>
          </h4>
          <div className="divide-y divide-slate-100 text-xs">
            {myServedOrders.map((order) => (
              <div key={order.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">
                    {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                  </span>
                  <div className="text-[11px] text-slate-500">
                    Token #{order.tokenNo} • {formatDateTime(order.timestamp)}
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900 block">
                    {formatCurrency(order.totalAmount)}
                  </span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
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
