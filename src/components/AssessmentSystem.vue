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
              <label class="col-sm-8 col-form-label" for="ep-system-selector">Which electronic prescribing (eP) service
                are you using? <span class="required-field">*</span></label>
              <div class="col-sm-4">
                <Field v-slot="{ field, meta }" v-model="results.ep_service" name="ep-service" id="ep-system-selector">
                  <select v-bind="field" class="form-select"
                    :class="meta.dirty ? (meta.valid ? 'is-valid' : 'is-invalid') : ''">
                    <option value="" disabled>Select system...</option>
                    <option value="Cerner"> Cerner </option>
                    <option value="All script"> All script </option>
                    <option value="Meditech"> Meditech </option>
                    <option value="JAC"> JAC </option>
                    <option value="Medway"> Medway </option>
                    <option value="EPIC"> EPIC </option>
                    <option value="Open EP"> Open EP </option>
                    <option value="PICS"> PICS </option>
                    <option value="Sunrise"> Sunrise </option>
                    <option value="MedChart">MedChart </option>
                    <option value="Lorenzo">Lorenzo </option>
                    <option value="Other"> Other (Please Specify)</option>
                  </select>
                </Field>
              </div>
              <ErrorMessage name="ep-service" as="div" class="mt-2 text-danger text-center" v-slot="{ message }">
                {{ message }}
              </ErrorMessage>
            </div>

            <div v-if="results.ep_service === 'Other'" class="mb-4 row">
              <label class="col-sm-8 col-form-label" for="other-ep-system">Other eP service? <span class="required-field">*</span></label>
              <div class="col-sm-4">
                <Field v-slot="{ field, meta }" v-model="results.other_ep_system" name="other" id="other-ep-system">
                  <input v-bind="field" type="text" class="form-control"
                    :class="meta.dirty ? (meta.valid ? 'is-valid' : 'is-invalid') : ''" placeholder="Enter service...">
                </Field>
              </div>
              <ErrorMessage name="other" as="div" class="mt-2 text-danger text-center" v-slot="{ message }">
                {{ message }}
              </ErrorMessage>
            </div>

            <div class="mb-4 row">
              <label class="col-sm-8 col-form-label" for="ep-version">What version of the service are you currently
                using? <span class="required-field">*</span></label>
              <div class="col-sm-4">
                <Field v-slot="{ field, meta }" v-model="results.ep_version" name="ep-version" id="ep-version">
                  <input v-bind="field" type="text" class="form-control"
                    :class="meta.dirty ? (meta.valid ? 'is-valid' : 'is-invalid') : ''" placeholder="Enter version...">
                </Field>
              </div>
              <ErrorMessage name="ep-version" as="div" class="mt-2 text-danger text-center" v-slot="{ message }">
                {{ message }}
              </ErrorMessage>
            </div>

            <div class="mb-4 row">
              <label class="col-sm-8 col-form-label" for="usage-selector">Approximately what percentage of inpatient
                prescription orders are prescribed through the eP system across your organisation? <span class="required-field">*</span></label>
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
              <ErrorMessage name="ep-service" as="div" class="mt-2 text-danger text-center" v-slot="{ message }">
                {{ message }}
              </ErrorMessage>
            </div>

            <!-- <div class="mb-4 row">
              <label class="col-sm-8 col-form-label" for="ep-patients">Do you use your ePrescribing system for adults, paediatrics or both? <span class="required-field">*</span></label>
              <div class="col-sm-4">                
                <Field v-slot="{ field, meta }" v-model="results.patient_type" name="ep-usage" id="ep-patients"
                  rules="required">
                  <select v-bind="field" class="form-select"
                    :class="meta.dirty ? (meta.valid ? 'is-valid' : 'is-invalid') : ''">
                    <option value="" disabled>Select an option...</option>
                    <option value="Adults">Adults</option>
                    <option value="Paediatrics">Paediatrics</option>
                    <option value="Both">Both</option>
                  </select>
                </Field>               
              </div>
              <ErrorMessage name="ep-usage" as="div" class="mt-2 text-danger text-center" v-slot="{ message }">
                {{ message }}
              </ErrorMessage>
            </div> -->

            <div class="mb-4 row">
              <label class="col-sm-8 col-form-label" for="add-ep-system">Are there other e-prescribing systems in use in
                the organisation? if so, please provide their names.</label>
              <div class="col-sm-4">
                <Field v-slot="{ field, meta }" v-model="results.add_ep_system" name="add-ep-system" id="add-ep-system">
                  <input v-bind="field" type="text" class="form-control" placeholder="Other...">
                </Field>
              </div>
              <ErrorMessage name="ep-version" as="div" class="mt-2 text-danger text-center" v-slot="{ message }">
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
                into your test system that you are using to do this assessment? <span class="required-field">*</span></p>
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
              <p>Is the e-prescribing system used to prescribe the following?</p>
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
              <p>Is the e-prescribing system used in the following areas?</p>
              <div v-for="(option, index) in results.area_options" class="form-check ms-2">
                <Field v-slot="{ field }" v-model="results.clinical_areas" type="checkbox"
                  :id="'id_clinical_areas_' + index" name="clinical_areas" :value="option.value">
                  <input v-bind="field" type="checkbox" class="form-check-input" name="clinical_areas"
                    :value="option.value">
                </Field>
                <label class="form-check-label" :for="'id_clinical_areas_' + index">{{ option.text }}</label>
              </div>
            </div>

            <div class="row">
              <p class="text-primary">* required fields</p>
              <p>When you have answered all of the questions, click <span class="fw-bold">Next</span></p>
            </div>

            <div>
              <button type="reset" class="btn btn-primary me-3" @click="onResetClick">
                <i class="bi bi-x pe-1"></i>Clear</button>
              <button type="button" class="btn btn-primary me-3" data-bs-toggle="modal" data-bs-target="#exitModal">
                <i class="bi bi-box-arrow-right pe-1"></i>Exit</button>
              <button type="button" class="next-btn btn btn-primary" :disabled="!formMeta.valid" id="next-button"
                @click="onNextClick()">
                <i class="bi bi-caret-right-fill pe-1"></i>Next</button>
            </div>

          </Form>
        </div>
      </div>

    </div>

    <ExitModal :showActionBtn="true" @modal-closed="exitModalClose()" @modal-actioned="exit()" />
    <ErrorAlertModal ref="errorAlertModal" />
    <AppLogo cls="bottomright" />

  </main>

</template>

<script>

import { mapStores } from 'pinia'
import { rootStore } from '../stores/root'
import TabHeader from './TabHeader'
import LoginInfo from './LoginInfo'
import AppLogo from './AppLogo'
import ErrorAlertModal from './ErrorAlertModal'
import ExitModal from "./ExitModal"
import { Form, Field, ErrorMessage } from 'vee-validate'

export default {
  name: "AssessmentSystem",
  components: {
    TabHeader,
    LoginInfo,
    AppLogo,
    ExitModal,
    ErrorAlertModal,
    Form,
    Field,
    ErrorMessage
  },
  computed: {
    ...mapStores(rootStore),
    errorAlertModal() {
      return this.$refs.errorAlertModal
    }
  },
  data() {
    return {
      validationSchema: {
        'ep-service': 'required',
        'other': (value) => {
          return (this.ep_service == 'Other') ? (value != '' ? true : 'Please give details') : true        
        },
        'ep-version': 'required|lengthBetween:1,50',
        'ep-usage': 'required',
        'lab-results': (value) => {
          return ['true', 'false'].includes(value) ? true : 'Please select one' 
        },
        'man-results': (value) => {
          return (this.lab_results ? (['true', 'false'].includes(value) ? true : 'Please select one') : true)
        },
        'med-history': (value) => {
          return ['true', 'false'].includes(value) ? true : 'Please select one' 
        },
        'diagnosis-results': (value) => {
          return (this.med_history ? (['true', 'false'].includes(value) ? true : 'Please select one') : true)
        }
      },
      results: {
        ep_service: '',
        ep_version: '',
        ep_usage: '',
        other_ep_system: '',
        add_ep_system: '',
        patient_type: '',
        lab_results: '',
        med_history: '',
        man_results: '',
        diagnosis_results: '',
        time_taken: '',
        high_risk_meds: [],
        options: [
          { text: 'Warfarin', value: 'Warfarin' },
          { text: 'Insulin', value: 'Insulin' },
          { text: 'Fluids', value: 'Fluids' },
          { text: 'Oxygen', value: 'Oxygen' },
          { text: 'Patient controlled analgesia (PCA)', value: 'PCA' },
          { text: 'Continuous infusions', value: 'Continuous infusions' },
          { text: 'Parenteral nutrition', value: 'Parenteral nutrition' },
          { text: 'Enteral nutrition', value: 'Enteral nutrition' },
          { text: 'Nutritional supplements (not classed as a medicine)', value: 'Nutritional supplements' },
          { text: 'Medicines undefined with the catalogue (free text function)', value: 'Undefined medicines' }
        ],
        clinical_areas: [],
        area_options: [
          { text: 'Adult Critical Care', value: 'ACC' },
          { text: 'Paediatric Critical Care', value: 'PCC' },
          { text: 'Paediatric Wards', value: 'Paediatric Wards' },
          { text: 'A & E', value: 'A&E' },
          { text: 'Chemotherapy', value: 'Chemotherapy' },
          { text: 'Outpatients', value: 'Outpatients' },
          { text: 'Community Beds', value: 'Community beds' },
          { text: 'Day Cases', value: 'Day cases' },
          { text: 'Clinical Trials', value: 'Clinical trials' },
          { text: 'Intermediate Care', value: 'Intermediate care' }
        ]
      },
      startTime: ''
    }
  },
  methods: {   
    onResetClick() {
      this.$refs.assessmentSystemForm.resetForm()
    },
    exit() {
      //TODO there should be a pre-hook action on logout to save the current state
      this.$router.push('/logout')      
    },
    onNextClick() {
      this.$refs.assessmentSystemForm.validate().then(async (valid) => {
        if (valid) {

          let endTime = new Date()
          let elapsedTime = endTime.getTime() - this.startTime.getTime()
          this.results.time_taken = elapsedTime / 1000

          const ep_service = this.results.ep_service
          const ep_version = this.results.ep_version
          const other_ep_system = this.results.other_ep_system
          const ep_usage = this.results.ep_usage
          const add_ep_system = this.results.add_ep_system
          const patient_type = 'Adults'
          const lab_results = this.results.lab_results
          const man_results = this.results.man_results
          const diagnosis_results = this.results.diagnosis_results
          const med_history = this.results.med_history
          const time_taken = this.results.time_taken
          const high_risk_meds = this.results.high_risk_meds.toString()
          const clinical_areas = this.results.clinical_areas.toString()

          const response = await rootStore().saveSystemData(ep_service, other_ep_system, ep_version, ep_usage, add_ep_system, patient_type, lab_results, man_results, diagnosis_results, med_history, high_risk_meds, clinical_areas, time_taken)
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
    this.startTime = new Date()
  }
}
</script>

<style scoped></style>
