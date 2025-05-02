<template>
  <GroupElement ref="system" name="systemForm" :class="'mb-4'">
    <StaticElement name="systemHeading">
      <h2>Assessment Selection</h2>
      <h3></h3>
    </StaticElement>
    <SelectElement name="assessmentOption"
      :label="embolden('I would like to:', true)"
      :native="false" 
      :search="true"
      :track-by="['label', 'value']"
      :items="
        { value: '', label: 'Please select...', disabled: true },
        { value: 'new', label: 'Start a new assessment' },
        { value: 'continue', label: 'Continue an existing assessment' }"
      :messages="{required: 'Select an option'}" 
      :rules="['required']"
    />
    <SelectElement name="patientType"
      :label="embolden('For patient type', true)"
      :native="false" 
      :search="true"
      :track-by="['label', 'value']"
      :items="
        { value: '', label: 'Please select...', disabled: true },
        { value: 'Adult', label: 'Start a new assessment' },
        { value: 'Paediatric', label: 'Continue an existing assessment' }"
      :messages="{required: 'Select an option'}" 
      :rules="['required']"
    />
  </GroupElement>
</template>

<script>

import { mapState } from 'pinia'
import { assessmentStore } from '../stores/assessment'

export default {
  name: 'AssessmentSelection',
  computed: {
    ...mapState(assessmentStore, ['assessmentId', 'assessmentState', 'patientType'])
  },
  methods: {

  },
  mounted() {

  }
}
</script>

<style scoped></style>