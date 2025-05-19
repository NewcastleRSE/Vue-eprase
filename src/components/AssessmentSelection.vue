<template>
  <GroupElement ref="selection" name="selectionGroup" :class="'mb-4'">
    <StaticElement name="selectionHeading">
      <h2>Assessment Selection</h2>
    </StaticElement>
    <RadiogroupElement name="assessmentOption"
      :label="embolden('I would like to:', true)"      
      :items="[
        { value: 'new', label: 'Start a new assessment', disabled: ! allowNew },
        { value: 'continue', label: 'Continue an existing assessment', disabled: ! allowContinue },
        { value: 'reports', label: 'View reports for completed assessment(s)', disabled: ! allowReports }
      ]"
      :messages="{required: 'Select an option'}" 
      @change="(newVal) => { 
        assessmentOption = newVal 
      }"
      :rules="['required']"
    />
    <RadiogroupElement v-if="selectionData.assessmentOption == 'new'" name="patientType"
      :label="embolden('For patient type', true)"      
      :items="[
        { value: 'Adult', label: 'Adults' },
        { value: 'Paediatric', label: 'Paediatrics' }]"
      :messages="{required: 'Select an option'}" 
      :rules="[{ 'required': ['assessmentOption', '==', 'new'] }]"
    />
    <RadiogroupElement v-if="selectionData.assessmentOption != 'new'" name="assessmentId"
      :label="embolden('ePrescribing system', true)"      
      :items="listQualifyingAssessments"
      :messages="{required: 'Select an option'}" 
      :rules="[{ 'required': ['assessmentOption', '!=', 'new'] }]"
    />
  </GroupElement>
</template>

<script>

import { mapState } from 'pinia'
import { assessmentStore } from '../stores/assessment'

const ASSESSMENT_STATES = [
  'Not started',
  'System complete',
  'Patient build complete',
  'Scenarios complete'
]

export default {
  name: 'AssessmentSelection',
  computed: {
    ...mapState(assessmentStore, ['allPossibleAssessments', 'assessmentData']),
    selectionData() {
      return this.assessmentData
    },
    allowNew() {
      // New assessment allowed if there is < 2 assessments for the user's hospital (2 patient types - adult & child)
      return this.allPossibleAssessments.length < 2
    },
    allowContinue() {
      // Continue allowed if there are non-completed assessments
      return this.allPossibleAssessments.filter(assessment => assessment.state != 'Scenarios complete').length > 0
    },
    allowReports() {
      // Reports are allowed if there are any completed assessments
      return this.allPossibleAssessments.filter(assessment => assessment.state == 'Scenarios complete').length > 0
    }    
  },
  data() {
    return {
      serverError: false,   
      startTime: ''
    }
  },
  methods: {  
    listQualifyingAssessments() {
      let validCriteria = ASSESSMENT_STATES
      switch (this.selectionData.assessmentOption) {
        case 'reports': validCriteria = ASSESSMENT_STATES.slice(3, 4); break;
        case 'continue': validCriteria = ASSESSMENT_STATES.slice(0, 3); break;
        default: validCriteria = ASSESSMENT_STATES; break;
      }
      return this.allPossibleAssessments.filter(assessment => validCriteria.includes(assessment.state)).map(assessment => {
        return { value: assessment.id, label: `${assessment['system'].ep_service} (${assessment.patient_type})` } 
      })
    }
  },
  mounted() {
    console.group('AssessmentSelection mounted()')
    console.log('All possible assessments', this.allPossibleAssessments)
    console.groupEnd()
  }
}
</script>

<style scoped></style>