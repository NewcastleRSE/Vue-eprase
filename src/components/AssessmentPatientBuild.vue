<template>
  <GroupElement name="patientBuildGroup" :class="'mb-4'">    
    <StaticElement name="patientBuildHeading">
      <h2>Patient build</h2>
    </StaticElement>
    <StaticElement name="patientBuildBody">
      TODO
    </StaticElement>
  </GroupElement>  
</template>

<script>

import { mapState } from 'pinia'
import { assessmentStore } from '../stores/assessment'

export default {
  name: 'AssessmentPatientBuild',  
  computed: {
    ...mapState(assessmentStore, ['patientListBuild', 'dataReady', 'updateAssessmentStatus']),
    dataLoaded() {
      return this.dataReady
    }  
  },
  watch: {
    async dataLoaded(newVal) {
      if (newVal === true) {
        console.debug('AssessmentPatientBuild - dataLoaded watcher called on completion of previous data operation')        
        const loadPatientsResponse = await this.patientListBuild()
        if (loadPatientsResponse !== true) {
          this.$emit('save-data-fail', loadPatientsResponse)
        }
        console.debug('AssessmentPatientBuild - dataLoaded watcher complete')
      }
    }
  },
  emits: ['get-data-fail', 'save-data-fail'],
  data() {
    return {      
    }
  },
  methods: {  
    
  },
  async mounted() {
    console.group('AssessmentPatientBuild mounted()')        
    console.groupEnd()
  },
  async beforeUnmount() {
    console.group('AssessmentPatientBuild beforeUnmount()')
    console.assert(this.dataLoaded, 'AssessmentPatientBuild beforeUnmount() hook - dataReady flag is false')
    const updateResponse = await this.updateAssessmentStatus('Patient build complete', true)
    if (updateResponse !== true) {
      this.$emit('save-data-fail', updateResponse)
    }
    console.groupEnd()
  }
}
</script>

<style scoped></style>