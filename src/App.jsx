import React, { useState } from 'react';
import { MessProvider, useMess } from './context/MessContext';
import Navbar from './components/layout/Navbar';
import CustomerDashboard from './components/customer/CustomerDashboard';
import ManagerDashboard from './components/manager/ManagerDashboard';
import Toast from './components/common/Toast';

function MessAppContent() {
  const { currentRole } = useMess();
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [rechargeModalOpen, setRechargeModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between selection:bg-amber-100 selection:text-amber-900">
      <div>
        {/* Navigation Bar */}
        <Navbar
          onOpenCart={() => setCartDrawerOpen(true)}
          onOpenRecharge={() => setRechargeModalOpen(true)}
        />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {currentRole === 'customer' ? (
            <CustomerDashboard
              cartDrawerOpen={cartDrawerOpen}
              setCartDrawerOpen={setCartDrawerOpen}
              rechargeModalOpen={rechargeModalOpen}
              setRechargeModalOpen={setRechargeModalOpen}
            />
          ) : (
            <ManagerDashboard />
          )}
        </main>
      </div>

      {/* Global Toast Notifications */}
      <Toast />

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white/70 backdrop-blur-xs py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800">Annapurna Mess System</span>
            <span>•</span>
            <span>Smart Campus Dining &amp; Dues Management</span>
          </div>
          <div className="text-slate-600">
            Switch between <strong>Customer</strong> and <strong>Manager</strong> anytime from the top bar
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <MessProvider>
      <MessAppContent />
    </MessProvider>
  );
}
