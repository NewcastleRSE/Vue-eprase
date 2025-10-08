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
          It is now possible to test more than one type of ePrescribing System deployed 
          in your trust. Users can also do both an adult and a separate paediatric assessment 
          for an individual EP system. If both adult and paediatric prescribing are undertaken, 
          <strong>both assessments should be completed</strong>. Please work through each 
          assessment one at a time i.e., complete one assessment fully before starting the next.
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
              <td>{{ assessment.eprase_creator_email || 'Not recorded' }}</td>
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
          <caption><h3>You can view the final reports for the following assessments:</h3></caption>
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
              <td>{{ assessment.eprase_creator_email || 'Not recorded' }}</td>
              <td>
                <ButtonElement :name="'select-' + assessment.documentId" title="Continue with this assessment" @click="continueAssessment(assessment.documentId)">
                  <i class="bi bi-play-fill me-2"></i>Select
                </ButtonElement>
              </td>
            </tr>
          </tbody>
        </table>           
      </GroupElement>

      <GroupElement name="newAssessmentGroup">
        <StaticElement name="newAssessmentCaption">
          <h3>Start a new assessment</h3>
        </StaticElement>
        <ObjectElement name="selection" ref="selectionData"> 
          <SelectElement name="epService"
            @change="changedEpSystem"
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
          <RadiogroupElement name="patientType"
            :label="embolden('For patient type', true)"      
            :items="[
              { value: 'Adult', label: 'Adults', disabled: !adultAssessmentAllowed },
              { value: 'Paediatric', label: 'Paediatrics', disabled: !paediatricAssessmentAllowed }]"
            :messages="{required: 'Select an option'}"
            :rules="['required']"
          />          
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
    ...mapState(assessmentStore, ['allPossibleAssessments', 'assessmentData', 'loggingOut', 'dataReady', 'selectAssessment']),
    ...mapState(authenticationStore, ['email', 'orgName', 'hospital']),
    ...mapState(rootStore, ['getEpSystems', 'audit']),
    selectionData() {
      return this.assessmentData.selection
    },      
    allowNew() {
      // New assessment allowed if there is < 2 assessments for the user's institution (2 patient types - adult & child)
      return this.allPossibleAssessments.length < 2
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
      isOtherEpSystem: false,
      adultAssessmentAllowed: true,
      paediatricAssessmentAllowed: true,
      continuingExistingAssessment: false
    }
  },
  emits: ['jumpToStep'],
  methods: {      
    async continueAssessment(assessmentId) {

      console.group('continueAssessment()')
      console.debug('Chosen to continue assessment', assessmentId)
      console.assert(assessmentId != null, 'No assessment ID supplied!')

      // Select an existing assessment
      this.continuingExistingAssessment = true
      const selectResponse = await this.selectAssessment(assessmentId)        
      if (selectResponse !== true) {
        throw new Error(selectResponse)
      } else {
        console.groupEnd()
        if (this.dataLoaded) {
          console.debug('Data loaded')
          this.$emit('jumpToStep', assessmentId)
        }
      } 
    },
    async getEpSystemNames() {
      let epSystems = []
      const response = await this.getEpSystems()
      if (response.status < 400) {
        // Filter out all system names that have existing assessments for both adults and paediatrics for this institution
        // Thanks to https://bobbyhadz.com/blog/javascript-count-occurrences-of-each-element-in-array
        const excludeEpSystemCodes = this.allPossibleAssessments.map(pa => pa.ep_service.documentId)
        const frequencyCounts = excludeEpSystemCodes.reduce((accumulator, value) => {
          accumulator[value] = ++accumulator[value] || 1
          return accumulator
        }, {})
        // Don't offer EP system codes which already have 2 assessments         
        const validEpSystems = response.data.data.filter(ep => !Object.keys(frequencyCounts).includes(ep.documentId) || frequencyCounts[ep.documentId] < 2)       
        epSystems = validEpSystems.map(ep => { return { value: ep.documentId, label: ep.name } })
        // Make sure 'Other' appears at the end of the list for user friendliness (system names are sorted alphabetically)
        const otherIdx = epSystems.findIndex(ep => ep.label == 'Other')
        epSystems.push(epSystems.splice(otherIdx, 1)[0]) //https://stackoverflow.com/questions/24909371/move-item-in-array-to-last-position
        epSystems.unshift({value: '', label: 'Please select...', disabled: true})
      } else {
        throw new Error(response.message)
      }
      return epSystems
    },
    changedEpSystem(newValue, oldValue) {
      this.isOtherEpSystem = newValue.label == 'Other'
      this.paediatricAssessmentAllowed = this.allPossibleAssessments.filter(pa => pa.patient_type == 'Paediatric' && pa.ep_service.documentId == newValue.value).length == 0
      this.adultAssessmentAllowed = this.allPossibleAssessments.filter(pa => pa.patient_type == 'Adult' && pa.ep_service.documentId == newValue.value).length == 0       
    },
    convertDate(d, useTime) {
      return isoToUkDate(d, useTime)
    }
  },
  async beforeUnmount() {
    console.group('AssessmentSelection beforeUnmount()')
    if (!this.loggingOut && !this.continuingExistingAssessment) {
      // Create a new assessment (continuation / reporting will be handled by 'continueAssessment()' above)
      console.assert(this.dataLoaded, 'AssessmentSelection beforeUnmount() hook - dataReady flag is false')
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