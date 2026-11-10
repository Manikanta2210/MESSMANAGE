import React, { useState } from 'react';
import { UtensilsCrossed, ReceiptIndianRupee, QrCode } from 'lucide-react';
import MenuCatalog from './MenuCatalog';
import CustomerDuesView from './CustomerDuesView';
import ActiveTokensView from './ActiveTokensView';
import PayMealModal from './PayMealModal';
import TokenSuccessModal from './TokenSuccessModal';
import RechargeModal from './RechargeModal';
import CartDrawer from './CartDrawer';
import { useMess } from '../../context/MessContext';

export default function CustomerDashboard({
  cartDrawerOpen,
  setCartDrawerOpen,
  rechargeModalOpen,
  setRechargeModalOpen,
}) {
  const { currentCustomer, currentCustomerSummary, orders } = useMess();

  const [activeTab, setActiveTab] = useState('menu'); // 'menu' | 'dues' | 'tokens'
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [activeTokenModalOrder, setActiveTokenModalOrder] = useState(null);

  // Active tokens count
  const activeTokensCount = orders.filter(
    (o) => o.customerId === currentCustomer?.id && o.orderStatus === 'Active'
  ).length;

  // Handle instant pay from single dish card
  function handleInstantPay(dish) {
    setCheckoutItems([{ ...dish, quantity: 1 }]);
    setCheckoutModalOpen(true);
  }

  // Handle checkout from Cart drawer
  function handleCartProceedCheckout(items) {
    setCheckoutItems(items);
    setCheckoutModalOpen(true);
  }

  // Handle successful order creation
  function handleOrderSuccess(newOrder) {
    setActiveTokenModalOrder(newOrder);
  }

  return (
    <div className="space-y-6">
      {/* Customer Header Bar & Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Welcome, {currentCustomer?.name || 'Student'}! 👋
            </h1>
            <span className="text-xl">{currentCustomer?.avatar || '👨‍🎓'}</span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Roll: <span className="font-semibold text-slate-700">{currentCustomer?.rollNo}</span> •{' '}
            Room: <span className="font-semibold text-slate-700">{currentCustomer?.roomNo}</span>
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start sm:self-auto border border-slate-200/80">
          <button
            type="button"
            onClick={() => setActiveTab('menu')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'menu'
                ? 'bg-white text-amber-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Today&apos;s Menu</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('dues')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all relative ${
              activeTab === 'dues'
                ? 'bg-white text-amber-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ReceiptIndianRupee className="w-3.5 h-3.5" />
            <span>My Dues &amp; Ledger</span>
            {currentCustomerSummary?.outstandingDues > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tokens')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all relative ${
              activeTab === 'tokens'
                ? 'bg-white text-amber-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Meal Passes</span>
            {activeTokensCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-600 text-white text-[10px] font-black">
                {activeTokensCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === 'menu' && <MenuCatalog onInstantPay={handleInstantPay} />}

      {activeTab === 'dues' && (
        <CustomerDuesView onOpenRecharge={() => setRechargeModalOpen(true)} />
      )}

      {activeTab === 'tokens' && (
        <ActiveTokensView
          onShowTokenModal={(order) => setActiveTokenModalOrder(order)}
        />
      )}

      {/* Modals & Drawers */}
      <PayMealModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        items={checkoutItems}
        onSuccessOrder={handleOrderSuccess}
      />

      <TokenSuccessModal
        isOpen={Boolean(activeTokenModalOrder)}
        onClose={() => setActiveTokenModalOrder(null)}
        order={activeTokenModalOrder}
      />

      <RechargeModal
        isOpen={rechargeModalOpen}
        onClose={() => setRechargeModalOpen(false)}
      />

      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        onProceedCheckout={handleCartProceedCheckout}
      />
    </div>
  );
}
