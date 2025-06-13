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
        { value: 'Adult', label: 'Adults', disabled: adultAssessmentExists },
        { value: 'Paediatric', label: 'Paediatrics', disabled: paediatricAssessmentExists }]"
      :messages="{required: 'Select an option'}" 
      :rules="[{ 'required': ['assessmentOption', '==', 'new'] }]"
    />       
    <table v-if="selectionData.assessmentOption == 'continue' || selectionData.assessmentOption == 'reports'" class="table table-striped caption-top" style="min-width:800px">
      <caption>You can access the following assessments:</caption>
      <thead>
        <tr>
          <th>&nbsp;</th>
          <th>ePrescribing system</th>
          <th>Patient type</th>
          <th>Assessment state</th>
          <th>Last update</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="assessment in updatableAssessments">
          <td><RadioElement name="assessmentId" :radio-value="assessment.documentId" :class="'me-2'" /></td>
          <td>{{ assessment.system && assessment.system.ep_service ? assessment.system.ep_service : 'Not yet specified' }}</td>
          <td>{{ assessment.patient_type }}</td>
          <td>{{ assessment.state }}</td>
          <td>{{ assessment.updatedAt }}</td>
        </tr>
      </tbody>
    </table>  
  </GroupElement>
</template>

<script>

import { mapState } from 'pinia'
import { rootStore } from '../stores/root'
import { assessmentStore } from '../stores/assessment'
import { authenticationStore } from '../stores/authentication'
import { isoToUkDate } from '../helpers/utils'

const ASSESSMENT_STATES = [
  'Not started',
  'System complete',
  'Patient build complete',
  'Scenarios complete'
]

export default {
  name: 'AssessmentSelection',
  props: {
    isActive: {
      type: Boolean,
      value: false,
      required: true
    },
    stepDir: {
      type: Number,
      value: 1,
      required: true
    }
  },
  watch: {
    async isActive(newVal, oldVal) { 
      console.debug('isActive() watcher - new value', newVal, 'old value', oldVal)
      if (newVal === false && stepDir == 1) {
        // User has moved away forwards in the dialogs => save the info
        const saveResponse = await this.saveAssessmentForInstitution()        
        if (saveResponse) {
          await this.audit('save_assessement:' + this.email, '/assessment')
        } else {
          this.$emit('save-data-fail', saveResponse.message)
          await this.audit('save_assessement_fail:' + this.email, '/assessment')
        }
      }  
    }
  },
  computed: {
    ...mapState(assessmentStore, ['allPossibleAssessments', 'assessmentData', 'saveAssessmentForInstitution']),
    ...mapState(authenticationStore, ['email']),
    ...mapState(rootStore, ['audit']),
    selectionData() {
      return this.assessmentData
    },
    updatableAssessments() {
      return this.listQualifyingAssessments()//.map(a => { 
        //a.updatedAt = isoToUkDate(a.updatedAt)
        //return a
      //})
    },
    allowNew() {
      // New assessment allowed if there is < 2 assessments for the user's hospital (2 patient types - adult & child)
      return this.allPossibleAssessments.length < 2
    },
    adultAssessmentExists() {
      // New adult assessment barred if one already exists
      return this.allPossibleAssessments.filter(assessment => assessment.patient_type == 'Adult').length > 0
    },
    paediatricAssessmentExists() {
      // New paediatric assessment barred if one already exists
      return this.allPossibleAssessments.filter(assessment => assessment.patient_type == 'Paediatric').length > 0
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
  emits: ['save-data-fail'],
  methods: {      
    listQualifyingAssessments() {
      let validCriteria = ASSESSMENT_STATES
      switch (this.selectionData.assessmentOption) {
        case 'reports': validCriteria = ASSESSMENT_STATES.slice(3, 4); break;
        case 'continue': validCriteria = ASSESSMENT_STATES.slice(0, 3); break;
        default: validCriteria = ASSESSMENT_STATES; break;
      }      
      return this.allPossibleAssessments.filter(assessment => validCriteria.includes(assessment.state))
    }
  },
  mounted() {
    console.group('AssessmentSelection mounted()')
    console.debug('All possible assessments', this.allPossibleAssessments)
    console.groupEnd()
  }
}
</script>

<style scoped></style>