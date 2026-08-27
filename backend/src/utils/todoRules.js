function isValidDateRange(startDate, endDate) {
  return endDate >= startDate;
}

function computeStatus({ startDate, endDate, isDone }, today = new Date()) {
  const todayStr = today.toISOString().slice(0, 10);
  if (isDone) return '완료';
  if (todayStr < startDate) return '시작전';
  if (todayStr <= endDate) return '진행중';
  return '기한초과';
}

module.exports = { isValidDateRange, computeStatus };
