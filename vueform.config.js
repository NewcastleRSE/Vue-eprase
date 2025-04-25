// vueform.config.(js|ts)

import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import en from '@vueform/vueform/locales/en'
import bootstrap from '@vueform/vueform/dist/bootstrap'
import { defineConfig, Validator } from '@vueform/vueform'

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

const dateIsSameOrAfter = class extends Validator {
  get msg() {
    return ':attribute must be the same or after :otherDateDescription'
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
    const d2 = this.form$.data[this.otherDate]
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
  displayErrors: false,
  displayMessages: false,
  floatPlaceholders: false,
  rules: {
    nhsEmail, dateIsSameOrAfter
  }
})