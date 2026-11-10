import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { useMess } from '../../context/MessContext';
import { formatCurrency } from '../../utils/messCalculations';

export default function RecordPaymentModal({ isOpen, onClose, customer }) {
  const { recordPayment } = useMess();

  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('Cash to Manager');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (customer?.summary) {
      setAmount(customer.summary.outstandingDues > 0 ? customer.summary.outstandingDues.toString() : '100');
    }
  }, [customer]);

  if (!isOpen || !customer) return null;

  function handleSubmit(e) {
    e.preventDefault();
    const num = Number(amount);
    if (!num || num <= 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      recordPayment({
        customerId: customer.id,
        amount: num,
        paymentMethod: method,
        notes: notes.trim() || `Mess staff cash/UPI collection for ${customer.name}`,
      });
      onClose();
    }, 500);
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Customer Dues Payment 💵"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Customer Info Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-800">{customer.name}</div>
            <div className="text-[11px] text-slate-500 font-mono">
              {customer.rollNo} • {customer.roomNo}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">
              Current Due
            </span>
            <span className="text-base font-black text-rose-700">
              {formatCurrency(customer.summary?.outstandingDues || 0)}
            </span>
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
            Received Payment Amount (₹) *
          </label>
          <input
            type="number"
            min="1"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-lg font-black text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-500"
          />
        </div>

        {/* Payment Channel */}
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
            Collection Channel
          </label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:bg-white"
          >
            <option value="Cash to Manager">Cash at Mess Counter</option>
            <option value="Mess Official UPI">Mess Official UPI (GPay/PhonePe)</option>
            <option value="Hostel Bank Transfer">Hostel Bank Transfer / NEFT</option>
            <option value="Fee Adjustment">Hostel Fee Adjustment / Scholarship</option>
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
            Manager Notes / Receipt Ref
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Receipt #8821 or November mess clearance"
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:bg-white"
          />
        </div>

        {/* Submit */}
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
            disabled={isSubmitting}
            className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md"
          >
            {isSubmitting ? 'Recording...' : `Record ₹${amount || 0} Settlement`}
          </button>
        </div>
      </form>
    </Modal>
  );
}
