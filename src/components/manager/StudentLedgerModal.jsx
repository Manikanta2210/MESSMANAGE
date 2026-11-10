import React from 'react';
import Modal from '../common/Modal';
import { useMess } from '../../context/MessContext';
import { formatCurrency, formatDateTime } from '../../utils/messCalculations';

export default function StudentLedgerModal({ isOpen, onClose, customer }) {
  const { orders, transactions } = useMess();

  if (!isOpen || !customer) return null;

  const studentOrders = orders.filter((o) => o.customerId === customer.id);
  const studentTxns = transactions.filter((t) => t.customerId === customer.id);

  const combined = [
    ...studentOrders.map((o) => ({
      type: 'order',
      id: o.id,
      title: o.items.map((i) => `${i.quantity}x ${i.name}`).join(', '),
      amount: o.totalAmount,
      date: o.timestamp,
      method: o.paymentMethod === 'credit_dues' ? 'Charge to Dues' : o.paymentMethod.toUpperCase(),
      status: o.paymentStatus === 'paid' ? 'Paid' : 'Unpaid (Due)',
      tokenNo: o.tokenNo,
      orderStatus: o.orderStatus,
    })),
    ...studentTxns.map((t) => ({
      type: 'payment',
      id: t.id,
      title: t.description || 'Mess Payment',
      amount: t.amount,
      date: t.timestamp,
      method: t.method,
      status: 'Settled',
      tokenNo: null,
      orderStatus: 'Completed',
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Ledger Statement • ${customer.name}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        {/* Header Stats */}
        <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-slate-500 block">Roll / Room</span>
            <span className="font-bold text-slate-800">
              {customer.rollNo} • {customer.roomNo}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">Wallet Balance</span>
            <span className="font-bold text-emerald-700">
              {formatCurrency(customer.summary?.walletBalance || 0)}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">Outstanding Due</span>
            <span className="font-bold text-rose-700">
              {formatCurrency(customer.summary?.outstandingDues || 0)}
            </span>
          </div>
        </div>

        {/* Audit list */}
        <div className="max-h-80 overflow-y-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-100 text-slate-600 font-bold text-[11px] sticky top-0">
              <tr>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3">Method</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {combined.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50">
                  <td className="py-2 px-3 text-slate-500 whitespace-nowrap">
                    {formatDateTime(row.date)}
                  </td>
                  <td className="py-2 px-3 font-semibold text-slate-800">
                    <div>{row.title}</div>
                    {row.tokenNo && (
                      <span className="text-[10px] text-amber-700 font-mono">
                        Token #{row.tokenNo} ({row.orderStatus})
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-slate-600">{row.method}</td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        row.status === 'Paid' || row.status === 'Settled'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td
                    className={`py-2 px-3 text-right font-black whitespace-nowrap ${
                      row.type === 'order' ? 'text-slate-900' : 'text-emerald-700'
                    }`}
                  >
                    {row.type === 'order'
                      ? `-${formatCurrency(row.amount)}`
                      : `+${formatCurrency(row.amount)}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-right pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
          >
            Close Statement
          </button>
        </div>
      </div>
    </Modal>
  );
}
