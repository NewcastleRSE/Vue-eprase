<template>
  <GroupElement ref="selection" name="selectionForm" :class="'mb-4'">
    <StaticElement name="systemHeading">
      <h2>Assessment Selection</h2>
    </StaticElement>
    <RadiogroupElement name="assessmentOption"
      :label="embolden('I would like to:', true)"      
      :items="[
        { value: 'new', label: 'Start a new assessment' },
        { value: 'continue', label: 'Continue an existing assessment' },
        { value: 'reports', label: 'View reports for completed assessment(s)' }
      ]"
      :messages="{required: 'Select an option'}" 
      @change="(newVal) => { 
        assessmentOption = newVal 
      }"
      :rules="['required']"
    />
    <RadiogroupElement v-if="assessmentOption == 'new'" name="patientType"
      :label="embolden('For patient type', true)"      
      :items="[
        { value: 'Adult', label: 'Adults' },
        { value: 'Paediatric', label: 'Paediatrics' }]"
      :messages="{required: 'Select an option'}" 
      :rules="[{ 'required': ['assessmentOption', '==', 'new'] }]"
    />
  </GroupElement>
</template>

<script>

import { mapState } from 'pinia'
import { assessmentStore } from '../stores/assessment'

export default {
  name: 'AssessmentSelection',
  computed: {
    ...mapState(assessmentStore, ['allPossibleAssessments'])   
  },
  data() {
    return {
      assessmentOption: '',
      serverError: false,   
      startTime: ''
    }
  },
  methods: {

  },
  mounted() {
    console.group('AssessmentSelection mounted()')
    console.log('All possible assessments', this.allPossibleAssessments)
    console.groupEnd()
  }
}
</script>

<style scoped></style>