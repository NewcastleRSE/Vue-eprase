export function calcPercentage(num, total) {
  return total !== 0 ? ((num / total) * 100).toFixed(1) : 0
}