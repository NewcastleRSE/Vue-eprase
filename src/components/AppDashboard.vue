<template>
  <div class="'mb-4'">
    <div v-if="!dataLoaded">
      <div class="d-flex align-items-center">
        <strong role="status">Loading assessment dashboard data...</strong>
        <div class="spinner-border ms-auto" aria-hidden="true"></div>
      </div>
    </div>
    <div v-if="dataLoaded">
      <div>

        <h2>ePRaSE Tool Assessment State Of Play Dashboard {{ epSystemYear }}</h2>        

        <div class="report-page">
          TO DO
        </div>
                
      </div>
    </div>    
  </div>
</template>

<script>      

import { mapState } from 'pinia'
import { rootStore } from '../stores/root'
import { appSettingsStore } from '../stores/appSettings'

export default {
  name: 'AssessmentDashboard',  
  computed: {
    ...mapState(appSettingsStore, ['year']),
    ...mapState(rootStore, ['progressReport']),
    dataLoaded() {
      return this.auxiliaryDataReady
    },    
    epSystemYear() {
      return this.year
    }
  },
  data() {
    return {
      dashboardData: null,
      auxiliaryDataReady: false
    }
  },
  methods: {
  },  
  async mounted() {
    console.group('AssessmentDashboard mounted()')

    this.auxiliaryDataReady = false

    const response = await this.progressReport()
    if (response.status >= 400) {
      throw new Error(response.message)
    }
    this.dashboardData = response.data.data

    this.auxiliaryDataReady = true
    
    console.groupEnd()
  },
  beforeUnmount() {
    console.group('AssessmentDashboard beforeUnmount()')
    console.groupEnd()
  }
}
</script>

<style scoped></style>