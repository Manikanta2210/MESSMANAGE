import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { useMess } from '../../context/MessContext';

export default function DishFormModal({ isOpen, onClose, dish = null }) {
  const { addMenuItem, updateMenuItem } = useMess();

  const [formData, setFormData] = useState({
    name: '',
    category: 'Lunch',
    price: '',
    diet: 'veg',
    description: '',
    calories: '350',
    mealTime: '12:30 PM - 02:45 PM',
    isSpecial: false,
    available: true,
    image: '',
  });

  useEffect(() => {
    if (dish) {
      setFormData({
        name: dish.name || '',
        category: dish.category || 'Lunch',
        price: dish.price ? dish.price.toString() : '',
        diet: dish.diet || 'veg',
        description: dish.description || '',
        calories: dish.calories ? dish.calories.toString() : '350',
        mealTime: dish.mealTime || '12:30 PM - 02:45 PM',
        isSpecial: Boolean(dish.isSpecial),
        available: dish.available !== undefined ? dish.available : true,
        image: dish.image || '',
      });
    } else {
      setFormData({
        name: '',
        category: 'Lunch',
        price: '',
        diet: 'veg',
        description: '',
        calories: '350',
        mealTime: '12:30 PM - 02:45 PM',
        isSpecial: false,
        available: true,
        image: '',
      });
    }
  }, [dish, isOpen]);

  if (!isOpen) return null;

  function handleSubmit(e) {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) return;

    if (dish) {
      updateMenuItem({
        id: dish.id,
        ...formData,
      });
    } else {
      addMenuItem(formData);
    }
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={dish ? 'Edit Mess Menu Item 🍳' : 'Add New Dish to Menu 🍲'}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
            Dish Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Masala Dosa, Paneer Butter Masala, Chicken Curry"
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-500"
          />
        </div>

        {/* Category & Price */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
              Meal Slot *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:bg-white"
            >
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Snacks">Snacks</option>
              <option value="Dinner">Dinner</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
              Price (₹) *
            </label>
            <input
              type="number"
              min="1"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="e.g. 75"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:outline-hidden focus:bg-white focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Diet & Calories */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
              Diet Type
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, diet: 'veg' })}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all ${
                  formData.diet === 'veg'
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                🟢 Veg
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, diet: 'non-veg' })}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all ${
                  formData.diet === 'non-veg'
                    ? 'bg-rose-50 border-rose-400 text-rose-800'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                🔴 Non-Veg
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
              Calories (kcal)
            </label>
            <input
              type="number"
              value={formData.calories}
              onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
              placeholder="e.g. 450"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:bg-white"
            />
          </div>
        </div>

        {/* Meal Timings & Image URL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
              Serving Window
            </label>
            <input
              type="text"
              value={formData.mealTime}
              onChange={(e) => setFormData({ ...formData, mealTime: e.target.value })}
              placeholder="e.g. 12:30 PM - 02:45 PM"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
              Photo URL (Optional)
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:bg-white"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
            Description & Ingredients
          </label>
          <textarea
            rows="2"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Tell students about the dish, accompaniments, spices..."
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:bg-white"
          />
        </div>

        {/* Toggles */}
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={formData.isSpecial}
              onChange={(e) => setFormData({ ...formData, isSpecial: e.target.checked })}
              className="rounded-xs text-amber-600 focus:ring-amber-500"
            />
            <span>Highlight as Chef Special ⭐</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={formData.available}
              onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
              className="rounded-xs text-emerald-600 focus:ring-emerald-500"
            />
            <span>Available in Stock 🟢</span>
          </label>
        </div>

        {/* Actions */}
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
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
          >
            {dish ? 'Save Changes' : 'Post to Menu'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
