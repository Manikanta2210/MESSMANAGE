import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  loadMenu,
  saveMenu,
  loadCustomers,
  saveCustomers,
  loadOrders,
  saveOrders,
  loadTransactions,
  saveTransactions,
  resetAllData,
} from '../utils/storage';
import {
  INITIAL_MENU,
  INITIAL_CUSTOMERS,
  INITIAL_ORDERS,
  INITIAL_TRANSACTIONS,
} from '../data/initialData';
import { calculateCustomerSummary, calculateManagerStats } from '../utils/messCalculations';

const MessContext = createContext(null);

export function MessProvider({ children }) {
  // Main State
  const [menu, setMenu] = useState(() => loadMenu());
  const [customers, setCustomers] = useState(() => loadCustomers());
  const [orders, setOrders] = useState(() => loadOrders());
  const [transactions, setTransactions] = useState(() => loadTransactions());

  // Role and Active User
  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem('campus_mess_role_v1') || 'customer';
  });
  const [currentCustomerId, setCurrentCustomerId] = useState(() => {
    return localStorage.getItem('campus_mess_current_cust_v1') || 'cust-1';
  });

  // Tray / Cart for customer ordering
  const [cart, setCart] = useState([]);

  // Toast feedback
  const [toast, setToast] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    saveMenu(menu);
  }, [menu]);

  useEffect(() => {
    saveCustomers(customers);
  }, [customers]);

  useEffect(() => {
    saveOrders(orders);
  }, [orders]);

  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('campus_mess_role_v1', currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem('campus_mess_current_cust_v1', currentCustomerId);
  }, [currentCustomerId]);

  function showToast(title, message = '', type = 'success') {
    setToast({ title, message, type });
  }

  function dismissToast() {
    setToast(null);
  }

  // Active customer object
  const currentCustomer = customers.find((c) => c.id === currentCustomerId) || customers[0];

  // Active customer summary (dues, balance, spent)
  const currentCustomerSummary = currentCustomer
    ? calculateCustomerSummary(currentCustomer, orders, transactions)
    : null;

  // Manager stats
  const managerStats = calculateManagerStats(customers, orders, transactions);

  // CART FUNCTIONS
  function addToCart(menuItem) {
    if (!menuItem.available) {
      showToast('Item Unavailable', `${menuItem.name} is currently out of stock.`, 'warning');
      return;
    }
    setCart((prev) => {
      const existing = prev.find((i) => i.item.id === menuItem.id);
      if (existing) {
        return prev.map((i) =>
          i.item.id === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { item: menuItem, quantity: 1 }];
    });
    showToast('Added to Tray', `${menuItem.name} added.`, 'success');
  }

  function updateCartQuantity(itemId, quantity) {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.item.id === itemId ? { ...i, quantity } : i))
    );
  }

  function removeFromCart(itemId) {
    setCart((prev) => prev.filter((i) => i.item.id !== itemId));
  }

  function clearCart() {
    setCart([]);
  }

  // PLACE MEAL ORDER / PAY TO EAT
  function placeMealOrder({ items, paymentMethod, diningOption = 'Dine-in' }) {
    if (!currentCustomer) {
      showToast('Error', 'No active customer profile selected.', 'error');
      return null;
    }

    const totalAmount = items.reduce(
      (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
      0
    );

    // Validate wallet balance if paying with wallet
    if (paymentMethod === 'wallet') {
      const currentBalance = Number(currentCustomer.walletBalance) || 0;
      if (currentBalance < totalAmount) {
        showToast(
          'Insufficient Wallet Balance',
          `Required: ₹${totalAmount}, Available: ₹${currentBalance}. Please recharge or pay via UPI/Dues.`,
          'error'
        );
        return null;
      }

      // Deduct from wallet
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === currentCustomer.id
            ? { ...c, walletBalance: currentBalance - totalAmount }
            : c
        )
      );

      // Log wallet transaction
      const txn = {
        id: `TXN-${Date.now().toString().slice(-6)}`,
        customerId: currentCustomer.id,
        type: 'meal_payment',
        amount: totalAmount,
        method: 'Mess Wallet',
        timestamp: new Date().toISOString(),
        description: `Meal token payment for ${items.map((i) => i.name).join(', ')}`,
        status: 'Success',
      };
      setTransactions((prev) => [txn, ...prev]);
    } else if (paymentMethod === 'upi' || paymentMethod === 'card') {
      // Direct payment success
      const txn = {
        id: `TXN-${Date.now().toString().slice(-6)}`,
        customerId: currentCustomer.id,
        type: 'meal_payment',
        amount: totalAmount,
        method: paymentMethod === 'upi' ? 'UPI (Instant)' : 'Debit/Credit Card',
        timestamp: new Date().toISOString(),
        description: `Direct payment for ${items.map((i) => i.name).join(', ')}`,
        status: 'Success',
      };
      setTransactions((prev) => [txn, ...prev]);
    }

    // Determine status
    const isPaid = paymentMethod !== 'credit_dues';
    const tokenNo = `TKN-${Math.floor(100 + Math.random() * 900)}`;

    const newOrder = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      tokenNo,
      customerId: currentCustomer.id,
      customerName: currentCustomer.name,
      items: items.map((i) => ({
        id: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity || 1,
      })),
      totalAmount,
      paymentMethod,
      paymentStatus: isPaid ? 'paid' : 'unpaid',
      orderStatus: 'Active',
      diningOption,
      timestamp: new Date().toISOString(),
      mealCategory: items[0]?.category || 'General',
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    const msg =
      paymentMethod === 'credit_dues'
        ? `₹${totalAmount} added to your Mess Dues. Show Token #${tokenNo} at the counter!`
        : `Payment of ₹${totalAmount} verified! Show Token #${tokenNo} at the counter to eat.`;

    showToast('Meal Pass Generated! 🍛', msg, 'success');
    return newOrder;
  }

  // MARK TOKEN AS REDEEMED / SERVED
  function redeemToken(orderId) {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return false;

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, orderStatus: 'Redeemed', redeemedAt: new Date().toISOString() } : o
      )
    );

    showToast('Meal Served! 🍽️', `Token #${order.tokenNo} (${order.customerName}) marked as served.`, 'success');
    return true;
  }

  // RECORD PAYMENT (BY CUSTOMER OR MANAGER)
  function recordPayment({ customerId, amount, paymentMethod = 'UPI', notes = '' }) {
    const cust = customers.find((c) => c.id === customerId);
    if (!cust) return false;

    const numAmount = Number(amount) || 0;
    if (numAmount <= 0) {
      showToast('Invalid Amount', 'Please enter a valid amount greater than ₹0.', 'error');
      return false;
    }

    // Allocate payment to clear unpaid orders chronologically
    let remainingPayment = numAmount;
    setOrders((prev) => {
      // Find unpaid orders for this customer sorted by oldest first
      return prev.map((order) => {
        if (order.customerId === customerId && order.paymentStatus === 'unpaid' && remainingPayment > 0) {
          if (remainingPayment >= order.totalAmount) {
            remainingPayment -= order.totalAmount;
            return { ...order, paymentStatus: 'paid' };
          }
          // If partial, keep track
          return order;
        }
        return order;
      });
    });

    // If there is surplus after clearing dues, credit to wallet
    if (remainingPayment > 0) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === customerId
            ? { ...c, walletBalance: (Number(c.walletBalance) || 0) + remainingPayment }
            : c
        )
      );
    }

    // Add transaction log
    const txn = {
      id: `TXN-${Date.now().toString().slice(-6)}`,
      customerId,
      type: 'due_clearance',
      amount: numAmount,
      method: paymentMethod,
      timestamp: new Date().toISOString(),
      description: notes || `Dues clearance payment for ${cust.name}`,
      status: 'Success',
    };

    setTransactions((prev) => [txn, ...prev]);

    showToast(
      'Payment Recorded! 💳',
      `₹${numAmount} credited towards ${cust.name}'s account. Dues updated.`,
      'success'
    );
    return true;
  }

  // TOP UP WALLET
  function rechargeWallet({ customerId, amount, paymentMethod = 'UPI' }) {
    const cust = customers.find((c) => c.id === customerId);
    if (!cust) return false;

    const numAmount = Number(amount) || 0;
    if (numAmount <= 0) return false;

    setCustomers((prev) =>
      prev.map((c) =>
        c.id === customerId
          ? { ...c, walletBalance: (Number(c.walletBalance) || 0) + numAmount }
          : c
      )
    );

    const txn = {
      id: `TXN-${Date.now().toString().slice(-6)}`,
      customerId,
      type: 'wallet_recharge',
      amount: numAmount,
      method: paymentMethod,
      timestamp: new Date().toISOString(),
      description: `Mess Wallet Top-up`,
      status: 'Success',
    };

    setTransactions((prev) => [txn, ...prev]);
    showToast('Wallet Recharged! 💰', `₹${numAmount} added to ${cust.name}'s mess wallet.`, 'success');
    return true;
  }

  // MENU MANAGEMENT (FOR MANAGER)
  function addMenuItem(dishData) {
    const newItem = {
      id: `menu-${Date.now().toString().slice(-5)}`,
      name: dishData.name.trim(),
      category: dishData.category || 'Lunch',
      price: Number(dishData.price) || 0,
      diet: dishData.diet || 'veg',
      description: dishData.description || '',
      calories: Number(dishData.calories) || 350,
      available: dishData.available !== undefined ? dishData.available : true,
      isSpecial: Boolean(dishData.isSpecial),
      image:
        dishData.image ||
        'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&auto=format&fit=crop&q=80',
      mealTime: dishData.mealTime || 'All Day',
    };

    setMenu((prev) => [newItem, ...prev]);
    showToast('Menu Updated! 🍲', `"${newItem.name}" added to today's menu.`, 'success');
    return newItem;
  }

  function updateMenuItem(dishData) {
    setMenu((prev) =>
      prev.map((item) =>
        item.id === dishData.id
          ? {
              ...item,
              ...dishData,
              price: Number(dishData.price) || item.price,
              calories: Number(dishData.calories) || item.calories,
            }
          : item
      )
    );
    showToast('Item Updated', `"${dishData.name}" has been updated.`, 'success');
  }

  function deleteMenuItem(dishId) {
    const item = menu.find((i) => i.id === dishId);
    setMenu((prev) => prev.filter((i) => i.id !== dishId));
    showToast('Item Removed', `"${item?.name || 'Dish'}" removed from the menu.`, 'info');
  }

  function toggleItemAvailability(dishId) {
    setMenu((prev) =>
      prev.map((item) => {
        if (item.id === dishId) {
          const updated = !item.available;
          showToast(
            updated ? 'Dish Available' : 'Dish Marked Sold Out',
            `"${item.name}" is now ${updated ? 'available to order' : 'out of stock'}.`,
            updated ? 'success' : 'warning'
          );
          return { ...item, available: updated };
        }
        return item;
      })
    );
  }

  // RESET DEMO DATA
  function handleResetAllData() {
    resetAllData();
    setMenu(INITIAL_MENU);
    setCustomers(INITIAL_CUSTOMERS);
    setOrders(INITIAL_ORDERS);
    setTransactions(INITIAL_TRANSACTIONS);
    setCurrentCustomerId('cust-1');
    setCurrentRole('customer');
    setCart([]);
    showToast('Reset Complete', 'Mess system data restored to clean demonstration state.', 'info');
  }

  return (
    <MessContext.Provider
      value={{
        // Data
        menu,
        customers,
        orders,
        transactions,
        currentRole,
        setCurrentRole,
        currentCustomerId,
        setCurrentCustomerId,
        currentCustomer,
        currentCustomerSummary,
        managerStats,
        cart,
        toast,

        // Actions
        showToast,
        dismissToast,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        placeMealOrder,
        redeemToken,
        recordPayment,
        rechargeWallet,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleItemAvailability,
        handleResetAllData,
      }}
    >
      {children}
    </MessContext.Provider>
  );
}

export function useMess() {
  const context = useContext(MessContext);
  if (!context) {
    throw new Error('useMess must be used within a MessProvider');
  }
  return context;
}
