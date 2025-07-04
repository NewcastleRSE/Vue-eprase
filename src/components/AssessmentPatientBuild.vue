<template>
  <GroupElement name="patientBuildGroup" :class="'mb-4'">
    <StaticElement name="patientBuildHeading">
      <h2>Patient build</h2>
    </StaticElement>
    <StaticElement name="patientBuildBody">
    
    </StaticElement>
  </GroupElement>
</template>

<script>

import { mapState } from 'pinia'
import { assessmentStore } from '../stores/assessment'

export default {
  name: 'AssessmentPatientBuild',  
  computed: {
    ...mapState(assessmentStore, ['patientListBuild', 'updateAssessmentStatus']),  
  },
  emits: ['assessment-patient-build-complete', 'get-data-fail', 'save-data-fail'],
  data() {
    return {      
    }
  },
  methods: {  
    
  },
  async mounted() {
    console.group('AssessmentPatientBuild mounted()')
    const updateResponse = await this.updateAssessmentStatus('Patient build started')
    if (updateResponse !== true) {
      this.$emit('save-data-fail', updateResponse)
    }
    const loadPatientsResponse = await this.patientListBuild()
    if (loadPatientsResponse !== true) {
      this.$emit('save-data-fail', loadPatientsResponse)
    }
    console.groupEnd()
  },
  async beforeUnmount() {
    console.group('AssessmentPatientBuild beforeUnmount()')
    const updateResponse = await this.updateAssessmentStatus('Patient build complete')
    if (updateResponse !== true) {
      this.$emit('save-data-fail', updateResponse)
    } else {
      this.$emit('assessment-patient-build-complete', 'ok')
    }
    console.groupEnd()
  }
}
</script>

<style scoped></style>