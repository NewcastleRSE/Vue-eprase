<template>
  <GroupElement name="systemGroup" :class="'mb-4'">
    <StaticElement name="epSystemHeading">
      <h2>Assessment for ePrescribing System <span class="fst-italic">{{ epSystemName }}</span></h2>
      <h3>Please fill in the following additional information:</h3>
    </StaticElement>
    <ObjectElement ref="systemObject" name="system">      
      <TextElement name="addEpSystem" placeholder="Name of additional eP system"
        :label="embolden('Do you use an additional ePrescribing service?', true)"
        :debounce="500" />
      <TextElement name="localEpSystemName" placeholder="Local name for the ePrescribing system, if different from the official name" 
        :label="embolden('Local name for ePrescribing service')"
        :debounce="500" />
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
        :debounce="500" 
        :messages="{required: 'Other eP system name is required', numeric: 'Must be a number between 0 and 10', min: 'Must be >= 0', max: 'Must be < 10' }" 
        :rules="['required', 'numeric', 'min:0.0', 'max:10']" /> 
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
        :debounce="500" />
      <GroupElement name="labResultsGroup" :class="'mt-2'">
        <ToggleElement name="labResults"
          :label="embolden('Is your hospital laboratory results system fully integrated with your ePrescribing system?', true)"
          :labels="{ on: 'Yes', off: 'No' }"
        />
        <ToggleElement name="manResults"
          :label="embolden('Are you able to manually enter laboratory results into your patient admin and/ or ePrescribing test system that you are using to do this assessment?', true)"
          :labels="{ on: 'Yes', off: 'No' }"
          v-if="systemData.labResults === true" />
      </GroupElement> 
      <GroupElement name="diagnosisResultsGroup" :class="'mt-2'">
        <ToggleElement name="medHistory"
          :label="embolden('Are you able to manually enter diagnosis and medical history into your test system?', true)"
          :labels="{ on: 'Yes', off: 'No' }"
        />
        <ToggleElement name="diagnosisResults"
          :label="embolden('Are you able to enter diagnosis or comorbidities into your test system that you are using to do this assessment?', true)"
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
            { value: '', label: 'Select description...', disabled: true },
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
          v-if="systemData.penicillinDescription == 'other'"
          :messages="{required: 'Additional description is required'}" 
          :rules="['required', 'fieldIsOther:system.penicillinDescription']"
          :debounce="500" />
        <ToggleElement name="penicillinResults"
          :label="embolden('Thinking about when you enter Penicill (exactly as stated) in your allergy recording function, is Penicillamine visible as an option to select?')"
          :labels="{ on: 'Yes', off: 'No' }"
        />
        <TextElement name="penicillinComment"
          :label="embolden('If there is anything you would like to tell us about penicillin prescribing in your organisation, please record it here')"
          :debounce="500" />
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
        :debounce="500" />
      <StaticElement name="nextStep">
        <div class="alert alert-info mt-4" role="alert">
          When you have answered all the questions, click <span class="fw-bold">Continue to patient build</span>
        </div>
      </StaticElement> 
    </ObjectElement>        
    <ButtonElement name="reset" :columns="3" @click="onResetClick">
      <i class="bi bi-x-circle-fill me-2"></i>Clear form
    </ButtonElement>
  </GroupElement>
</template>

<script>

import { mapState } from 'pinia'
import { rootStore } from '../stores/root'
import { assessmentStore } from '../stores/assessment'
import flatPicker from 'vue-flatpickr-component'
import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect'

export default {
  name: 'AssessmentSystem',    
  props: {
    isActive: {
      type: Boolean,
      value: false,
      required: true
    },
    stepDir: {
      type: Number,
      value: 1,
      required: true
    }
  },
  async isActive(newVal, oldVal) { 

    console.group('AssessmentSystem isActive() watcher')      
    console.debug('New value', newVal, 'old value', oldVal)

    if (newVal === false && this.stepDir == 1) {
      // User has moved away forwards in the dialogs => save the info
      const sysResponse = await this.saveSystemData()        
      if (sysResponse !== true) {
        this.$emit('save-data-fail', selectResponse)
      }
    }
    console.groupEnd()  
  },
  computed: {
    ...mapState(rootStore, ['getClinicalAreas', 'getHighRiskMeds']),
    ...mapState(assessmentStore, ['assessmentData', 'resetSystemData', 'saveSystemData']),     
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
    epSystemName() {
      return this.assessmentData.epService.label == 'Other' ? this.assessmentData.otherEpService : this.assessmentData.epService.label
    },
    systemData() {
      return this.assessmentData.system
    }
  },
  components: {
    flatPicker
  },
  data() {
    return {
      startTime: '',
      checkedAllHrm: false,
      checkedAllCa: false
    }
  },
  emits: ['get-data-fail'],
  methods: {    
    async cbgClinicalAreas() {
      const response = await this.getClinicalAreas()
      if (response.status < 400) {
        const cas = response.data.data
        // Done here so it comes at the end always (relying on id is not good...)
        cas.push({value: 'Other', label: 'Other (please specify)'})
        return cas
      } else {
        this.$emit('get-data-fail', response.message)
      }
    },
    async cbgHighRiskMeds() {
      const response = await this.getHighRiskMeds()
      if (response.status < 400) {
        return response.data.data
      } else {
        this.$emit('get-data-fail', response.message)
      }
    },
    async onResetClick() {      
      this.resetSystemData()
      this.$refs.systemObject.form$.clean()
      this.$refs.systemObject.form$.resetValidators()
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
      this.selectUnselect(this.$refs.systemObject.children$['highRiskMeds'], !this.checkedAllHrm)
      this.checkedAllHrm = ! this.checkedAllHrm  
    },
    caBulkSelect() {
      this.selectUnselect(this.$refs.systemObject.children$['clinicalAreas'], !this.checkedAllCa)
      this.checkedAllCa = ! this.checkedAllCa      
    }
  }, 
  mounted() {
  }
}
</script>

<style scoped></style>
