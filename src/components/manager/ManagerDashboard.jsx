import React, { useState } from 'react';
import {
  LayoutDashboard,
  Utensils,
  ReceiptIndianRupee,
  QrCode,
} from 'lucide-react';
import ManagerOverview from './ManagerOverview';
import MenuEditor from './MenuEditor';
import CustomerDuesTable from './CustomerDuesTable';
import TokenVerifier from './TokenVerifier';
import { useMess } from '../../context/MessContext';

export default function ManagerDashboard() {
  const { managerStats } = useMess();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'menu' | 'dues' | 'tokens'

  return (
    <div className="space-y-6">
      {/* Manager Header & Navigation */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Mess Management Headquarters
            </h1>
            <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-[11px] font-bold uppercase tracking-wider">
              Admin
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage daily dining menu, student dues balances, ledger statements, and token verification
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start sm:self-auto border border-slate-200/80 overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('menu')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'menu'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Manage Menu</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('dues')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'dues'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ReceiptIndianRupee className="w-3.5 h-3.5" />
            <span>Customer Dues</span>
            {managerStats.totalDefaulters > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tokens')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'tokens'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Token Counter</span>
            {managerStats.pendingTokensToServe > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-indigo-600 text-white text-[10px] font-black">
                {managerStats.pendingTokensToServe}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <ManagerOverview onNavigateTab={(tab) => setActiveTab(tab)} />
      )}
      {activeTab === 'menu' && <MenuEditor />}
      {activeTab === 'dues' && <CustomerDuesTable />}
      {activeTab === 'tokens' && <TokenVerifier />}
    </div>
  );
}
