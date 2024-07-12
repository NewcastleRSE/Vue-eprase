<template>
  <button type="button" class="btn btn-primary m-1" @click="printablePdfHandler">
    <i class="bi bi-filetype-pdf pe-1"></i>{{ buttonCaption }}
  </button>
</template>

<script>

import PrintJS from 'print-js'

export default {
  name: "PrintablePdf",
  props: {
    heading: '',
    printableElementId: 'printable',
    buttonCaption: 'Printable PDF',
    options: {},
    preprocess: () => {}
  },
  methods: {    
    printablePdfHandler() {
      this.preprocess()
      const pjsArgs = Object.assign({ printable: this.printableElementId, type: 'html', header: this.heading, targetStyles: ['*'], maxWidth: 2000 }, this.options)
      PrintJS(pjsArgs)
    }
  }
}

</script>

<style scoped></style>