// LocalStorage persistence for Mess Management System
import {
  INITIAL_MENU,
  INITIAL_CUSTOMERS,
  INITIAL_ORDERS,
  INITIAL_TRANSACTIONS,
} from '../data/initialData';

const KEYS = {
  MENU: 'campus_mess_menu_v1',
  CUSTOMERS: 'campus_mess_customers_v1',
  ORDERS: 'campus_mess_orders_v1',
  TRANSACTIONS: 'campus_mess_transactions_v1',
  CURRENT_ROLE: 'campus_mess_role_v1',
  CURRENT_CUST_ID: 'campus_mess_current_cust_v1',
};

export function loadMenu() {
  try {
    const raw = localStorage.getItem(KEYS.MENU);
    return raw ? JSON.parse(raw) : INITIAL_MENU;
  } catch (e) {
    console.error('Failed to load menu from storage', e);
    return INITIAL_MENU;
  }
}

export function saveMenu(menu) {
  try {
    localStorage.setItem(KEYS.MENU, JSON.stringify(menu));
  } catch (e) {
    console.error('Failed to save menu to storage', e);
  }
}

export function loadCustomers() {
  try {
    const raw = localStorage.getItem(KEYS.CUSTOMERS);
    return raw ? JSON.parse(raw) : INITIAL_CUSTOMERS;
  } catch (e) {
    console.error('Failed to load customers from storage', e);
    return INITIAL_CUSTOMERS;
  }
}

export function saveCustomers(customers) {
  try {
    localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify(customers));
  } catch (e) {
    console.error('Failed to save customers to storage', e);
  }
}

export function loadOrders() {
  try {
    const raw = localStorage.getItem(KEYS.ORDERS);
    return raw ? JSON.parse(raw) : INITIAL_ORDERS;
  } catch (e) {
    console.error('Failed to load orders from storage', e);
    return INITIAL_ORDERS;
  }
}

export function saveOrders(orders) {
  try {
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
  } catch (e) {
    console.error('Failed to save orders to storage', e);
  }
}

export function loadTransactions() {
  try {
    const raw = localStorage.getItem(KEYS.TRANSACTIONS);
    return raw ? JSON.parse(raw) : INITIAL_TRANSACTIONS;
  } catch (e) {
    console.error('Failed to load transactions from storage', e);
    return INITIAL_TRANSACTIONS;
  }
}

export function saveTransactions(transactions) {
  try {
    localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(transactions));
  } catch (e) {
    console.error('Failed to save transactions to storage', e);
  }
}

export function resetAllData() {
  localStorage.removeItem(KEYS.MENU);
  localStorage.removeItem(KEYS.CUSTOMERS);
  localStorage.removeItem(KEYS.ORDERS);
  localStorage.removeItem(KEYS.TRANSACTIONS);
  localStorage.removeItem(KEYS.CURRENT_ROLE);
  localStorage.removeItem(KEYS.CURRENT_CUST_ID);
}
