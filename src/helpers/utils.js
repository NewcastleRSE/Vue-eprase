export function calcPercentage(num, total) {
  return total !== 0 ? ((num / total) * 100).toFixed(1) : 0
}

export function calcNum(num, total) {
  if(total !== 0) {
    let tempnum = ((num/total) * 100).toFixed(1)
    return parseInt(tempnum);
  }
  return 0;
}

export function stringTrueFalseToBoolean(s) {
  return s.toLowerCase() != "false" 
}

export function prependZero(month) {
  try {
    return parseInt(month) < 10 ? `0${month}` : month + ''
  } catch(e) {
    return '00'
  }  
}

export function getFormattedDate(time) {
  return new Date(time * 1000).toLocaleDateString("en-GB")
}

export function validateNHSEmail(value) {
  console.debug('Validate NHS email', value)
  const isValid = /^[a-zA-Z0-9-.]+@([a-z-]+.|)nhs.(uk|net)+$/.test(value)
  console.debug('Return', isValid)
  return isValid
}

export function usernameFromEmail(email) {
  return email.split('@').shift()
}
