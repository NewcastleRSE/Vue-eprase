<template>
  <main>
    <div ref="printableReportHeading"></div>
    <div ref="printableReportContainer" id="printableReportContainer"></div>
    <button type="button" class="btn btn-primary m-1" @click="printablePdfHandler">
      <i class="bi bi-filetype-pdf pe-1"></i>{{ buttonCaption }}
    </button>
  </main>
</template>

<script>

import dayjs from 'dayjs'
import { rootStore } from '../stores/root'
import { authenticationStore } from '../stores/authentication'
import { mapStores } from 'pinia'
import Plotly from 'plotly.js-cartesian-dist-min'
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
      PrintJS({ printable: 'printableReportContainer', type: 'html', header: this.heading, targetStyles: ['*'], maxWidth: 2000 })
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