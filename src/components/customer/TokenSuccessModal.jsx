import React from 'react';
import { CheckCircle2, QrCode, Clock, Utensils, AlertCircle } from 'lucide-react';
import Modal from '../common/Modal';
import { formatCurrency, formatDateTime } from '../../utils/messCalculations';

export default function TokenSuccessModal({ isOpen, onClose, order }) {
  if (!order) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Meal Token Confirmed! 🎉" maxWidth="max-w-md">
      <div className="text-center space-y-4">
        {/* Token Card / Digital Pass */}
        <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />

          <div className="flex items-center justify-between text-xs font-semibold text-amber-100 uppercase tracking-wider pb-3 border-b border-white/20">
            <span>Annapurna Mess Pass</span>
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-white">
              {order.diningOption}
            </span>
          </div>

          {/* Token Big Display */}
          <div className="py-4">
            <span className="text-xs uppercase tracking-widest text-amber-100 font-medium">
              Your Meal Token Number
            </span>
            <div className="text-4xl font-black tracking-wider text-white mt-1 drop-shadow-sm">
              {order.tokenNo}
            </div>
            <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold bg-white text-orange-700 shadow-sm">
              Status: {order.orderStatus === 'Active' ? '🟢 READY TO SERVE' : '🍽️ SERVED'}
            </span>
          </div>

          {/* QR Graphic Mock */}
          <div className="bg-white rounded-xl p-3 text-slate-800 flex items-center justify-center gap-3 shadow-inner">
            <QrCode className="w-14 h-14 text-slate-900" />
            <div className="text-left text-xs">
              <p className="font-bold text-slate-900">{order.customerName}</p>
              <p className="text-slate-500 text-[11px]">{formatDateTime(order.timestamp)}</p>
              <p className="text-orange-600 font-semibold mt-0.5">
                {order.paymentMethod === 'credit_dues' ? 'Added to Dues' : 'Paid & Verified'}
              </p>
            </div>
          </div>
        </div>

        {/* Itemized summary */}
        <div className="bg-slate-50 rounded-xl p-3.5 text-left border border-slate-200">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Utensils className="w-3.5 h-3.5 text-amber-600" />
            Meal Items
          </h4>
          <div className="space-y-1.5 text-xs">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-slate-700">
                <span>
                  {item.quantity}x {item.name}
                </span>
                <span className="font-semibold">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
              <span>Total Amount</span>
              <span className="text-amber-700">{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Counter Instruction Alert */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-left text-xs text-amber-900">
          <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p>
            Please show this digital pass or mention <strong>{order.tokenNo}</strong> at the mess counter.
            The manager will mark it as served when handing over your food.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
        >
          Done / Close Pass
        </button>
      </div>
    </Modal>
  );
}
