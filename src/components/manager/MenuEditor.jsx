import React, { useState } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Search,
  Utensils,
} from 'lucide-react';
import { useMess } from '../../context/MessContext';
import { formatCurrency } from '../../utils/messCalculations';
import DishFormModal from './DishFormModal';

export default function MenuEditor() {
  const { menu, deleteMenuItem, toggleItemAvailability } = useMess();

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [dishModalOpen, setDishModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState(null);

  const categories = ['All', 'Breakfast', 'Lunch', 'Snacks', 'Dinner'];

  const filtered = menu.filter((item) => {
    if (activeCategory !== 'All' && item.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!item.name.toLowerCase().includes(q) && !item.description?.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  function handleOpenAdd() {
    setEditingDish(null);
    setDishModalOpen(true);
  }

  function handleOpenEdit(dish) {
    setEditingDish(dish);
    setDishModalOpen(true);
  }

  return (
    <div className="space-y-5">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Utensils className="w-5 h-5 text-indigo-600" />
            <span>Daily Mess Menu Management</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Add new items, update prices, change meal times, or toggle availability instantly for students
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 self-stretch sm:self-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Dish</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search menu dishes..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:bg-white focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Dish Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No dishes found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                  <th className="py-3 px-4">Dish</th>
                  <th className="py-3 px-4">Slot</th>
                  <th className="py-3 px-4">Diet</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Serving Window</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filtered.map((item) => {
                  const isVeg = item.diet === 'veg';
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Name & Photo */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 rounded-lg object-cover shrink-0 border border-slate-200"
                            onError={(e) => {
                              e.target.src =
                                'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200&auto=format&fit=crop&q=80';
                            }}
                          />
                          <div>
                            <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                              <span>{item.name}</span>
                              {item.isSpecial && (
                                <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded-md">
                                  Special
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 line-clamp-1 max-w-xs">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Slot */}
                      <td className="py-3 px-4 font-semibold text-slate-700 whitespace-nowrap">
                        {item.category}
                      </td>

                      {/* Diet */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            isVeg
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                            }`}
                          />
                          <span>{isVeg ? 'Veg' : 'Non-Veg'}</span>
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-black text-slate-900 whitespace-nowrap">
                        {formatCurrency(item.price)}
                      </td>

                      {/* Serving Window */}
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap text-[11px]">
                        {item.mealTime || 'All Day'}
                      </td>

                      {/* Availability toggle */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => toggleItemAvailability(item.id)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all inline-flex items-center gap-1 ${
                            item.available
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          }`}
                        >
                          {item.available ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>In Stock</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 text-slate-500" />
                              <span>Sold Out</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            title="Edit dish details"
                            className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete "${item.name}" from today's menu?`)) {
                                deleteMenuItem(item.id);
                              }
                            }}
                            title="Delete dish"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Dish Form Modal */}
      <DishFormModal
        isOpen={dishModalOpen}
        onClose={() => setDishModalOpen(false)}
        dish={editingDish}
      />
    </div>
  );
}
