import React, { useState, useMemo } from 'react';
import {
  Search,
  Sparkles,
  Flame,
  Clock,
  Plus,
  Zap,
  Utensils,
} from 'lucide-react';
import { useMess } from '../../context/MessContext';
import { formatCurrency } from '../../utils/messCalculations';

const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Snacks', 'Dinner'];

export default function MenuCatalog({ onInstantPay }) {
  const { menu, addToCart } = useMess();

  const [activeCategory, setActiveCategory] = useState('All');
  const [dietFilter, setDietFilter] = useState('all'); // all, veg, non-veg
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered menu
  const filteredMenu = useMemo(() => {
    return menu.filter((dish) => {
      // Category filter
      if (activeCategory !== 'All' && dish.category !== activeCategory) {
        return false;
      }
      // Diet filter
      if (dietFilter !== 'all' && dish.diet !== dietFilter) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = dish.name.toLowerCase().includes(q);
        const matchDesc = dish.description?.toLowerCase().includes(q);
        if (!matchName && !matchDesc) return false;
      }
      return true;
    });
  }, [menu, activeCategory, dietFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Management Daily Announcement Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-white font-bold text-[11px] uppercase tracking-wider">
                Live Mess Board
              </span>
              <span className="text-amber-100 text-xs">Updated today by Mess Manager</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Fresh, Hot & Hygienic Meals Ready!
            </h2>
            <p className="text-xs sm:text-sm text-amber-50 mt-1 max-w-xl">
              Select your meal, pay instantly via Wallet / UPI or charge to your monthly dues ledger,
              and claim your fresh plate at the food counter.
            </p>
          </div>
          <div className="hidden lg:flex items-center gap-3 bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/20">
            <div className="text-center px-3 border-r border-white/20">
              <span className="block text-xl font-black">{menu.length}</span>
              <span className="text-[10px] text-amber-100 font-medium">Dishes Listed</span>
            </div>
            <div className="text-center px-3">
              <span className="block text-xl font-black">
                {menu.filter((d) => d.available).length}
              </span>
              <span className="text-[10px] text-amber-100 font-medium">Ready Now</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Meal Slot Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Diet toggle */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setDietFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                dietFilter === 'all'
                  ? 'bg-white text-slate-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All Diet
            </button>
            <button
              type="button"
              onClick={() => setDietFilter('veg')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                dietFilter === 'veg'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>Veg</span>
            </button>
            <button
              type="button"
              onClick={() => setDietFilter('non-veg')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                dietFilter === 'non-veg'
                  ? 'bg-white text-rose-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-600" />
              <span>Non-Veg</span>
            </button>
          </div>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dish by name, ingredients (e.g. Dosa, Biryani, Thali, Paneer)..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all"
          />
        </div>
      </div>

      {/* Menu Cards Grid */}
      {filteredMenu.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
            <Utensils className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">No dishes found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search filters or check back during the next meal time slot.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMenu.map((dish) => {
            const isVeg = dish.diet === 'veg';
            return (
              <div
                key={dish.id}
                className={`group bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
                  dish.available
                    ? 'border-slate-200/90 hover:border-amber-300 hover:shadow-lg shadow-xs'
                    : 'border-slate-200 opacity-60 bg-slate-50/50'
                }`}
              >
                <div>
                  {/* Dish Thumbnail & Badges */}
                  <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src =
                          'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&auto=format&fit=crop&q=80';
                      }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

                    {/* Veg / Non-Veg Indicator */}
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs p-1 rounded-md shadow-xs flex items-center justify-center">
                      <span
                        className={`w-3.5 h-3.5 border rounded-xs flex items-center justify-center ${
                          isVeg ? 'border-emerald-600' : 'border-rose-600'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                          }`}
                        />
                      </span>
                    </div>

                    {/* Chef Special Pill */}
                    {dish.isSpecial && (
                      <div className="absolute top-3 right-3 bg-amber-500/95 backdrop-blur-xs text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                        <Sparkles className="w-3 h-3" />
                        <span>Chef Special</span>
                      </div>
                    )}

                    {/* Meal Time & Category in card footer */}
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
                      <span className="font-semibold bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md text-[11px]">
                        {dish.category}
                      </span>
                      {dish.calories && (
                        <span className="flex items-center gap-1 text-[11px] bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md">
                          <Flame className="w-3 h-3 text-orange-400" />
                          <span>{dish.calories} kcal</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-amber-700 transition-colors">
                        {dish.name}
                      </h3>
                      <span className="text-base font-black text-slate-900 whitespace-nowrap">
                        {formatCurrency(dish.price)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {dish.description}
                    </p>

                    {dish.mealTime && (
                      <div className="flex items-center gap-1 text-[11px] text-slate-600">
                        <Clock className="w-3 h-3" />
                        <span>{dish.mealTime}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 pt-0">
                  {dish.available ? (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => addToCart(dish)}
                        className="py-2 px-2.5 rounded-xl border border-amber-300 text-amber-800 bg-amber-50/70 hover:bg-amber-100 text-xs font-bold transition-all flex items-center justify-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Tray</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onInstantPay(dish)}
                        className="py-2 px-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Pay to Eat</span>
                      </button>
                    </div>
                  ) : (
                    <div className="py-2 text-center rounded-xl bg-slate-100 text-slate-600 text-xs font-bold">
                      Sold Out for Today
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
