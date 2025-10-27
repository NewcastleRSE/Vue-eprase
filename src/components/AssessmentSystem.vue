<template>
  <GroupElement name="systemGroup" :class="'mb-4'">
    <StaticElement name="systemGroupLoading" v-if="!dataLoaded">
      <div class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading system data...</span>
        </div>
      </div>
    </StaticElement>
    <GroupElement name="systemGroupLoaded" v-if="dataLoaded">
      <StaticElement name="epSystemHeading">
        <h2><span class="fst-italic">{{ epSystemName }}</span> ePrescribing System information</h2>
        <h3>Please answer the following questions about your ePrescribing System:</h3>
      </StaticElement>
      <ObjectElement ref="systemObject" name="system">              
        <DateElement name="epServiceImplemented"
          :max="new Date()"
          :label="embolden('ePrescribing system implementation date', true)" 
          :extendOptions="{ plugins: [monthSelector] }"
          :messages="{required: 'Implementation date is required'}"
          :rules="['required']" />
        <DateElement name="epServiceUpdated"
          :max="new Date()"
          :label="embolden('Last ePrescribing system update date', true)" 
          :extendOptions="{ plugins: [monthSelector] }"
          :messages="{required: 'Update date is required'}"  
          :rules="['required', 'dateIsSameOrAfter:system.epServiceImplemented,service implementation date']" /> 
        <TextElement name="numMaintainers"
          :label="embolden('How many WTE maintain the drug catalogue and prescribing decision support for this system?', true)"
          :debounce="200" 
          :messages="{required: 'Other eP system name is required', numeric: 'Must be a number between 0 and 20', min: 'Must be >= 0', max: 'Must be < 20' }" 
          :rules="['required', 'numeric', 'min:0.0', 'max:20']" /> 
        <SelectElement name="epUsage"
          :label="embolden('Approximately what percentage of inpatient prescription orders are prescribed through the eP system across your organisation?', true)"
          :native="false"
          :track-by="['label', 'value']"
          :items="[
            { value: '', label: 'Select percentage...', disabled: true },
            { value: '76-100', label: '76-100%' },
            { value: '51-75', label: '51-75%' },
            { value: '26-50', label: '26-50%' },
            { value: '0-25', label: '0-25%' }
          ]"
          :messages="{required: 'Percentage is required'}" 
          :rules="['required']"
        />   
        <TextElement name="otherEpSystem" placeholder="Name(s) of other ePrescribing systems in use in your organisation" 
          :label="embolden('Other ePrescribing systems in use')" 
          :debounce="200" />
        <GroupElement name="labResultsGroup" :class="'mt-2'">
          <ToggleElement name="labResults"
            :label="embolden('Is your hospital laboratory results system fully integrated with your ePrescribing system?')"
            :labels="{ on: 'Yes', off: 'No' }"
          />
          <ToggleElement name="manResults"
            :label="embolden('Are you able to manually enter laboratory results into your patient admin and/ or ePrescribing test system that you are using to do this assessment?')"
            :labels="{ on: 'Yes', off: 'No' }"
            v-if="systemData.labResults === true" />
        </GroupElement> 
        <GroupElement name="diagnosisResultsGroup" :class="'mt-2'">
          <ToggleElement name="medHistory"
            :label="embolden('Are you able to manually enter diagnosis and medical history into your test system?')"
            :labels="{ on: 'Yes', off: 'No' }"
          />
          <ToggleElement name="diagnosisResults"
            :label="embolden('Are you able to enter diagnosis or comorbidities into your test system that you are using to do this assessment?')"
            :labels="{ on: 'Yes', off: 'No' }"
            v-if="systemData.medHistory === true" />
        </GroupElement>
        <GroupElement name="penicillinGroup" :class="'mb-4'">
          <StaticElement name="penicillinWarning">
            <div class="alert alert-warning mt-4" role="alert">
              Nationally there have been a number of patient safety incidents relating to mis-recording of Penicillin
              allergy as Penicillamine allergy in electronic prescribing systems, with the risk of allergy alert
              failure. We are hoping to learn more about contributory factors to this issue with the following three
              questions.
            </div>
          </StaticElement>
          <CheckboxgroupElement name="penicillinDescription"
            :label="embolden('How do you describe Penicillin V in your system?', true)"
            :items="[
              { value: 'penicillin_v', label: 'Penicillin V' },
              { value: 'phenoxymethylpenicillin', label: 'Phenoxymethylpenicillin' },
              { value: 'phenoxymethylpenicillin_tablets', label: 'Phenoxymethylpenicillin 250mg Tablets' },
              { value: 'other', label: 'Other' }
            ]"
            :messages="{filled: 'Please check all that apply'}" 
            :rules="['filled']"        
          />   
          <TextElement name="penicillinDescriptionOther"
            :label="embolden('Your description', true)"
            v-if="systemData.penicillinDescription.includes('other')"
            :messages="{required: 'Additional description is required'}" 
            :rules="['required', 'fieldIsOther:system.penicillinDescription']"
            :debounce="200" />
          <ToggleElement name="penicillinResults"
            :label="embolden('When you enter &quot;Penicill&quot; in your allergy recording function, is Penicillamine visible as an option to select?')"
            :labels="{ on: 'Yes', off: 'No' }"
          />
          <TextElement name="penicillinComment"
            :label="embolden('If there is anything you would like to tell us about penicillin prescribing in your organisation, please record it here')"
            :debounce="200" />
          <StaticElement name="antimicrobialWarning">
            <div class="alert alert-warning mt-4" role="alert">
              We are hoping to learn about any build users may have within their electronic 
              prescribing system in relation to antimicrobial stewardship with the following 
              two questions.
            </div>
          </StaticElement>
          <ToggleElement name="antiMicReviewTime"
            :label="embolden('Does your ePrescribing system have a mechanism in place to automatically identify antimicrobial prescriptions that have reached the review time window e.g. 48-72 hours after initiation?')"
            :labels="{ on: 'Yes', off: 'No' }"
          />
          <TextElement name="antiMicReviewComments"
            :label="embolden('Additional comments')"
            :debounce="200" />
          <ToggleElement name="antiMicInterpretResults"
            :label="embolden('Is your ePrescribing system able to access laboratory produced antimicrobial susceptibility testing results and link through any form of decision support to direct which medicine will effectively treat a patients infection?')"
            :labels="{ on: 'Yes', off: 'No' }"
          />
          <TextElement name="antiMicInterpretComments"
            :label="embolden('Additional comments')"
            :debounce="200" />
        </GroupElement>      
        <CheckboxgroupElement name="highRiskMeds"
          :label="embolden('Is the ePrescribing system used to prescribe the following?', true)"       
          :items="cbgHighRiskMeds"
          :messages="{filled: 'Please tick at least one'}"
          :rules="['filled']" />
        <ButtonElement name="checkAllHrm" size="sm" @click="hrmBulkSelect">
          <i v-if="checkedAllHrm === false" class="bi bi-check-all me-2"></i>{{ checkedAllHrm ? 'Uncheck all' : 'Check all' }}
        </ButtonElement>
        <CheckboxgroupElement name="clinicalAreas"
          :label="embolden('Is the ePrescribing system used in the following areas?', true)"       
          :items="cbgClinicalAreas"
          :messages="{filled: 'Please tick at least one'}"
          :rules="['filled']" />
        <ButtonElement name="checkAllCa" size="sm" @click="caBulkSelect">
          <i v-if="checkedAllCa === false" class="bi bi-check-all me-2"></i>{{ checkedAllCa ? 'Uncheck all' : 'Check all' }}
        </ButtonElement>
        <TextElement name="otherClinicalArea"
          :label="embolden('Other area', true)"
          v-if="systemData.clinicalAreas.includes('Other')"
          :messages="{required: 'Other clinical area needs to be specified'}" 
          :rules="['required', 'fieldIsOther:system.clinicalAreas']"
          :debounce="200" />
        <StaticElement name="nextStep">
          <div class="alert alert-info mt-4" role="alert">
            When you have answered all the questions, click <span class="fw-bold">Continue to patient build</span>
          </div>
        </StaticElement> 
      </ObjectElement>        
      <ButtonElement name="reset" :columns="3" @click="confirmCancelEditModal.show()">
        <i class="bi bi-x-circle-fill me-2"></i>Clear form
      </ButtonElement>
    </GroupElement> 
    <ConfirmCancelEditModal ref="confirmCancelEditModal" :showActionBtn="true" :title="'Confirm form reset'" @modal-actioned="onResetClick()" />   
  </GroupElement>  
</template>

<script>

import { mapState } from 'pinia'
import { rootStore } from '../stores/root'
import { assessmentStore } from '../stores/assessment'
import ConfirmCancelEditModal from "./ConfirmCancelEditModal"
import flatPicker from 'vue-flatpickr-component'
import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect'

export default {
  name: 'AssessmentSystem',      
  computed: {
    ...mapState(rootStore, ['getClinicalAreas', 'getHighRiskMeds']),
    ...mapState(assessmentStore, ['assessmentData', 'dataReady', 'loggingOut', 'resetSystemData', 'saveSystemData', 'updateAssessmentStatus']),   
    confirmCancelEditModal() {
      return this.$refs.confirmCancelEditModal
    },  
    legalCharacterMatcher() {
      return /^[A-Za-z0-9-.,_() ]+$/
    },
    monthSelector() {
      return new monthSelectPlugin({
        shorthand: true,
        dateFormat: 'MMM Y',
        altFormat: 'MMM Y'
      })
    },
    systemForm() {
      return this.$refs.systemObject
    },
    selectionData() {
      return this.assessmentData.selection
    },
    epSystemName() {
      return this.selectionData.epService.label == 'Other' ? this.selectionData.otherEpService : this.selectionData.epService.label
    },
    systemData() {
      return this.assessmentData.system
    },
    dataLoaded() {
      return this.dataReady
    }
  },
  components: {
    flatPicker,
    ConfirmCancelEditModal
  },
  data() {
    return {
      checkedAllHrm: false,
      checkedAllCa: false
    }
  },
  methods: {    
    async cbgClinicalAreas() {
      const response = await this.getClinicalAreas()
      if (response.status < 400) {
        const cas = response.data.data
        // Done here so it comes at the end always (relying on id is not good...)
        cas.push({value: 'Other', label: 'Other (please specify)'})
        return cas
      } else {
        throw new Error(response.message)
      }
    },
    async cbgHighRiskMeds() {
      const response = await this.getHighRiskMeds()
      if (response.status < 400) {
        return response.data.data
      } else {
        throw new Error(response.message)
      }
    },
    async onResetClick() {      
      this.resetSystemData()
      this.systemForm.form$.clean()
      this.systemForm.form$.resetValidators()
    },
    selectUnselect(cbGroup, check) {
      if (check) {
        cbGroup.checkAll()
      } else {
        cbGroup.uncheckAll()
      }
      cbGroup.clean()
      cbGroup.resetValidators()   
    },
    hrmBulkSelect() {
      this.selectUnselect(this.systemForm.children$['highRiskMeds'], !this.checkedAllHrm)
      this.checkedAllHrm = ! this.checkedAllHrm  
    },
    caBulkSelect() {
      this.selectUnselect(this.systemForm.children$['clinicalAreas'], !this.checkedAllCa)
      this.checkedAllCa = ! this.checkedAllCa      
    }
  }, 
  async mounted() {
    console.group('AssessmentSystem mounted()')
    console.groupEnd()
  },
  async beforeUnmount() {    
    console.group('AssessmentSystem beforeUnmount()')
    console.assert(this.dataLoaded, 'AssessmentSystem beforeUnmount() hook - dataReady flag is false') 
    // Note: DO NOT assume system data is complete if we log out in the middle of entering it!
    // Also, it is very difficult to validate a form at this late stage as everything is in the process
    // of being reset - compromise is to assume that if system data is NOT submitted then it is incomplete 
    const sysResponse = await this.saveSystemData(!this.loggingOut)        
    if (sysResponse !== true) {
      throw new Error(sysResponse)
    } 
    console.groupEnd()
  }
}
</script>

<style scoped></style>
