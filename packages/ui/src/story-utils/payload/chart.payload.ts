const dailyRuns = [
  { day: 'Mon', runs: { success: 42, failed: 3 }, duration: 12.4 },
  { day: 'Tue', runs: { success: 51, failed: 1 }, duration: 11.8 },
  { day: 'Wed', runs: { success: 38, failed: 6 }, duration: 14.1 },
  { day: 'Thu', runs: { success: 45, failed: 2 }, duration: 12.9 },
  { day: 'Fri', runs: { success: 60, failed: 4 }, duration: 13.5 },
  { day: 'Sat', runs: { success: 22, failed: 1 }, duration: 10.2 },
  { day: 'Sun', runs: { success: 18, failed: 0 }, duration: 9.7 }
];

export const chartData = {
  dailyRuns,
  statusCounts: [
    { status: 'Success', count: 276 },
    { status: 'Failed', count: 17 },
    { status: 'Running', count: 6 }
  ],
  noRuns: [] as typeof dailyRuns
};
