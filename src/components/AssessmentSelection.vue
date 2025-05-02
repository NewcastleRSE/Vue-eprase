<template>
  <GroupElement ref="system" name="systemForm" :class="'mb-4'">
    <StaticElement name="systemHeading">
      <h2>Assessment Selection</h2>
      <h3></h3>
    </StaticElement>
    <RadiogroupElement name="assessmentOption"
      :label="embolden('I would like to:', true)"      
      :items="[
        { value: 'new', label: 'Start a new assessment' },
        { value: 'continue', label: 'Continue an existing assessment' }
      ]"
      :messages="{required: 'Select an option'}" 
      :rules="['required']"
    />
    <RadiogroupElement v-if="assessmentOption == 'new'" v-model="assessmentData.patientType" name="patientType"
      :label="embolden('For patient type', true)"      
      :items="[
        { value: 'Adult', label: 'Adults' },
        { value: 'Paediatric', label: 'Paediatrics' }]",
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
    ...mapState(assessmentStore, ['assessmentId', 'assessmentState', 'patientType']),
    assessmentData() {
      return assessmentStore().assessmentData
    }
  },
  data() {
    return {
      serverError: false,   
      assessmentOption: '',
      startTime: ''
    }
  },
  methods: {

  },
  mounted() {

  }
}
</script>

<style scoped></style>