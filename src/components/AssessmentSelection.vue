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
      <ObjectElement name="selection" ref="selectionData">
        <RadiogroupElement 
          name="assessmentOption"
          :label="embolden('I would like to:', true)"      
          :items="[
            { value: 'new', label: 'Start a new assessment', disabled: ! allowNew },
            { value: 'continue', label: 'Continue an existing assessment', disabled: ! allowContinue },
            { value: 'reports', label: 'View reports for completed assessment(s)', disabled: ! allowReports }
          ]"
          :messages="{required: 'Select an option'}"       
          :rules="['required']"
          @change="setOption"
        />
        <GroupElement name="newAssessmentGroup" v-if="selectionData.assessmentOption == 'new'">
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
            :debounce="500" 
            :messages="{required: 'Other eP system name is required'}" 
            :rules="['required', 'fieldIsOther:selection.epService']" />
          <RadiogroupElement name="patientType"
            :label="embolden('For patient type', true)"      
            :items="[
              { value: 'Adult', label: 'Adults', disabled: adultAssessmentExists },
              { value: 'Paediatric', label: 'Paediatrics', disabled: paediatricAssessmentExists }]"
            :messages="{required: 'Select an option'}" 
            :rules="['required']"
          />
          <GroupElement name="sharingConsentQuestions" class="alert alert-warning mt-4" role="alert">
            <CheckboxElement name="shareTrustsOptOut">
              <span v-html="embolden('Good mitigation results from this ePRaSE assessment will be shared with <i>other NHS trusts</i> to support learning on EP system optimisation. If you do not consent to sharing your data, please opt out by checking this box', true)"></span>
            </CheckboxElement>          
            <CheckboxElement name="shareSuppliersOptOut">
              <span v-html="embolden('Good mitigation results may be shared with <i>EP system suppliers</i> to support learning on EP system optimisation. If you do not consent to sharing your data, please opt out by checking this box', true)"></span>
            </CheckboxElement>   
          </GroupElement>            
        </GroupElement>
        
        <GroupElement name="continueAssessmentGroup" v-if="['continue', 'reports'].includes(selectionData.assessmentOption)">
          <GroupElement name="assessmentTable" v-if="updatableAssessments.length != 0">
            <table class="table table-striped caption-top vf-col-12">
              <caption>You can access the following assessments:</caption>
              <thead>
                <tr>
                  <th>&nbsp;</th>
                  <th>ePrescribing system</th>
                  <th>Patient type</th>
                  <th>Assessment state</th>
                  <th>Created on</th>
                  <th>Last update</th>
                  <th>Updater</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="assessment in updatableAssessments">
                  <td :rowspan="updatableAssessments.length">
                    <RadiogroupElement name="assessmentId" 
                      :label="null"
                      :items="updatableDocIds"
                      :messages="{required: 'Select one'}" 
                      :rules="['filled']"
                      :class="'me-2'" />
                  </td>
                  <td>{{ assessment.ep_service.name == 'Other' ? assessment.other_ep_service : assessment.ep_service.name }}</td>
                  <td>{{ assessment.patient_type }}</td>
                  <td>{{ assessment.state }}</td>
                  <td>{{ convertDate(assessment.createdAt, false) }}</td>
                  <td>{{ convertDate(assessment.updatedAt, true) }}</td>
                  <td>{{ assessment.createdBy.username }}</td>
                </tr>
              </tbody>
            </table>
            <ButtonElement name="reset" :columns="3" @click="$emit('jumpToStep', this.$refs.selectionData.data.selection.assessmentId)">
              <i class="bi bi-check2-circle me-2"></i>Continue selected assessment
            </ButtonElement>  
          </GroupElement>
          <StaticElement name="noAssessments" v-if="updatableAssessments.length == 0">
            There are no assessments to choose from
          </StaticElement>
        </GroupElement>    
      </ObjectElement>      
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
    updatableAssessments() {
      return this.listQualifyingAssessments()
    },
    updatableDocIds() {
      return this.listQualifyingAssessments().map(qa => { return { value: qa.documentId, label: '' }})
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
      return this.allPossibleAssessments.filter(assessment => assessment.state != 'Assessment complete').length > 0
    },
    allowReports() {
      // Reports are allowed if there are any completed assessments
      return this.allPossibleAssessments.filter(assessment => assessment.state == 'Assessment complete').length > 0
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
    listQualifyingAssessments() {

      console.group('listQualifyingAssessments()')

      let possibles = this.allPossibleAssessments
      if (this.selectionData.assessmentOption == 'reports') {
        // Extract all completed assessments
        possibles = possibles.filter(a => a.state == 'Assessment complete') 
      } else if (this.selectionData.assessmentOption == 'continue') {
        possibles = possibles.filter(a => a.state != 'Assessment complete') 
      }
      console.debug('Possible assessments', possibles)
      console.groupEnd()

      return possibles
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
    const selectResponse = await this.selectAssessment()        
    if (selectResponse !== true) {
      throw new Error(selectResponse)
    } 
    console.groupEnd()
  }
}
</script>

<style scoped></style>