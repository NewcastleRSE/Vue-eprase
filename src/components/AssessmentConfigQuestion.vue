<template>
  <GroupElement name="configQuestionGroup" :class="'mb-4'">
    <StaticElement name="configQuestionDataLoading" v-if="!auxiliaryDataReady">
      <div class="d-flex align-items-center">
        <strong role="status">Loading config question data for assessment...</strong>
        <div class="spinner-border ms-auto" aria-hidden="true"></div>
      </div>
    </StaticElement>
    <GroupElement name="configQuestionDataLoaded" v-if="auxiliaryDataReady">
      <StaticElement name="configQuestionHeading">
        <h2>Configuration Questions</h2>
        <h3>Please answer the following questions about your ePrescribing System:</h3>
      </StaticElement>
      <ObjectElement ref="configObject" name="config">
        <table class="table table-striped vf-col-12">
          <tbody>
            <tr v-for="qr in matrixQuestionRows">
              <td>                            
                <ToggleElement 
                  :name="qr.value"
                  :label="qr.label"
                  :labels="{ on: 'Yes', off: 'No' }"
                />
              </td>
            </tr>                            
          </tbody>
        </table>                
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
    ...mapState(assessmentStore, ['dataReady', 'updateAssessmentStatus', 'getConfigQuestionData', 'saveConfigQuestionData']),
    ...mapState(rootStore, ['getConfigQuestions']),
    dataLoaded() {
      return this.dataReady && this.auxiliaryDataReady
    },
    matrixQuestionRows() {
      return this.questionRows
    }
  },
  data() {
    return {
      auxiliaryDataReady: false,
      questionRows: []
    }
  },
  methods: {   
    async saveConfigQuestionResponses() {
      
      console.group('saveScenarioResponse()')
      console.debug('Form part-object', this.$refs['configObject'])
     
      const saveResponse = await this.saveConfigQuestionData(this.$refs['configObject'].data, true)
      if (saveResponse !== true) {
        this.raiseDataError(saveResponse)
      }
      console.groupEnd()
    },
    raiseDataError(msg) {
      this.auxiliaryDataReady = true
      throw new Error(msg)
    }   
  },
  async mounted() {
    console.group('AssessmentConfigQuestion mounted()')
    this.auxiliaryDataReady = false
    // Get actual questions   
    const loadConfigQuestionsResponse = await this.getConfigQuestions()
    if (loadConfigQuestionsResponse.status >= 400) {      
      throw new Error(loadConfigQuestionsResponse)
    } else {      
      this.questionRows = loadConfigQuestionsResponse.data.data.map(cqr => { return { value: cqr.config_error_code, label: this.embolden(cqr.description, true) } })
    }
    const loadCqDataResponse = await this.getConfigQuestionData(true)
    if (loadCqDataResponse !== true) {
      this.raiseDataError(loadCqDataResponse)
    }    
    this.auxiliaryDataReady = true   
    console.groupEnd()
  },
  async beforeUnmount() {
    console.group('AssessmentConfigQuestion beforeUnmount()')
    console.assert(this.dataLoaded, 'AssessmentConfigQuestion beforeUnmount() hook - dataReady flag is false')
    await this.saveConfigQuestionResponses()   
    const updateResponse = await this.updateAssessmentStatus('Config errors complete', true)
    if (updateResponse !== true) {
      this.raiseDataError(updateResponse)
    }
    console.groupEnd()
  }
}
</script>

<style scoped></style>