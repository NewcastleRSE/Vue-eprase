<template>
  <GroupElement name="toolExitGroup" :class="'mb-4'">
    <StaticElement name="configQuestionDataLoading">
      <h2>Assessment Complete</h2>
      <div class="alert alert-info mt-2" role="alert">
        Thank you for completing this assessment, you can now exit the tool where you can leave feedback via the user survey, or you can start a new 
        assessment for any additional adult EP systems or start a paediatric assessment from the Assessment Selection page. Please select using the buttons below.
      </div>
      <GroupElement name="exitButtonBar">
        <!-- TO DO -->
        <ButtonElement name="about" title="About" full
          :columns="3" 
          :add-class="'me-2'">
          <i class="bi bi-box-arrow-right me-lg-2"></i><span class="d-lg-block d-none">Exit tool</span>
        </ButtonElement>
        <ButtonElement name="about" title="About" full
          @click="startNewAssessment"
          :columns="3" 
          :add-class="'me-2'">
          <i class="bi bi-play-fill me-lg-2"></i><span class="d-lg-block d-none">Start a new assessment</span>
        </ButtonElement>
      </GroupElement>
    </StaticElement>       
  </GroupElement>
</template>

<script>

import { mapState } from 'pinia'
import { assessmentStore } from '../stores/assessment'
import { rootStore } from '../stores/root'

export default {
  name: 'AssessmentConfigQuestion',  
  computed: {
    ...mapState(assessmentStore, ['dataReady', 'assessmentData', 'onOrPassedAssessmentStage', 'updateAssessmentStatus', 'getConfigQuestionData', 'saveConfigQuestionData']),
    ...mapState(rootStore, ['getConfigQuestions']),
    dataLoaded() {
      return this.dataReady
    },
    configQuestionData() {
      return this.assessmentData.config.configQuestions
    },
    matrixQuestionRows() {
      return this.questionRows
    }
  },
  data() {
    return {
      questionRows: [],
      savedResponseData: true
    }
  },
  emits: ['jumpToStep'],
  methods: { 
    startNewAssessment() {
      this.$emit('jumpToStep', null)
    },
  },
  async mounted() {
    console.group('AssessmentToolExit mounted()')    
    console.groupEnd()
  },
  async beforeUnmount() {
    console.group('AssessmentToolExit beforeUnmount()')    
    console.groupEnd()
  }
}
</script>

<style scoped></style>