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
          data-bs-toggle="modal" data-bs-target="#aboutModal"
          :columns="3" 
          :add-class="'me-2'">
          <i class="bi bi-info-circle me-lg-2"></i><span class="d-lg-block d-none">Start a new assessment</span>
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
  methods: { 
    getExistingResponse(cqCode) {
      const cqResults = this.assessmentData.config.configQuestionResults || []
      const exResponses = cqResults.filter(cqr => cqr.config_error_code == cqCode)
      return exResponses.length > 0 ? (exResponses[0].result == 1 ? 'Yes' : 'No') : ''     
    },
    hasExistingResponse(cqCode) {
      const cqResults = this.assessmentData.config.configQuestionResults || []
      return cqResults.filter(cqr => cqr.config_error_code == cqCode).length > 0
    },
    async saveConfigQuestionResponses() {
      
      console.group('saveScenarioResponse()')
      console.debug('Form part-object', this.$refs['configObject'])

      this.savedResponseData = false
     
      const saveResponse = await this.saveConfigQuestionData(this.$refs['configObject'].data, true)
      if (saveResponse !== true) {
        throw new Error(saveResponse)
      }

      setTimeout(() => {
        this.savedResponseData = true
      }, 500)
      console.groupEnd()
    }
  },
  async mounted() {
    console.group('AssessmentConfigQuestion mounted()')
    this.questionRows = this.configQuestionData.map(cqr => { return { value: cqr.config_error_code, label: this.embolden(cqr.description, false) } })
    const loadCqDataResponse = await this.getConfigQuestionData(true)
    if (loadCqDataResponse !== true) {
      throw new Error(loadCqDataResponse)
    }    
    console.groupEnd()
  },
  async beforeUnmount() {
    console.group('AssessmentConfigQuestion beforeUnmount()')
    console.assert(this.dataLoaded, 'AssessmentConfigQuestion beforeUnmount() hook - dataReady flag is false')
    await this.saveConfigQuestionResponses()   
    const updateResponse = await this.updateAssessmentStatus('Config errors complete', true)
    if (updateResponse !== true) {
      throw new Error(updateResponse)
    }
    console.groupEnd()
  }
}
</script>

<style scoped></style>