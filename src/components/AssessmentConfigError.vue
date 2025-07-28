<template>
  <GroupElement name="configErrorGroup" :class="'mb-4'">
    <StaticElement name="configErrorDataLoading" v-if="!dataReady">
      <div class="d-flex align-items-center">
        <strong role="status">Loading config error data for assessment...</strong>
        <div class="spinner-border ms-auto" aria-hidden="true"></div>
      </div>
    </StaticElement>
    <GroupElement name="configErrorDataLoaded">
      <StaticElement name="configErrorHeading">
        <h2>Config Errors</h2>
      </StaticElement>
      <!-- TODO -->
    </GroupElement>    
  </GroupElement>
</template>

<script>

import { mapState } from 'pinia'
import { assessmentStore } from '../stores/assessment'

export default {
  name: 'AssessmentConfigError',  
  computed: {
    ...mapState(assessmentStore, ['dataReady', 'updateAssessmentStatus']),
  },
  emits: ['save-data-fail', 'get-data-fail'],
  data() {
    return {
      
    }
  },
  methods: {  
    
  },
  mounted() {
    console.group('AssessmentConfigError mounted()')
    console.groupEnd()
  },
  beforeUnmount() {
    console.group('AssessmentConfigError beforeUnmount()')
    console.groupEnd()
  }
}
</script>

<style scoped></style>