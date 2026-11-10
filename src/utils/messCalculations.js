// Calculation helpers for dues, balances, and analytics

/**
 * Calculate financial summary for a single customer
 */
export function calculateCustomerSummary(customer, orders = [], transactions = []) {
  const customerOrders = orders.filter((o) => o.customerId === customer.id);
  const customerTransactions = transactions.filter((t) => t.customerId === customer.id);

  // Total meals consumed
  const totalMealsCount = customerOrders.length;
  const totalMealExpense = customerOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

  // Unpaid credit orders (Pay to eat on dues)
  const unpaidOrders = customerOrders.filter((o) => o.paymentStatus === 'unpaid');
  const outstandingDues = unpaidOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

  // Total settled/paid directly
  const totalPaidOrders = customerOrders
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

  // Total ledger transactions (recharges, due payments)
  const totalLedgerPaid = customerTransactions
    .filter((t) => t.status === 'Success')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  // Active unredeemed tokens
  const activeTokens = customerOrders.filter((o) => o.orderStatus === 'Active');

  return {
    customerId: customer.id,
    customerName: customer.name,
    rollNo: customer.rollNo,
    roomNo: customer.roomNo,
    walletBalance: Number(customer.walletBalance) || 0,
    outstandingDues,
    totalMealExpense,
    totalPaidOrders,
    totalLedgerPaid,
    totalMealsCount,
    activeTokensCount: activeTokens.length,
    unpaidOrdersCount: unpaidOrders.length,
    hasDue: outstandingDues > 0,
    isDefaulter: outstandingDues >= 500,
  };
}

/**
 * Calculate overall mess statistics for Manager
 */
export function calculateManagerStats(customers = [], orders = [], transactions = []) {
  let totalDuesPending = 0;
  let totalDefaulters = 0;
  let totalMealsToday = 0;
  let totalRevenueCollected = 0;
  let pendingTokensToServe = 0;

  const todayStr = new Date().toISOString().split('T')[0];

  customers.forEach((c) => {
    const summary = calculateCustomerSummary(c, orders, transactions);
    totalDuesPending += summary.outstandingDues;
    if (summary.isDefaulter) totalDefaulters += 1;
  });

  orders.forEach((o) => {
    if (o.timestamp && o.timestamp.startsWith(todayStr)) {
      totalMealsToday += 1;
    }
    if (o.orderStatus === 'Active') {
      pendingTokensToServe += 1;
    }
  });

  // Calculate total revenue from transactions & paid orders
  const directPaid = orders
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((s, o) => s + (Number(o.totalAmount) || 0), 0);

  const duesPaid = transactions
    .filter((t) => t.type === 'due_clearance' || t.type === 'wallet_recharge')
    .reduce((s, t) => s + (Number(t.amount) || 0), 0);

  totalRevenueCollected = directPaid + duesPaid;

  return {
    totalCustomers: customers.length,
    totalDuesPending,
    totalDefaulters,
    totalMealsToday,
    totalOrdersAllTime: orders.length,
    totalRevenueCollected,
    pendingTokensToServe,
  };
}

export function formatCurrency(amount) {
  return `₹${Number(amount || 0).toLocaleString('en-IN')}`;
}

export function formatDateTime(isoString) {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}
