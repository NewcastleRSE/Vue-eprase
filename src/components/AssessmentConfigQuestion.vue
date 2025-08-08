<template>
  <GroupElement name="configQuestionGroup" :class="'mb-4'">
    <StaticElement name="configQuestionDataLoading" v-if="!dataReady || !questionsLoaded">
      <div class="d-flex align-items-center">
        <strong role="status">Loading config question data for assessment...</strong>
        <div class="spinner-border ms-auto" aria-hidden="true"></div>
      </div>
    </StaticElement>
    <GroupElement name="configQuestionDataLoaded" v-if="dataReady && questionsLoaded">
      <StaticElement name="configQuestionHeading">
        <h2>Configuration Questions</h2>
        <h3>Please answer the following questions about your ePrescribing System:</h3>
      </StaticElement>
      <ObjectElement ref="configObject" name="config">
        <MatrixElement name="configQuestionResults" 
          :presets="['matrix-table']" 
          :rows="matrixQuestionRows" 
          :cols="[ { value: 1, label: embolden('Yes') }, { value: 0, label: embolden('No') } ]"
        />
      </ObjectElement>
    </GroupElement>    
  </GroupElement>
</template>

<script>

import { mapState } from 'pinia'
import { assessmentStore } from '../stores/assessment'
import { rootStore } from '../stores/root'

export default {
  name: 'AssessmentConfigQuestion',  
  computed: {
    ...mapState(assessmentStore, ['dataReady', 'updateAssessmentStatus']),
    ...mapState(rootStore, ['getConfigQuestions']),
    matrixQuestionRows() {
      return this.questionRows
    }
  },
  data() {
    return {
      questionsLoaded: false,
      questionRows: []
    }
  },
  methods: {      
  },
  async mounted() {
    console.group('AssessmentConfigQuestion mounted()')
    const loadConfigQuestionsResponse = await this.getConfigQuestions()
    if (loadConfigQuestionsResponse.status >= 400) {      
      throw new Error(loadConfigQuestionsResponse)
    } else {      
      this.questionRows = loadConfigQuestionsResponse.data.data.map(cqr => { return { value: cqr.config_error_code, label: this.embolden(cqr.description, true) } })
      this.questionsLoaded = true
    }
    console.groupEnd()
  },
  beforeUnmount() {
    console.group('AssessmentConfigQuestion beforeUnmount()')
    // Resulting form data is an object like: 
    // { C001: 1, C002: 0, C003: 1 }
    console.groupEnd()
  }
}
</script>

<style scoped></style>