<template>

  <main class="leftalign">

    <TabHeader :showIndex="0" />
    <div class="content p-4">

      <LoginInfo />

      <h3>EP System Information</h3>
      <h4>Please answer the following questions about your ePrescribing system:</h4>

      <div class="p-4">
        <div>
          <Form ref="assessmentSystemForm" v-slot="{ meta: formMeta }" :validation-schema="validationSchema">

            <div class="mb-4 row">
              <label class="col-sm-8 col-form-label" for="ep-system-selector">Which electronic prescribing (eP) system
                are you using? <span class="required-field">*</span></label>
              <div class="col-sm-4">
                <Field v-slot="{ field, meta }" v-model="results.ep_service" name="ep-service" id="ep-system-selector">
                  <select v-bind="field" class="form-select"
                    :class="meta.dirty ? (meta.valid ? 'is-valid' : 'is-invalid') : ''">                    
                    <option value="" disabled>Select system...</option>
                    <option v-for="epSystem in epSystemOptions" :value="epSystem.value">{{ epSystem.text }}</option>                    
                  </select>
                </Field>
              </div>
              <ErrorMessage name="ep-service" as="div" class="mt-2 text-danger text-center" v-slot="{ message }">
                {{ message }}
              </ErrorMessage>
            </div>

            <div v-if="results.ep_service === 'Other'" class="mb-4 row">
              <label class="col-sm-8 col-form-label" for="other-ep-system">Other eP service? <span
                  class="required-field">*</span></label>
              <div class="col-sm-4">
                <Field v-slot="{ field, meta }" v-model="results.other_ep_system" name="other" id="other-ep-system">
                  <input v-bind="field" type="text" class="form-control"
                    :class="meta.dirty ? (meta.valid ? 'is-valid' : 'is-invalid') : ''" placeholder="Enter system...">
                </Field>
              </div>
              <ErrorMessage name="other" as="div" class="mt-2 text-danger text-center" v-slot="{ message }">
                {{ message }}
              </ErrorMessage>
            </div>

            <div class="mb-4 row">
              <label class="col-sm-8 col-form-label" for="local-ep-system-name">Local name for eP system?</label>
              <div class="col-sm-4">
                <Field v-slot="{ field, meta }" v-model="results.local_ep_system_name" name="local-ep-system-name" id="local-ep-system-name">
                  <input v-bind="field" type="text" class="form-control" 
                    data-bs-toggle="tooltip" data-bs-placement="top" title="Local name for the e-Prescribing system, if different from the official name">
                </Field>
              </div>              
            </div>

            <div class="mb-4 row">
              <label class="col-sm-8 col-form-label" for="ep-service-implemented">When (month/year) was current eP system
                implemented? <span class="required-field">*</span></label>
              <div class="col-sm-4">
                <Field v-slot="{ field, meta }" name="ep-service-implemented" id="ep-service-implemented">
                  <VueDatePicker ref="epServiceImplemented" v-bind="field" v-model="results.ep_service_implemented" month-picker auto-apply placeholder="Select month/year"
                  :state="meta.dirty ? meta.valid : null" :max-date="new Date()" />
                </Field>
              </div>
              <ErrorMessage name="ep-service-implemented" as="div" class="mt-2 text-danger text-center"
                v-slot="{ message }">
                {{ message }}
              </ErrorMessage>
            </div>

            <div class="mb-4 row">
              <label class="col-sm-8 col-form-label" for="ep-service-updated">When (month/year) was current eP system last
                updated? <span class="required-field">*</span></label>
              <div class="col-sm-4">
                <Field v-slot="{ field, meta }" name="ep-service-updated" id="ep-service-updated"> 
                  <VueDatePicker ref="epServiceUpdated" v-bind="field" v-model="results.ep_service_updated" month-picker auto-apply placeholder="Select month/year"
                    :state="meta.dirty ? meta.valid : null" :max-date="new Date()" />
                </Field>
              </div>
              <ErrorMessage name="ep-service-updated" as="div" class="mt-2 text-danger text-center"
                v-slot="{ message }">
                {{ message }}
              </ErrorMessage>
            </div>

            <div class="mb-4 row">
              <label class="col-sm-8 col-form-label" for="num-maintainers">How many WTE maintain the drug catalogue and prescribing decision support for this system? <span
                  class="required-field">*</span></label>
              <div class="col-sm-4">
                <Field v-slot="{ field, meta }" v-model="results.num_maintainers" name="num-maintainers" id="num-maintainers">
                  <input v-bind="field" type="text" class="form-control" data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title="How many people (FTEs) across your trust do you have who maintain your drug catalogue and associated decision support for the electronic prescribing system you are using for this assessment?"
                    :class="meta.dirty ? (meta.valid ? 'is-valid' : 'is-invalid') : ''">
                </Field>
              </div>
              <ErrorMessage name="num-maintainers" as="div" class="mt-2 text-danger text-center" v-slot="{ message }">
                {{ message }}
              </ErrorMessage>
            </div>

            <div class="mb-4 row">
              <label class="col-sm-8 col-form-label" for="usage-selector">Approximately what percentage of inpatient
                prescription orders are prescribed through the eP system across your organisation? <span
                  class="required-field">*</span></label>
              <div class="col-sm-4">
                <Field v-slot="{ field, meta }" v-model="results.ep_usage" name="ep-usage" id="usage-selector">
                  <select v-bind="field" class="form-select"
                    :class="meta.dirty ? (meta.valid ? 'is-valid' : 'is-invalid') : ''">
                    <option value="" disabled>Select Percentage...</option>
                    <option value="76-100">76-100%</option>
                    <option value="51-75">51-75%</option>
                    <option value="26-50">26-50%</option>
                    <option value="0-25">0-25%</option>
                  </select>
                </Field>
              </div>
              <ErrorMessage name="ep-usage" as="div" class="mt-2 text-danger text-center" v-slot="{ message }">
                {{ message }}
              </ErrorMessage>
            </div>

            <div class="mb-4 row">
              <label class="col-sm-8 col-form-label" for="add-ep-system">Are there other e-prescribing systems in use in
                the organisation? if so, please provide their names.</label>
              <div class="col-sm-4">
                <Field v-slot="{ field, meta }" v-model="results.add_ep_system" name="add-ep-system" id="add-ep-system">
                  <input v-bind="field" type="text" class="form-control" placeholder="Other...">
                </Field>
              </div>
              <ErrorMessage name="add-ep-system" as="div" class="mt-2 text-danger text-center" v-slot="{ message }">
                {{ message }}
              </ErrorMessage>
            </div>

            <div class="mb-4 row">
              <p class="col-sm-8 fw-bold">Is your hospital laboratory results system fully integrated with your
                e-prescribing system? <span class="required-field">*</span></p>
              <div class="col-sm-4">
                <div class="form-check form-check-inline">
                  <Field v-slot="{ field, meta }" v-model="results.lab_results" type="radio" name="lab-results"
                    id="lab-results-yes" value="true">
                    <input v-bind="field" type="radio" name="lab-results" value="true" class="form-check-input">
                  </Field>
                  <label class="form-check-label" for="lab-results-yes">Yes</label>
                </div>
                <div class="form-check form-check-inline">
                  <Field v-slot="{ field, meta }" v-model="results.lab_results" type="radio" name="lab-results"
                    id="lab-results-no" value="false">
                    <input v-bind="field" type="radio" name="lab-results" value="false" class="form-check-input">
                  </Field>
                  <label class="form-check-label" for="lab-results-no">No</label>
                </div>
              </div>
            </div>

            <div class="mb-4 row" v-if="results.lab_results === 'true'">
              <p class="col-sm-8"><i class="bi bi-caret-right-fill"></i> Are you able to manually enter laboratory
                results into your patient admin and/ or e-prescribing test system that you are using to do this
                assessments? <span class="required-field">*</span></p>
              <div class="col-sm-4">
                <div class="form-check form-check-inline">
                  <Field v-slot="{ field, meta }" v-model="results.man_results" type="radio" name="man-results"
                    id="man-results-yes" value="true">
                    <input v-bind="field" type="radio" name="man-results" value="true" class="form-check-input"
                      autocomplete="off">
                  </Field>
                  <label class="form-check-label" for="man-results-yes">Yes</label>
                </div>
                <div class="form-check form-check-inline">
                  <Field v-slot="{ field, meta }" v-model="results.man_results" type="radio" name="man-results"
                    id="man-results-no" value="false">
                    <input v-bind="field" type="radio" name="man-results" value="false" class="form-check-input"
                      autocomplete="off">
                  </Field>
                  <label class="form-check-label" for="man-results-no">No</label>
                </div>
              </div>
            </div>

            <div class="mb-4 row">
              <p class="col-sm-8 fw-bold">Are you able to manually enter diagnosis and medical history into your test
                system? <span class="required-field">*</span></p>
              <div class="col-sm-4">
                <div class="form-check form-check-inline">
                  <Field v-slot="{ field, meta }" v-model="results.med_history" type="radio" name="med-history"
                    id="med-history-yes" value="true">
                    <input v-bind="field" type="radio" name="med-history" value="true" class="form-check-input"
                      autocomplete="off">
                  </Field>
                  <label class="form-check-label" for="med-history-yes">Yes</label>
                </div>
                <div class="form-check form-check-inline">
                  <Field v-slot="{ field, meta }" v-model="results.med_history" type="radio" name="med-history"
                    id="med-history-no" value="false">
                    <input v-bind="field" type="radio" name="med-history" value="false" class="form-check-input"
                      autocomplete="off">
                  </Field>
                  <label class="form-check-label" for="med-history-no">No</label>
                </div>
              </div>
            </div>

            <div v-if="results.med_history === 'true'" class="mb-4 row">
              <p class="col-sm-8"><i class="bi bi-caret-right-fill"></i>Are you able to enter diagnosis or comorbidities
                into your test system that you are using to do this assessment? <span class="required-field">*</span>
              </p>
              <div class="col-sm-4">
                <div class="form-check form-check-inline">
                  <Field v-slot="{ field, meta }" v-model="results.diagnosis_results" name="diagnosis-results"
                    id="diagnosis-results-yes" value="true">
                    <input v-bind="field" type="radio" name="diagnosis-results" value="true" class="form-check-input"
                      autocomplete="off">
                  </Field>
                  <label class="form-check-label" for="diagnosis-results-yes">Yes</label>
                </div>
                <div class="form-check form-check-inline">
                  <Field v-slot="{ field, meta }" v-model="results.diagnosis_results" name="diagnosis-results"
                    id="diagnosis-results-no" value="false">
                    <input v-bind="field" type="radio" name="diagnosis-results" value="false" class="form-check-input"
                      autocomplete="off">
                  </Field>
                  <label class="form-check-label" for="diagnosis-results-no">No</label>
                </div>
              </div>
            </div>

            <div class="mb-4 row">
              <p class="fw-bold">Is the e-prescribing system used to prescribe the following?</p>
              <div v-for="(option, index) in results.options" class="form-check ms-2">
                <Field v-slot="{ field }" v-model="results.high_risk_meds" type="checkbox"
                  :id="'id_high_risk_meds_' + index" name="high_risk_meds" :value="option.value">
                  <input v-bind="field" type="checkbox" class="form-check-input" name="high_risk_meds"
                    :value="option.value">
                </Field>
                <label class="form-check-label" :for="'id_high_risk_meds_' + index">{{ option.text }}</label>
              </div>
            </div>

            <div class="mb-4 row">
              <p class="fw-bold">Is the e-prescribing system used in the following areas?</p>
              <div v-for="(option, index) in results.area_options" class="form-check ms-2">
                <Field v-slot="{ field }" v-model="results.clinical_areas" type="checkbox"
                  :id="'id_clinical_areas_' + index" name="clinical_areas" :value="option.value">
                  <input v-bind="field" type="checkbox" class="form-check-input" name="clinical_areas"
                    :value="option.value">
                </Field>
                <label class="form-check-label" :for="'id_clinical_areas_' + index">{{ option.text }}</label>
              </div>
            </div>

            <div v-if="results.clinical_areas.includes('Other')" class="mb-4 row">
              <label class="col-sm-8 col-form-label" for="other-clinical-area">Other area<span
                  class="required-field">*</span></label>
              <div class="col-sm-4">
                <Field v-slot="{ field, meta }" v-model="results.other_clinical_area" name="other-clinical-area"
                  id="other-clinical-area">
                  <input v-bind="field" type="text" class="form-control"
                    :class="meta.dirty ? (meta.valid ? 'is-valid' : 'is-invalid') : ''" placeholder="Specify...">
                </Field>
              </div>
              <ErrorMessage name="other-clinical-area" as="div" class="mt-2 text-danger text-center"
                v-slot="{ message }">
                {{ message }}
              </ErrorMessage>
            </div>

            <div class="row">
              <p class="text-primary">* required fields</p>
              <p>When you have answered all of the questions, click <span class="fw-bold">Next</span></p>
            </div>

            <div>
              <button type="reset" class="btn btn-primary me-3" @click="onResetClick">
                <i class="bi bi-x pe-1"></i>Clear</button>
              <button type="button" class="next-btn btn btn-primary" id="next-button" :disabled="!formMeta.valid"
                @click="onNextClick()">
                <i class="bi bi-caret-right-fill pe-1"></i>Next</button>
            </div>

          </Form>
        </div>
      </div>

    </div>

    <ErrorAlertModal ref="errorAlertModal" />
    <AppLogo cls="bottomright" />

  </main>

</template>

<script>

import dayjs from 'dayjs'
import { prependZero } from '../helpers/utils'
import { mapStores, mapState } from 'pinia'
import { appSettingsStore } from '../stores/appSettings'
import { rootStore } from '../stores/root'
import TabHeader from './TabHeader'
import LoginInfo from './LoginInfo'
import AppLogo from './AppLogo'
import ErrorAlertModal from './ErrorAlertModal'
import { Form, Field, ErrorMessage } from 'vee-validate'
import VueDatePicker from '@vuepic/vue-datepicker'

export default {
  name: "AssessmentSystem",
  components: {
    TabHeader,
    LoginInfo,
    AppLogo,
    ErrorAlertModal,
    Form,
    Field,
    ErrorMessage,
    VueDatePicker
  },
  computed: {
    ...mapStores(rootStore),
    ...mapState(appSettingsStore, ['epSystemOptions']),
    errorAlertModal() {
      return this.$refs.errorAlertModal
    },
    epSystemOptions() {
      return appSettingsStore().epSystemOptions
    }
  },
  data() {
    return {
      validationSchema: {
        'ep-service': 'required',
        'other': (value) => {
          return (this.results.ep_service == 'Other') ? (value != '' ? true : 'Please give details') : true
        },
        'ep-service-implemented': 'required|validMonthYearDateBefore:@ep-service-updated',
        'ep-service-updated': 'required',        
        'num-maintainers': (value) => {
          const re = new RegExp('^\\d*(\\.\\d)?$')
          return re.test(value) ? true : 'Should be a number with at most one decimal place'        
        },
        'ep-usage': 'required',
        'lab-results': (value) => {
          return ['true', 'false'].includes(value) ? true : 'Please select one'
        },
        'man-results': (value) => {
          return (this.results.lab_results ? (['true', 'false'].includes(value) ? true : 'Please select one') : true)
        },
        'med-history': (value) => {
          return ['true', 'false'].includes(value) ? true : 'Please select one'
        },
        'diagnosis-results': (value) => {
          return (this.results.med_history ? (['true', 'false'].includes(value) ? true : 'Please select one') : true)
        },
        'other-clinical-area': (value) => {
          return this.results.clinical_areas.includes('Other') ? (value != '' ? true : 'Please give details') : true
        }
      },
      results: {
        ep_service: '',
        ep_service_implemented: null, 
        ep_service_updated: null,
        local_ep_system_name: '',
        ep_version: '',
        num_maintainers: '',
        ep_usage: '',
        other_ep_system: '',
        add_ep_system: '',
        patient_type: '',
        lab_results: '',
        med_history: '',
        man_results: '',
        diagnosis_results: '',
        high_risk_meds: [],
        options: [
          // { text: 'Warfarin', value: 'Warfarin' },
          // { text: 'Insulin', value: 'Insulin' },
          // { text: 'Fluids', value: 'Fluids' },
          // { text: 'Oxygen', value: 'Oxygen' },
          // { text: 'Patient controlled analgesia (PCA)', value: 'PCA' },
          // { text: 'Continuous infusions', value: 'Continuous infusions' },
          // { text: 'Parenteral nutrition', value: 'Parenteral nutrition' },
          // { text: 'Enteral nutrition', value: 'Enteral nutrition' },
          // { text: 'Nutritional supplements (not classed as a medicine)', value: 'Nutritional supplements' },
          // { text: 'Medicines undefined with the catalogue (free text function)', value: 'Undefined medicines' }
          // Updates 2024-07-01
          { text: 'All medicines (e.g. Licensed / Unlicensed / Formulary)', value: 'All medicines' },
          { text: 'IV Infusions (e.g. Continuous / Intermittent / Complex)', value: 'IV infusions' },
          { text: 'Warfarin', value: 'Warfarin' },
          { text: 'Heparin', value: 'Heparin' },
          { text: 'Insulin', value: 'Insulin' },
          { text: 'Insulin Sliding Scales', value: 'Insulin Sliding Scales' },
          { text: 'Chemotherapy', value: 'Chemotherapy' },
          { text: 'Scheduling system for Immunisations / Vaccinations', value: 'Scheduling System' },
          { text: 'Antimicrobials', value: 'Antimicrobials' },
          { text: 'Antipsychotics / Antidepressants (e.g. Depot Injections)', value: 'Antipsychotics' },
          { text: 'Controlled Drugs', value: 'Controlled Drugs' },
          { text: 'Patient Controlled Analgesia', value: 'PCA' },
          { text: 'Multi-Ingredient Infusions (e.g Morphine, Cyclizine, Water for Injection)', value: 'MII' },
          { text: 'Pharmacogenomics', value: 'Pharmacogenomics' },
          { text: 'Fluids', value: 'Fluids' },
          { text: 'Blood Products / Components (e.g. red cells, platelets, fresh frozen plasma and cryoprecipitate, or plasma derivatives)', value: 'Blood Products' },
          { text: 'Medical Gases (e.g. Oxygen, Medical Air, Nitrous Oxide)', value: 'Medical Gases' },
          { text: 'Parenteral Nutrition', value: 'Parenteral Nutrition' },
          { text: 'Other Nutrition', value: 'Other Nutrition' },
          { text: 'Linked Therapeutic Drug Monitoring (e.g. Gentamicin / Vancomycin)', value: 'LTDM' },
          { text: 'Ability to prescribe dose titration', value: 'Dose Titration' }
        ],
        clinical_areas: [],
        other_clinical_area: '',
        area_options: [
          // { text: 'Adult Critical Care', value: 'ACC' },
          // { text: 'Paediatric Critical Care', value: 'PCC' },
          // { text: 'Paediatric Wards', value: 'Paediatric Wards' },
          // { text: 'A & E', value: 'A&E' },
          // { text: 'Chemotherapy', value: 'Chemotherapy' },
          // { text: 'Outpatients', value: 'Outpatients' },
          // { text: 'Community Beds', value: 'Community beds' },
          // { text: 'Day Cases', value: 'Day cases' },
          // { text: 'Clinical Trials', value: 'Clinical trials' },
          // { text: 'Intermediate Care', value: 'Intermediate care' }
          // Updates 2024-07-01
          { text: 'Accident and Emergency EPMA Accessible i.e. open to view medication records (A&E) ', value: 'A&E EPMA Acc' },
          { text: 'Accident and Emergency EPMA being used for prescribing (A&E) ', value: 'A&E EPMA Prescribing' },
          { text: 'Inpatient (e.g. Ambulatory unit, Care of the Elderly, Orthopaedics)', value: 'Inpatient' },
          { text: 'Intensive Care Unit (ICU)', value: 'ICU' },
          { text: 'Theatre', value: 'Theatre' },
          { text: 'Day Cases ( e.g. procedures)', value: 'Day Cases' },
          { text: 'Outpatients', value: 'Outpatients' },
          { text: 'Special Clinics (e.g. Dialysis / Renal)', value: 'Special Clinics' },
          { text: 'Sexual and Reproductive Health (SRH) services or Genitourinary Medicine Clinics (GUM)', value: 'SRH' },
          { text: 'Maternity', value: 'Maternity' },
          { text: 'Neonatal', value: 'Neonatal' },
          { text: 'Special Care Baby Unit (SCBU) / Neonatal Intensive Care (NICU)', value: 'SCBU' },
          { text: 'Paediatrics', value: 'Paediatrics' },
          { text: 'Paediatric Intensive Care (PICU)', value: 'PICU' },
          { text: 'Cancer Services', value: 'Cancer Services' },
          { text: 'Community', value: 'Community' },
          { text: 'Intermediate Care', value: 'Intermediate Care' },
          { text: 'Virtual Wards', value: 'Virtual Wards' },
          { text: 'Homecare medicines service', value: 'HMS' },
          { text: 'Clinical Trials ', value: 'Clinical Trials' },
          { text: 'Other (please specify)', value: 'Other' }
        ]
      },
      startTime: ''
    }
  },
  methods: {
    onResetClick() {
      this.$refs.assessmentSystemForm.resetForm()
      this.results.ep_service_implemented = null
      this.results.ep_service_updated = null
    },
    onNextClick() {
      this.$refs.assessmentSystemForm.validate().then(async (valid) => {
        if (valid) {

          const time_taken = dayjs().diff(this.startTime, 'seconds')

          const ep_service = this.results.ep_service
          const local_ep_system_name = this.results.local_ep_system_name
          const ep_service_implemented = `${prependZero(this.results.ep_service_implemented.month + 1)}-${this.results.ep_service_implemented.year}`
          const ep_service_updated = `${prependZero(this.results.ep_service_updated.month + 1)}-${this.results.ep_service_updated.year}`
          const ep_version = this.results.ep_version  // Note: no longer used as of July 2024
          const num_maintainers = this.results.num_maintainers
          const other_ep_system = this.results.other_ep_system
          const ep_usage = this.results.ep_usage
          const add_ep_system = this.results.add_ep_system
          const patient_type = 'Adults'
          const lab_results = this.results.lab_results
          const man_results = this.results.man_results
          const diagnosis_results = this.results.diagnosis_results
          const med_history = this.results.med_history
          const high_risk_meds = this.results.high_risk_meds.toString()
          const clinical_areas = this.results.clinical_areas
          if (this.results.other_clinical_area != '') {
            clinical_areas.push(this.results.other_clinical_area)
          }
          const final_clinical_areas = clinical_areas.toString()
          const response = await rootStore().saveSystemData(ep_service, ep_service_implemented, ep_service_updated, other_ep_system, local_ep_system_name, ep_version, ep_usage, num_maintainers, add_ep_system, patient_type, lab_results, man_results, diagnosis_results, med_history, high_risk_meds, final_clinical_areas, time_taken)
          if (response.status < 400) {
            rootStore().audit('Save system data', '/assessmentSystem')
            this.$router.push('/assessmentpatients/' + patient_type)
          } else {
            this.errorAlertModal.show(response.message)
          }
        }
      })
    }
  },
  created: function () {
    this.startTime = dayjs()
  }
}
</script>

<style scoped></style>
