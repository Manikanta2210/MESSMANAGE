import React from 'react';
import {
  UtensilsCrossed,
  ShieldCheck,
  User,
  Wallet,
  ReceiptIndianRupee,
  RotateCcw,
  ShoppingBag,
} from 'lucide-react';
import { useMess } from '../../context/MessContext';
import { formatCurrency } from '../../utils/messCalculations';

export default function Navbar({ onOpenCart, onOpenRecharge }) {
  const {
    currentRole,
    setCurrentRole,
    customers,
    currentCustomerId,
    setCurrentCustomerId,
    currentCustomerSummary,
    cart,
    handleResetAllData,
  } = useMess();

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & System Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-lg">
                  Annapurna<span className="text-amber-600">Mess</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-amber-100 text-amber-800">
                  Campus Dining
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block">
                Pay to Eat & Digital Dues Management
              </p>
            </div>
          </div>

          {/* Central Role Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            <button
              type="button"
              onClick={() => setCurrentRole('customer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                currentRole === 'customer'
                  ? 'bg-white text-amber-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Customer Portal</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentRole('manager')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                currentRole === 'manager'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Manager Portal</span>
            </button>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {currentRole === 'customer' ? (
              <>
                {/* Active Customer Persona Selector */}
                <div className="hidden lg:flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs">
                  <span className="text-slate-600 font-medium">Student:</span>
                  <select
                    value={currentCustomerId}
                    onChange={(e) => setCurrentCustomerId(e.target.value)}
                    aria-label="Select student account"
                    className="bg-transparent font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.rollNo})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quick Dues / Wallet Badge */}
                {currentCustomerSummary && (
                  <div className="hidden sm:flex items-center gap-2">
                    <button
                      type="button"
                      onClick={onOpenRecharge}
                      title="Click to recharge wallet"
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition-colors"
                    >
                      <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{formatCurrency(currentCustomerSummary.walletBalance)}</span>
                    </button>

                    {currentCustomerSummary.outstandingDues > 0 ? (
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold animate-pulse">
                        <ReceiptIndianRupee className="w-3.5 h-3.5" />
                        <span>Due: {formatCurrency(currentCustomerSummary.outstandingDues)}</span>
                      </div>
                    ) : (
                      <div className="hidden xl:flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium">
                        <span>No Dues ✨</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Tray / Cart Button */}
                <button
                  type="button"
                  onClick={onOpenCart}
                  className="relative flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shadow-xs"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span className="hidden sm:inline">My Tray</span>
                  {totalCartItems > 0 && (
                    <span className="ml-1 w-5 h-5 rounded-full bg-white text-amber-700 font-black text-[11px] flex items-center justify-center">
                      {totalCartItems}
                    </span>
                  )}
                </button>
              </>
            ) : (
              /* Manager Mode status badge */
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold">
                  <div className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                  <span>Mess Admin Live</span>
                </div>
              </div>
            )}

            {/* Reset Demo Data button */}
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset all mess data (menu, orders, dues) back to sample demonstration defaults?')) {
                  handleResetAllData();
                }
              }}
              title="Reset sample data"
              className="p-1.5 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
