export function calcPercentage(num, total) {
  return total !== 0 ? ((num / total) * 100).toFixed(1) : 0
}

export function calcNum(num, total) {
  if(total !== 0) {
    let tempnum = ((num/total) *100).toFixed(1);
    return parseInt(tempnum);
  }
  return 0;
}