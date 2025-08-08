<template>
  <GroupElement name="finalReportGroup" :class="'mb-4'">
    <StaticElement name="finalReportDataLoading" v-if="!dataReady">
      <div class="d-flex align-items-center">
        <strong role="status">Loading final report data for assessment...</strong>
        <div class="spinner-border ms-auto" aria-hidden="true"></div>
      </div>
    </StaticElement>
    <GroupElement name="finalReportDataLoaded">
      <StaticElement name="finalReportHeading">
        <h2>Final Report</h2>
      </StaticElement>
      <!-- TODO -->
    </GroupElement>    
  </GroupElement>
</template>

<script>

import { mapState } from 'pinia'
import { assessmentStore } from '../stores/assessment'

export default {
  name: 'AssessmentFinalReport',  
  computed: {
    ...mapState(assessmentStore, ['dataReady', 'updateAssessmentStatus']),
  },
  data() {
    return {
      
    }
  },
  methods: {  
    
  },
  mounted() {
    console.group('AssessmentFinalReport mounted()')
    console.groupEnd()
  },
  beforeUnmount() {
    console.group('AssessmentFinalReport beforeUnmount()')
    console.groupEnd()
  }
}
</script>

<style scoped></style>