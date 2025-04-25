<template> 
  <GroupElement ref="system" name="systemForm" :class="'mb-4'">
    <StaticElement name="systemHeading">
      <h2>EP System Information</h2>
      <h3>Please answer the following questions:</h3>
    </StaticElement>
    <SelectElement name="epService" :label="embolden('Name of ePrescribing system', true)"
      :native="false" 
      :search="true"
      :track-by="['label', 'value']"
      :items="getEpSystemNames"
      :messages="{required: 'Name of ePrescribing system is required'}" 
      :rules="['required']"
    />    
    <TextElement name="otherEpService" :label="embolden('Do you use an additional ePrescribing service?', true)" placeholder="Name of other eP system" 
      :debounce="500" 
      :messages="{required: 'Other eP system name is required'}" 
      :rules="[{ 'required': ['epService', '==', 'Other'] }]" />      
    <TextElement name="localEpServiceName" :label="embolden('Local name for ePrescribing service')" placeholder="Local name for the ePrescribing system, if different from the official name" 
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
      :rules="['required', 'dateIsSameOrAfter:epServiceImplemented,service implementation date']" /> 
    <TextElement name="numMaintainers" :label="embolden('How many WTE maintain the drug catalogue and prescribing decision support for this system?', true)"
      :debounce="500" 
      :messages="{required: 'Other eP system name is required', numeric: 'Must be a number between 0.1 and 10', min: 'Must be > 0.1', max: 'Must be < 10' }" 
      :rules="['required', 'numeric', 'min:0.1', 'max:10']" /> 
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
    <TextElement name="otherEpSystem" :label="embolden('Other ePrescribing systems in use')" placeholder="Name(s) of other ePrescribing systems in use in your organisation" 
      :debounce="500" />
    <GroupElement name="labResultsGroup" :class="'mt-2'">
      <ToggleElement name="labResults" :label="embolden('Is your hospital laboratory results system fully integrated with your ePrescribing system?', true)"
        :labels="{ on: 'Yes', off: 'No' }"
        @change="system.labResults = ! system.labResults" />
      <ToggleElement name="manResults" :label="embolden('Are you able to manually enter laboratory results into your patient admin and/ or ePrescribing test system that you are using to do this assessment?', true)"
        :labels="{ on: 'Yes', off: 'No' }"
        v-if="system.labResults === true" />
    </GroupElement> 
    <GroupElement name="diagnosisResultsGroup" :class="'mt-2'">
      <ToggleElement name="medHistory" :label="embolden('Are you able to manually enter diagnosis and medical history into your test system?', true)"
        :labels="{ on: 'Yes', off: 'No' }"
        @change="system.medHistory = ! system.medHistory" />
      <ToggleElement name="diagnosisResults" :label="embolden('Are you able to enter diagnosis or comorbidities into your test system that you are using to do this assessment?', true)"
        :labels="{ on: 'Yes', off: 'No' }"
        v-if="system.medHistory === true" />
    </GroupElement>
    <StaticElement name="penicillinWarning">
      <div class="alert alert-warning mt-4" role="alert">
        Nationally there have been a number of patient safety incidents relating to mis-recording of Penicillin
        allergy as Penicillamine allergy in electronic prescribing systems, with the risk of allergy alert
        failure. We are hoping to learn more about contributory factors to this issue with the following three
        questions.
      </div>
    </StaticElement>
    <SelectElement name="penicillinDescription" :label="embolden('How do you describe Penicillin V in your system?', true)"
      :native="false"
      :track-by="['label', 'value']"
      :items="[
        { value: '', label: 'Select description...', disabled: true },
        { value: 'penicillin_v', label: 'Penicillin V' },
        { value: 'phenoxymethylpenicillin', label: 'Phenoxymethylpenicillin' },
        { value: 'phenoxymethylpenicillin_tablets', label: 'Phenoxymethylpenicillin 250mg Tablets' },
        { value: 'other', label: 'Other' }
      ]"
      :messages="{required: 'Penicillin description is required'}" 
      :rules="['required']"
      @change="(newVal) => { system.penicillinDescription = newVal }"
    />   
    <TextElement name="penicillinDescriptionOther" :label="embolden('Your description', true)"
      v-if="system.penicillinDescription == 'other'"
      :rules="[{ 'required': ['penicillinDescription', '==', 'other'] }]"
      :debounce="500" />
    <ToggleElement name="penicillinResults" 
      :label="embolden('Thinking about when you enter Penicill (exactly as stated) in your allergy recording function, is Penicillamine visible as an option to select?')"
      :labels="{ on: 'Yes', off: 'No' }"
    />
    <TextElement name="penicillinComment" :label="embolden('If there is anything you would like to tell us about penicillin prescribing in your organisation, please record it here')"
      :debounce="500" />
    <CheckboxgroupElement name="highRiskMeds" :label="embolden('Is the ePrescribing system used to prescribe the following?', true)"       
      :items="[
        { label: 'All medicines (e.g. Licensed / Unlicensed / Formulary)', value: 'All medicines' },
        { label: 'IV Infusions (e.g. Continuous / Intermittent / Complex)', value: 'IV infusions' },
        { label: 'Warfarin', value: 'Warfarin' },
        { label: 'Heparin', value: 'Heparin' },
        { label: 'Insulin', value: 'Insulin' },
        { label: 'Insulin Sliding Scales', value: 'Insulin Sliding Scales' },
        { label: 'Chemotherapy oral', value: 'Chemotherapy oral' },
        { label: 'Chemotherapy IV', value: 'Chemotherapy IV'},
        { label: 'Scheduling system for Immunisations / Vaccinations', value: 'Scheduling System' },
        { label: 'Antimicrobials', value: 'Antimicrobials' },
        { label: 'Antipsychotics / Antidepressants (e.g. Depot Injections)', value: 'Antipsychotics' },
        { label: 'Controlled Drugs', value: 'Controlled Drugs' },
        { label: 'Patient Controlled Analgesia', value: 'PCA' },
        { label: 'Multi-Ingredient Infusions (e.g Morphine, Cyclizine, Water for Injection)', value: 'MII' },
        { label: 'Pharmacogenomics', value: 'Pharmacogenomics' },
        { label: 'Fluids', value: 'Fluids' },
        { label: 'Blood Products / Components (e.g. red cells, platelets, fresh frozen plasma and cryoprecipitate, or plasma derivatives)', value: 'Blood Products' },
        { label: 'Medical Gases (e.g. Oxygen, Medical Air, Nitrous Oxide)', value: 'Medical Gases' },
        { label: 'Parenteral Nutrition', value: 'Parenteral Nutrition' },
        { label: 'Other Nutrition', value: 'Other Nutrition' },
        { label: 'Linked Therapeutic Drug Monitoring (e.g. Gentamicin / Vancomycin)', value: 'LTDM' },
        { label: 'Ability to prescribe dose titration', value: 'Dose Titration' }
      ]"
      :rules="['filled']" />
    <CheckboxgroupElement name="clinicalAreas" :label="embolden('Is the ePrescribing system used in the following areas?', true)"       
      :items="[
        { label: 'Accident and Emergency EPMA Accessible i.e. open to view medication records (A&E) ', value: 'A&E EPMA Acc' },
        { label: 'Accident and Emergency EPMA being used for prescribing (A&E) ', value: 'A&E EPMA Prescribing' },
        { label: 'Inpatient (e.g. Ambulatory unit, Care of the Elderly, Orthopaedics)', value: 'Inpatient' },
        { label: 'Intensive Care Unit (ICU)', value: 'ICU' },
        { label: 'Theatre', value: 'Theatre' },
        { label: 'Day Cases ( e.g. procedures)', value: 'Day Cases' },
        { label: 'Outpatients', value: 'Outpatients' },
        { label: 'Special Clinics (e.g. Dialysis / Renal)', value: 'Special Clinics' },
        { label: 'Sexual and Reproductive Health (SRH) services or Genitourinary Medicine Clinics (GUM)', value: 'SRH' },
        { label: 'Maternity', value: 'Maternity' },
        { label: 'Neonatal', value: 'Neonatal' },
        { label: 'Special Care Baby Unit (SCBU) / Neonatal Intensive Care (NICU)', value: 'SCBU' },
        { label: 'Paediatrics', value: 'Paediatrics' },
        { label: 'Paediatric Intensive Care (PICU)', value: 'PICU' },
        { label: 'Cancer Services', value: 'Cancer Services' },
        { label: 'Community', value: 'Community' },
        { label: 'Intermediate Care', value: 'Intermediate Care' },
        { label: 'Virtual Wards', value: 'Virtual Wards' },
        { label: 'Homecare medicines service', value: 'HMS' },
        { label: 'Clinical Trials ', value: 'Clinical Trials' },
        { label: 'Other (please specify)', value: 'Other' }
      ]"
      @change="(newVal) => { system.clinicalAreas = newVal }"
      :rules="['filled']" />
    <TextElement name="otherClinicalArea" :label="embolden('Other area', true)"
      v-if="system.clinicalAreas.includes('Other')"
      :rules="[{ 'required': ['Other', 'in', 'clinicalAreas'] }]"
      :debounce="500" />
    <StaticElement name="nextStep">
      <div class="alert alert-info mt-4" role="alert">
        When you have answered all the questions, click <span class="fw-bold">Continue to patient build</span>
      </div>
    </StaticElement>
    <ButtonElement name="reset" :columns="3" @click="onResetClick">
      <i class="bi bi-x-circle-fill me-2"></i>Clear form
    </ButtonElement>
  </GroupElement>
</template>

<script>

import { mapState } from 'pinia'
import { rootStore } from '../stores/root'
import flatPicker from 'vue-flatpickr-component'
import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect'
import { StaticElement, ToggleElement } from '@vueform/vueform/dist/bootstrap'
import { CheckboxgroupElement } from '@vueform/vueform/dist/tailwind-material'

export default {
  name: "AssessmentSystem",    
  computed: {
    ...mapState(rootStore, ['getEpSystems']),     
    legalCharacterMatcher() {
      return /^[A-Za-z0-9-.,_() ]+$/
    },
    monthSelector() {
      return new monthSelectPlugin({
        shorthand: true,
        dateFormat: 'MMM Y',
        altFormat: 'MMM Y'
      })
    }   
  },
  components: {
    flatPicker
  },
  data() {
    return {
      serverError: false,
      system: {
        epService: '',
        otherEpService: '',
        localEpServiceName: '',
        epServiceImplemented: null,
        epServiceUpdated: null,
        numMaintainers: 1.0,
        epUsage: '',
        otherEpSystem: '',
        labResults: false,
        manResults: false,
        medHistory: false,
        diagnosisResults: false,
        penicillinDescription: '',
        penicillinDescriptionOther: '',
        penicillinResults: false,
        highRiskMeds: [],
        clinicalAreas: [],
        otherClinicalArea: ''
      },      
      startTime: ''
    }
  },
  methods: {
    async getEpSystemNames() {
      let epSystems = []
      const response = await this.getEpSystems()
      if (response.status < 400) {
        epSystems = response.data.data.map(ep => { return { value: ep.name, label: ep.name } })
        epSystems.unshift({value: '', label: 'Please select...', disabled: true})        
      } else {
        this.serverError = [response.message]
      }
      return epSystems
    },
    async onResetClick() {      
      await this.$refs.system.form$.load({ 
        epService: '',
        otherEpService: '',
        localEpServiceName: '',
        epServiceImplemented: null,
        epServiceUpdated: null,
        numMaintainers: 1.0,
        epUsage: '',
        otherEpSystem: '',
        labResults: false,
        manResults: false,
        medHistory: false,
        diagnosisResults: false,
        penicillinDescription: '',
        penicillinDescriptionOther: '',
        penicillinResults: false,
        highRiskMeds: [],
        clinicalAreas: [],
        otherClinicalArea: ''
      })
      this.$refs.system.form$.clean()
      this.$refs.system.form$.resetValidators()
    },
    // onNextClick() {
    //   this.$refs.assessmentSystemForm.validate().then(async (valid) => {
    //     if (valid) {

    //       const time_taken = dayjs().diff(this.startTime, 'seconds')

    //       const ep_service = this.results.ep_service
    //       const local_ep_system_name = this.results.local_ep_system_name
    //       const ep_service_implemented = `${prependZero(this.results.ep_service_implemented.month + 1)}-${this.results.ep_service_implemented.year}`
    //       const ep_service_updated = `${prependZero(this.results.ep_service_updated.month + 1)}-${this.results.ep_service_updated.year}`
    //       const ep_version = '0'  // Note: no longer used as of July 2024
    //       const num_maintainers = this.results.num_maintainers
    //       const other_ep_system = this.results.other_ep_system
    //       const ep_usage = this.results.ep_usage
    //       const add_ep_system = this.results.add_ep_system
    //       const patient_type = 'Adults'
    //       const lab_results = this.results.lab_results
    //       const man_results = this.results.man_results
    //       const diagnosis_results = this.results.diagnosis_results
    //       const penicillin_description = this.results.penicillin_description
    //       const penicillin_description_other = this.results.penicillin_description_other
    //       const penicillin_results = this.results.penicillin_results
    //       const penicillin_comment = this.results.penicillin_comment
    //       const med_history = this.results.med_history
    //       const high_risk_meds = this.results.high_risk_meds.toString()
    //       const clinical_areas = this.results.clinical_areas
    //       if (this.results.other_clinical_area != '') {
    //         clinical_areas.push(this.results.other_clinical_area)
    //       }
    //       const final_clinical_areas = clinical_areas.toString()
    //       const response = await rootStore().saveSystemData(
    //         ep_service, ep_service_implemented, ep_service_updated, other_ep_system, local_ep_system_name, ep_version, ep_usage, num_maintainers, add_ep_system,
    //         patient_type, lab_results, man_results, diagnosis_results, penicillin_description, penicillin_description_other, penicillin_results, penicillin_comment,
    //         med_history, high_risk_meds, final_clinical_areas, time_taken
    //       )
    //       if (response.status < 400) {
    //         rootStore().audit('Save system data', '/assessmentSystem')
    //         this.$router.push('/assessmentpatients/' + patient_type)
    //       } else {
    //         this.errorAlertModal.show(response.message)
    //       }
    //     }
    //   })
    // }
  }, 
  mounted() {
    console.log('Form element is', this.$refs.system.form$.data)
  }
}
</script>

<style scoped></style>
