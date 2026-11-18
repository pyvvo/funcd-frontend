const dailyRuns = [
  { day: 'Mon', runs: { success: 42, failed: 3 }, duration: 12.4 },
  { day: 'Tue', runs: { success: 51, failed: 1 }, duration: 11.8 },
  { day: 'Wed', runs: { success: 38, failed: 6 }, duration: 14.1 },
  { day: 'Thu', runs: { success: 45, failed: 2 }, duration: 12.9 },
  { day: 'Fri', runs: { success: 60, failed: 4 }, duration: 13.5 },
  { day: 'Sat', runs: { success: 22, failed: 1 }, duration: 10.2 },
  { day: 'Sun', runs: { success: 18, failed: 0 }, duration: 9.7 }
];

// One row per month and category, as a SQL query returns them: March has no
// row, February's groceries come in two rows, and two expenses have no
// category.
const monthlyExpenses = [
  { month: 'Jan', category: 'Rent', amount: 1200 },
  { month: 'Jan', category: 'Transport', amount: 86.4 },
  { month: 'Jan', category: null, amount: 45.9 },
  { month: 'Jan', category: 'Groceries', amount: 412.35 },
  { month: 'Feb', category: 'Rent', amount: 1200 },
  { month: 'Feb', category: 'Groceries', amount: 230.1 },
  { month: 'Feb', category: 'Groceries', amount: 158.75 },
  { month: 'Feb', category: 'Transport', amount: 92 },
  { month: 'Apr', category: 'Rent', amount: 1200 },
  { month: 'Apr', category: 'Transport', amount: 64.5 },
  { month: 'Apr', category: 'Groceries', amount: 398.2 },
  { month: 'May', category: 'Rent', amount: 1200 },
  { month: 'May', category: 'Groceries', amount: 421.6 },
  { month: 'Jun', category: 'Rent', amount: 1200 },
  { month: 'Jun', category: 'Transport', amount: 120 },
  { month: 'Jun', category: 'Groceries', amount: 376.9 },
  { month: 'Jul', category: 'Rent', amount: 1250 },
  { month: 'Jul', category: null, amount: 129.99 },
  { month: 'Jul', category: 'Groceries', amount: 455.3 },
  { month: 'Aug', category: 'Rent', amount: 1250 },
  { month: 'Aug', category: 'Transport', amount: 58.2 },
  { month: 'Aug', category: 'Groceries', amount: 402.75 },
  { month: 'Sep', category: 'Rent', amount: 1250 },
  { month: 'Sep', category: 'Groceries', amount: 389.4 },
  { month: 'Oct', category: 'Rent', amount: 1250 },
  { month: 'Oct', category: 'Transport', amount: 77.8 },
  { month: 'Oct', category: 'Groceries', amount: 433.15 },
  { month: 'Nov', category: 'Rent', amount: 1250 },
  { month: 'Nov', category: 'Groceries', amount: 410.6 },
  { month: 'Dec', category: 'Rent', amount: 1250 },
  { month: 'Dec', category: 'Transport', amount: 140 },
  { month: 'Dec', category: 'Groceries', amount: 512.45 }
];

export const chartData = {
  dailyRuns,
  statusCounts: [
    { status: 'Success', count: 276 },
    { status: 'Failed', count: 17 },
    { status: 'Running', count: 6 }
  ],
  noRuns: [] as typeof dailyRuns,
  dailySales: [
    { day: 'Mon', revenue: 1240.5 },
    { day: 'Tue', revenue: 1385.2 },
    { day: 'Wed', revenue: 982.75 },
    { day: 'Thu', revenue: 1456.1 },
    { day: 'Fri', revenue: 2108.4 },
    { day: 'Sat', revenue: 2650.9 },
    { day: 'Sun', revenue: 1730 }
  ],
  monthlyExpenses,
  // The year's totals of `monthlyExpenses`.
  expensesByCategory: [
    { category: 'Rent', amount: 13500 },
    { category: 'Groceries', amount: 4601.55 },
    { category: 'Transport', amount: 638.9 },
    { category: 'Other', amount: 175.89 }
  ]
};
