<template>
  <main class="leftalign p-4">
    <div class="centered-heading" ref="printableReportHeading"></div>
    <div ref="printableReportContainer" id="printableReportContainer"></div>
    <div class="bg-warning-subtle p-3 my-4">
      <span class="fw-bold">Please ensure that you print the PDF in landscape format</span>
    </div>
    <button type="button" class="btn btn-primary m-1" @click="printablePdfHandler">
      <i class="bi bi-printer-fill pe-1"></i>{{ buttonCaption }}
    </button>
  </main>
</template>

<script>

import dayjs from 'dayjs'
import { rootStore } from '../stores/root'
import { authenticationStore } from '../stores/authentication'
import { mapStores } from 'pinia'
import Plotly from 'plotly.js-dist-min'
import PrintJS from 'print-js'

export default {
  name: "PrintablePdf",
  computed: {
    ...mapStores(authenticationStore, rootStore)
  },
  data() {
    return {
      heading: '',
      buttonCaption: 'Preview'
    }
  },
  methods: {
    printablePdfHandler() {      
      PrintJS({ printable: 'printableReportContainer', type: 'html', header: this.heading, targetStyles: ['*'], maxWidth: 4096 })
    }
  },
  mounted( ){
    const printableData = rootStore().printableReportData    
    this.heading = (printableData.heading || 'Please supply a meaningful heading') + `<h5>Prepared for ${authenticationStore().user} on ${dayjs().format('DD/MM/YYYY HH:mm')}</h5>`
    this.buttonCaption = printableData.buttonCaption || 'Preview'
    this.$refs.printableReportHeading.innerHTML = this.heading
    this.$refs.printableReportContainer.innerHTML = printableData.content || 'No content supplied'
  }
}

</script>

<style scoped></style>