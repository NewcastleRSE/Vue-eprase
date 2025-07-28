<template>
  <GroupElement name="scenarioGroup" :class="'mb-4'">
    <StaticElement name="scenarioDataLoading" v-if="!dataReady">
      <div class="d-flex align-items-center">
        <strong role="status">Loading scenario data for assessment...</strong>
        <div class="spinner-border ms-auto" aria-hidden="true"></div>
      </div>
    </StaticElement>
    <GroupElement name="scenarioDataLoaded">
      <StaticElement name="scenarioHeading">
        <h2>Scenarios</h2>
      </StaticElement>
      <!-- TODO -->
    </GroupElement>      
  </GroupElement>
</template>

<script>

import { mapState } from 'pinia'
import { assessmentStore } from '../stores/assessment'

export default {
  name: 'AssessmentScenario',  
  computed: {
    ...mapState(assessmentStore, ['dataReady', 'updateAssessmentStatus'])
  },
  data() {
    return {
      
    }
  },
  methods: {  
    
  },
  mounted() {
    console.group('AssessmentScenario mounted()')
    console.groupEnd()
  },
  beforeUnmount() {
    console.group('AssessmentScenario beforeUnmount()')
    console.groupEnd()
  }
}
</script>

<style scoped></style>