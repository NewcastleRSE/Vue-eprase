// vueform.config.(js|ts)

import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import en from '@vueform/vueform/locales/en'
import bootstrap from '@vueform/vueform/dist/bootstrap'
import { defineConfig, Validator } from '@vueform/vueform'

// https://www.30secondsofcode.org/js/s/get-nested-object-value/ - uses nullish coalescing (??) and optional chaining (?.) operators
const deepGet = (obj, keys) => keys.reduce((xs, x) => xs?.[x] ?? null, obj)

const nhsEmail = class extends Validator {
  get msg() {
    return 'Must be a valid nhs.net or nhs.uk email address'
  }
  check(value) {
    console.debug('Validate NHS email', value)
    const isValid = /^[a-zA-Z0-9-.]+@([a-z-]+.|)nhs.(uk|net)+$/.test(value)
    console.debug('Return', isValid)
    return isValid
  }
}

const nonEmptyObject = class extends Validator {
  get msg() {
    return 'Please fill in this value'
  }
  check(value) {
    if (typeof(value) === 'object') {
      return Object.keys(value).length > 0
    }
    return false
  }
}

const fieldIsOther = class extends Validator {

  get msg() {
    return 'Please complete this field'
  }

  get messageParams() {
    return {
      attribute: this.attributeName,
      otherField: this.otherField
    }
  }

  get otherField() {
    return this.attributes[0]
  }

  check(value) {
    console.debug(this.otherField, this.form$.data)
    this.watch(this.otherField)
    let otherVal = deepGet(this.form$.data, this.otherField.split('.'))    
    if (otherVal != null) {
      console.debug(otherVal)
      if (Object.keys(otherVal).includes('label')) {
        // Select option is an object with keys 'label' and 'value'
        otherVal = otherVal.label
      }
      const otherArr = Array.isArray(otherVal) ? otherVal : [otherVal]
      return otherArr.includes('Other') || otherVal.includes('other')
    }
    return true
  }
}

const dateIsSameOrAfter = class extends Validator {
  get msg() {
    return 'Must be the same or after :otherDateDescription'
  }

  get messageParams() {
    return {
      attribute: this.attributeName,
      otherDate: this.otherDate,
      otherDateDescription: this.otherDateDescription
    }
  }

  get otherDate() {
    return this.attributes[0]
  }

  get otherDateDescription() {
    return this.attributes[1]
  }

  check(value) {
    dayjs.extend(customParseFormat)
    dayjs.extend(isSameOrAfter)
    this.watch(this.otherDate)
    const d2 = deepGet(this.form$.data, this.otherDate.split('.'))
    if (d2 != null) {
      return dayjs(value).isSameOrAfter(dayjs(d2))
    }
    return true
  }
}

export default defineConfig({
  env: 'development',
  theme: bootstrap,
  locales: { en },
  locale: 'en',
  validateOn: 'change|step',
  displayErrors: false,
  displayMessages: false,
  floatPlaceholders: false,
  rules: {
    nhsEmail, nonEmptyObject, dateIsSameOrAfter, fieldIsOther
  }
})