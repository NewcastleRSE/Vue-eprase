<template>
  <GroupElement name="configQuestionGroup" :class="'mb-4'">
    <StaticElement name="configQuestionDataLoading" v-if="!dataLoaded">
      <div class="d-flex align-items-center">
        <strong role="status">Loading config question data for assessment...</strong>
        <div class="spinner-border ms-auto" aria-hidden="true"></div>
      </div>
    </StaticElement>
    <GroupElement name="configQuestionDataLoaded" v-if="dataLoaded">
      <StaticElement name="configQuestionHeading">
        <h2>Configuration Questions</h2>
        <h3 v-if="!onOrPassedAssessmentStage('Config errors complete')">Please answer the following questions about your ePrescribing System:</h3>
        <h3 v-if="onOrPassedAssessmentStage('Config errors complete')">Your responses to questions about your ePrescribing System:</h3>
      </StaticElement>
      <ObjectElement ref="configObject" name="config">
        <table class="table table-striped vf-col-12">
          <tbody>
            <tr v-for="qr in matrixQuestionRows">
              <td v-if="!hasExistingResponse(qr.value)">                            
                <ToggleElement 
                  :name="qr.value"
                  :label="qr.label"
                  :labels="{ on: 'Yes', off: 'No' }"
                />
              </td>
              <td v-if="hasExistingResponse(qr.value)" v-html="qr.label + '  ' + getExistingResponse(qr.value)" />             
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
      questionRows: []
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
      
      console.group('saveConfigQuestionResponses()')
      console.debug('Form part-object', this.$refs['configObject'])
     
      const saveResponse = await this.saveConfigQuestionData(this.$refs['configObject'].data, true)
      if (saveResponse !== true) {
        throw new Error(saveResponse)
      }
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