import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

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

export function isoToUkDate(iso, includeTime = false) {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  console.debug(iso, includeTime)
  const ukd = dayjs(iso).tz('Europe/London').format(`DD-MM-YYYY${includeTime ? ' HH:mm' : ''}`)
  console.debug(ukd)
  return ukd
}

export function usernameFromEmail(email) {
  return email.split('@').shift()
}

export function shuffle(a) {
  // Durstenfeld shuffle in-place - see https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  console.debug('List before shuffle', a)
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  console.debug('List after shuffle', a)
}
