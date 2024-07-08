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
    buttonCaption: 'Printable PDF'
  },
  methods: {
    printablePdfHandler() {
      PrintJS({ printable: this.printableElementId, type: 'html', header: this.heading, targetStyles: ['*'], maxWidth: 2000 })
    }
  }
}

</script>

<style scoped></style>