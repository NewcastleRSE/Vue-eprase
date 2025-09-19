<template>
  <GroupElement name="assessmentGroup" :class="'mb-4'">
    <StaticElement name="assessmentGroupLoading" v-if="!dataLoaded">
      <div class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading selections...</span>
        </div>
      </div>
    </StaticElement>
    <GroupElement name="assessmentGroupLoaded" v-if="dataLoaded">
      <StaticElement name="selectionHeading">
        <h2>Assessment Selection</h2>
      </StaticElement>
      <StaticElement name="assessmentGroupLoadedIntroPara">
        <p>
          It is now possible to test more than one type of ePrescribing System for each NHS Trust. If you are wanting to do this 
          then we advise that you set up and complete the assessment for the first EP System before proceeding to start the next 
          EP System assessment.
        </p>
      </StaticElement>
                      
      <GroupElement name="continueAssessmentGroup" v-if="incompleteAssessments.length != 0">
        <table class="table table-striped caption-top vf-col-12">
          <caption><h3>You can continue with any of the following assessments:</h3></caption>
          <thead>
            <tr>
              <th>ePrescribing System</th>
              <th>Patient Type</th>
              <th>Assessment Status</th>
              <th>Created on</th>
              <th>Last Update</th>
              <th>User</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="assessment in incompleteAssessments">                  
              <td>{{ assessment.ep_service.name == 'Other' ? assessment.other_ep_service : assessment.ep_service.name }}</td>
              <td>{{ assessment.patient_type }}</td>
              <td>{{ assessment.state }}</td>
              <td>{{ convertDate(assessment.createdAt, false) }}</td>
              <td>{{ convertDate(assessment.updatedAt, true) }}</td>
              <td>{{ assessment.createdBy.username }}</td>
              <td>
                <ButtonElement :name="'select-' + assessment.documentId" title="Continue with this assessment" @click="continueAssessment(assessment.documentId)">
                  <i class="bi bi-play-fill me-2"></i>Select
                </ButtonElement>
              </td>
            </tr>
          </tbody>
        </table>           
      </GroupElement>

      <GroupElement name="reportAssessmentGroup" v-if="completeAssessments.length != 0">
        <table class="table table-striped caption-top vf-col-12">
          <caption><h3>You <canvas id=""></canvas> view the final reports for the following assessments:</h3></caption>
          <thead>
            <tr>
              <th>ePrescribing System</th>
              <th>Patient Type</th>
              <th>Assessment Status</th>
              <th>Created on</th>
              <th>Last Update</th>
              <th>User</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="assessment in completeAssessments">                  
              <td>{{ assessment.ep_service.name == 'Other' ? assessment.other_ep_service : assessment.ep_service.name }}</td>
              <td>{{ assessment.patient_type }}</td>
              <td>{{ assessment.state }}</td>
              <td>{{ convertDate(assessment.createdAt, false) }}</td>
              <td>{{ convertDate(assessment.updatedAt, true) }}</td>
              <td>{{ assessment.createdBy.username }}</td>
              <td>
                <ButtonElement :name="'select-' + assessment.documentId" title="Continue with this assessment" @click="continueAssessment(assessment.documentId)">
                  <i class="bi bi-play-fill me-2"></i>Select
                </ButtonElement>
              </td>
            </tr>
          </tbody>
        </table>           
      </GroupElement>

      <GroupElement name="newAssessmentGroup" v-if="allowNew">
        <StaticElement name="newAssessmentCaption">
          <h3>Start a new assessment</h3>
        </StaticElement>
        <ObjectElement name="selection" ref="selectionData"> 
          <HiddenElement name="assessmentOption" default="new" />
          <SelectElement name="epService"
            @change="(newVal) => { isOtherEpSystem = newVal.label == 'Other' }"
            :label="embolden('For ePrescribing system', true)"
            :native="false" 
            :search="true"
            :track-by="['label', 'value']"
            :items="getEpSystemNames"
            :object="true"
            :messages="{required: 'Name of ePrescribing system is required'}"           
            :rules="['required']"          
          />
          <TextElement v-if="isOtherEpSystem" name="otherEpService" placeholder="Name of your eP system"
            :label="embolden('Name of ePrescribing system', true)"
            :debounce="200" 
            :messages="{required: 'Other eP system name is required'}" 
            :rules="['required', 'fieldIsOther:selection.epService']" />
          <RadiogroupElement v-if="!adultAssessmentExists && !paediatricAssessmentExists" name="patientType"
            :label="embolden('For patient type', true)"      
            :items="[
              { value: 'Adult', label: 'Adults', disabled: adultAssessmentExists },
              { value: 'Paediatric', label: 'Paediatrics', disabled: paediatricAssessmentExists }]"
            :messages="{required: 'Select an option'}" 
            :rules="[{ 'required': ['assessmentOption', '==', 'new'] }]"
          />
          <StaticElement v-if="adultAssessmentExists || paediatricAssessmentExists" name="patientTypePlaceholder">
            <span class="fw-bold">For patient type : </span>{{ adultAssessmentExists ? 'Paediatrics' : 'Adults' }}
          </StaticElement>
          <GroupElement name="sharingConsentQuestions" class="alert alert-warning mt-4" role="alert">
            <CheckboxElement name="shareTrustsOptOut">
              <span v-html="embolden('Good mitigation results from this ePRaSE assessment will be shared with <i>other NHS trusts</i> to support learning on EP system optimisation.<br>If you <i>do not</i> consent to sharing your data, please opt out by checking this box')"></span>
            </CheckboxElement>          
            <CheckboxElement name="shareSuppliersOptOut">
              <span v-html="embolden('Good mitigation results may be shared with <i>EP system suppliers</i> to support learning on EP system optimisation.<br>If you <i>do not</i> consent to sharing your data, please opt out by checking this box')"></span>
            </CheckboxElement>   
          </GroupElement> 
        </ObjectElement>              
      </GroupElement>
         
    </GroupElement>      
  </GroupElement>
</template>

<script>

import { mapState } from 'pinia'
import { rootStore } from '../stores/root'
import { assessmentStore } from '../stores/assessment'
import { authenticationStore } from '../stores/authentication'
import { isoToUkDate } from '../helpers/utils'

export default {
  name: 'AssessmentSelection',  
  computed: {
    ...mapState(assessmentStore, ['allPossibleAssessments', 'assessmentData', 'dataReady', 'selectAssessment']),
    ...mapState(authenticationStore, ['email', 'orgName', 'hospital']),
    ...mapState(rootStore, ['getEpSystems', 'audit']),
    selectionData() {
      return this.assessmentData.selection
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
    incompleteAssessments() {
      // Continue allowed if there are non-completed assessments
      return this.allPossibleAssessments.filter(assessment => assessment.state != 'Assessment complete')
    },
    completeAssessments() {
      // Reports are allowed if there are any completed assessments
      return this.allPossibleAssessments.filter(assessment => assessment.state == 'Assessment complete')
    }, 
    dataLoaded() {
      return this.dataReady
    }
  },
  data() {
    return {
      isOtherEpSystem: false
    }
  },
  emits: ['jumpToStep'],
  methods: {
    setOption(optionValue) {
      this.selectionData.assessmentOption = optionValue
    },     
    async continueAssessment(assessmentId) {

      console.group('continueAssessment()')
      console.debug('Chosen to continue assessment', assessmentId)
      console.assert(assessmentId != null, 'No assessment ID supplied!')

      // Select an existing assessment
      this.setOption('continue')            
      const selectResponse = await this.selectAssessment(assessmentId)        
      if (selectResponse !== true) {
        throw new Error(selectResponse)
      } else {
        console.groupEnd()
        this.$emit('jumpToStep', assessmentId)
      } 
    },
    async getEpSystemNames() {
      let epSystems = []
      const response = await this.getEpSystems()
      if (response.status < 400) {
        // Make sure 'Other' appears at the end of the list for user friendliness (system names are sorted alphabetically)        
        epSystems = response.data.data.map(ep => { return { value: ep.documentId, label: ep.name } })
        const otherIdx = epSystems.findIndex(ep => ep.label == 'Other')
        epSystems.push(epSystems.splice(otherIdx, 1)[0]) //https://stackoverflow.com/questions/24909371/move-item-in-array-to-last-position
        epSystems.unshift({value: '', label: 'Please select...', disabled: true})       
      } else {
        throw new Error(response.message)
      }
      return epSystems
    },
    convertDate(d, useTime) {
      return isoToUkDate(d, useTime)
    }
  },
  async beforeUnmount() {
    console.group('AssessmentSelection beforeUnmount()')
    console.assert(this.dataLoaded, 'AssessmentSelection beforeUnmount() hook - dataReady flag is false')
    console.debug(this.selectionData)
    if (this.selectionData.assessmentOption == 'new') {
      // Create a new assessment
      const selectResponse = await this.selectAssessment()        
      if (selectResponse !== true) {
        throw new Error(selectResponse)
      } 
    }    
    console.groupEnd()
  }
}
</script>

<style scoped></style>