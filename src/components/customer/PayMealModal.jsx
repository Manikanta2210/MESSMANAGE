import React, { useState } from 'react';
import {
  Wallet,
  QrCode,
  CreditCard,
  ReceiptIndianRupee,
  Utensils,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import Modal from '../common/Modal';
import { useMess } from '../../context/MessContext';
import { formatCurrency } from '../../utils/messCalculations';

export default function PayMealModal({ isOpen, onClose, items = [], onSuccessOrder }) {
  const { currentCustomer, currentCustomerSummary, placeMealOrder } = useMess();

  const [paymentMethod, setPaymentMethod] = useState('wallet');
  const [diningOption, setDiningOption] = useState('Dine-in');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || items.length === 0) return null;

  const totalAmount = items.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );

  const walletBalance = Number(currentCustomer?.walletBalance) || 0;
  const isWalletInsufficient = paymentMethod === 'wallet' && walletBalance < totalAmount;

  function handlePayNow() {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const createdOrder = placeMealOrder({
        items,
        paymentMethod,
        diningOption,
      });

      if (createdOrder) {
        onClose();
        if (onSuccessOrder) {
          onSuccessOrder(createdOrder);
        }
      }
    }, 600);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Pay to Eat • Meal Checkout" maxWidth="max-w-lg">
      <div className="space-y-5">
        {/* Items Summary */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            <span>Selected Meal</span>
            <span>Qty & Price</span>
          </div>
          <div className="space-y-2 divide-y divide-slate-100">
            {items.map((it, idx) => (
              <div key={idx} className="pt-2 first:pt-0 flex items-center justify-between text-sm">
                <div>
                  <span className="font-semibold text-slate-800">{it.name}</span>
                  <span className="text-xs text-slate-500 ml-1.5">x {it.quantity || 1}</span>
                </div>
                <span className="font-bold text-slate-900">
                  {formatCurrency((it.price || 0) * (it.quantity || 1))}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-700">Total Payable</span>
            <span className="text-lg font-black text-amber-700">{formatCurrency(totalAmount)}</span>
          </div>
        </div>

        {/* Dining Option (Dine-in vs Takeaway) */}
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            Dining Preference
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDiningOption('Dine-in')}
              className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 transition-all ${
                diningOption === 'Dine-in'
                  ? 'bg-amber-50 border-amber-300 text-amber-800 font-bold ring-2 ring-amber-400/20'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Utensils className="w-4 h-4" />
              <span>Dine-in (Mess Hall)</span>
            </button>
            <button
              type="button"
              onClick={() => setDiningOption('Takeaway')}
              className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 transition-all ${
                diningOption === 'Takeaway'
                  ? 'bg-amber-50 border-amber-300 text-amber-800 font-bold ring-2 ring-amber-400/20'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>🥡 Parcel / Takeaway</span>
            </button>
          </div>
        </div>

        {/* Payment Methods */}
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            Select Payment Method
          </label>
          <div className="space-y-2">
            {/* 1. Prepaid Mess Wallet */}
            <label
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                paymentMethod === 'wallet'
                  ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-400/20'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="wallet"
                checked={paymentMethod === 'wallet'}
                onChange={() => setPaymentMethod('wallet')}
                className="mt-1 text-emerald-600 focus:ring-emerald-500"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900">
                    <Wallet className="w-4 h-4 text-emerald-600" />
                    <span>Prepaid Mess Wallet</span>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Balance: {formatCurrency(walletBalance)}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Instant debit from your stored mess balance.
                </p>
                {isWalletInsufficient && (
                  <p className="text-xs font-semibold text-rose-600 mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Insufficient balance. Recharge wallet or choose Pay via UPI / Add to Dues.
                  </p>
                )}
              </div>
            </label>

            {/* 2. Instant UPI (GPay / PhonePe / Paytm) */}
            <label
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                paymentMethod === 'upi'
                  ? 'border-indigo-500 bg-indigo-50/60 ring-2 ring-indigo-400/20'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="upi"
                checked={paymentMethod === 'upi'}
                onChange={() => setPaymentMethod('upi')}
                className="mt-1 text-indigo-600 focus:ring-indigo-500"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900">
                    <QrCode className="w-4 h-4 text-indigo-600" />
                    <span>Instant UPI / QR Code</span>
                  </div>
                  <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md">
                    Zero Extra Fee
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Scan and pay via GPay, PhonePe, Paytm, or BHIM.
                </p>
              </div>
            </label>

            {/* 3. Add to Mess Dues (Pay Later) */}
            <label
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                paymentMethod === 'credit_dues'
                  ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-400/20'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="credit_dues"
                checked={paymentMethod === 'credit_dues'}
                onChange={() => setPaymentMethod('credit_dues')}
                className="mt-1 text-amber-600 focus:ring-amber-500"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900">
                    <ReceiptIndianRupee className="w-4 h-4 text-amber-600" />
                    <span>Add to Mess Dues (Pay Later)</span>
                  </div>
                  <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                    Student Credit
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Eat now and settle with your monthly mess bill. Current Dues:{' '}
                  <strong className="text-slate-800">
                    {formatCurrency(currentCustomerSummary?.outstandingDues || 0)}
                  </strong>
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handlePayNow}
            disabled={isProcessing || isWalletInsufficient}
            className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <span>Verifying Payment...</span>
            ) : (
              <>
                <span>Pay {formatCurrency(totalAmount)} & Generate Pass</span>
                <CheckCircle className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
