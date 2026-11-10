import React from 'react';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useMess } from '../../context/MessContext';
import { formatCurrency } from '../../utils/messCalculations';

export default function CartDrawer({ isOpen, onClose, onProceedCheckout }) {
  const { cart, updateCartQuantity, removeFromCart, clearCart } = useMess();

  if (!isOpen) return null;

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.item.price * item.quantity,
    0
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-fade-in border-l border-slate-200">
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-600" />
              <h3 className="font-extrabold text-slate-900 text-sm">Your Meal Tray</h3>
              <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                {cart.length} items
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body items list */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-slate-100">
            {cart.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">Your tray is empty</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Browse today&apos;s menu and click &ldquo;Add Tray&rdquo; or &ldquo;Pay to Eat&rdquo; to begin.
                </p>
              </div>
            ) : (
              cart.map(({ item, quantity }) => (
                <div key={item.id} className="py-3.5 first:pt-0 flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{item.name}</h4>
                    <span className="text-xs font-semibold text-slate-500">
                      {formatCurrency(item.price)} each
                    </span>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 bg-slate-100 px-2 py-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(item.id, quantity - 1)}
                      className="text-slate-600 hover:text-slate-900 p-0.5 rounded-md hover:bg-white"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-black text-slate-800 w-4 text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(item.id, quantity + 1)}
                      className="text-slate-600 hover:text-slate-900 p-0.5 rounded-md hover:bg-white"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right">
                    <span className="text-xs font-black text-slate-900 block">
                      {formatCurrency(item.price * quantity)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="text-rose-500 hover:text-rose-700 p-1 text-[11px]"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-100 bg-slate-50/80 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-600">Tray Subtotal</span>
                <span className="text-lg font-black text-slate-900">{formatCurrency(totalAmount)}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={clearCart}
                  className="px-3 py-2.5 rounded-xl border border-slate-200 text-slate-500 text-xs font-semibold hover:bg-slate-100"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onProceedCheckout(
                      cart.map((c) => ({
                        ...c.item,
                        quantity: c.quantity,
                      }))
                    );
                  }}
                  className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <span>Proceed to Pay & Eat</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
