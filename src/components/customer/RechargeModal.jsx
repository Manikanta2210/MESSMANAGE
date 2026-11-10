import React, { useState } from 'react';
import { Wallet } from 'lucide-react';
import Modal from '../common/Modal';
import { useMess } from '../../context/MessContext';
import { formatCurrency } from '../../utils/messCalculations';

export default function RechargeModal({ isOpen, onClose }) {
  const { currentCustomer, rechargeWallet } = useMess();
  const [amount, setAmount] = useState('200');
  const [method, setMethod] = useState('UPI');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !currentCustomer) return null;

  function handleSubmit(e) {
    e.preventDefault();
    const num = Number(amount);
    if (!num || num <= 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      rechargeWallet({
        customerId: currentCustomer.id,
        amount: num,
        paymentMethod: method,
      });
      onClose();
    }, 500);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Top Up Mess Wallet" maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <span className="text-xs text-emerald-800 font-medium block">Current Balance</span>
            <span className="text-xl font-black text-emerald-900">
              {formatCurrency(currentCustomer.walletBalance)}
            </span>
          </div>
          <Wallet className="w-8 h-8 text-emerald-600" />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
            Select or Enter Top-Up Amount (₹)
          </label>
          <input
            type="number"
            min="10"
            max="10000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-lg font-black text-slate-900 focus:outline-hidden focus:bg-white focus:border-emerald-500"
            required
          />
          <div className="flex gap-2 mt-2">
            {['100', '200', '500', '1000'].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmount(preset)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                  amount === preset
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                +₹{preset}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
            Payment Mode
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'UPI', label: 'Instant UPI (GPay/PhonePe)' },
              { id: 'Card', label: 'Debit / Credit Card' },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMethod(m.id)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border text-center transition-all ${
                  method === m.id
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-800 font-bold ring-2 ring-emerald-400/20'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isProcessing}
            className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
          >
            {isProcessing ? 'Adding Funds...' : `Recharge ₹${amount || 0}`}
          </button>
        </div>
      </form>
    </Modal>
  );
}
