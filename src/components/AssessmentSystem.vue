<template>
  <GroupElement name="systemForm">
    <StaticElement name="systemHeading">
      <h2>EP System Information</h2>
      <h3>Please answer the following questions:</h3>
    </StaticElement>
    <SelectElement name="epService" :label="embolden('Name of ePrescribing system')"
      :native="false" 
      :search="true"
      :track-by="['label', 'value']"
      :items="getEpSystemNames"
      :messages="{required: 'Name of ePrescribing system is required'}" 
      :rules="['required']"
    />    
    <TextElement name="otherEpService" :label="embolden('Do you use an additional ePrescribing service?')" placeholder="Name of other eP system" 
      :debounce="1000" 
      :messages="{required: 'Other eP system name is required'}" 
      :rules="[{ 'required': ['epService', '==', 'Other'] }]" />      
    <TextElement name="localEpServiceName" :label="embolden('Local name for ePrecribing service')" placeholder="Local name for the ePrescribing system, if different from the official name" 
      :debounce="1000" />
    <DateElement name="epServiceImplemented" :label="embolden('ePrescribing system implementation date')" :extendOptions="{ dateFormat: 'M/Y', plugins: [new monthSelectPlugin()], disableMobile: true }"
      :messages="{required: 'Implementation date is required'}"  
      :rules="['required']" />
    <DateElement name="epServiceUpdated" :label="embolden('Last ePrescribing system update date')" :extendOptions="{ dateFormat: 'M/Y', plugins: [new monthSelectPlugin()], disableMobile: true }"
      :messages="{required: 'Update date is required'}"  
      :rules="['required', 'after_or_equal:epServiceImplemented']" />  
  </GroupElement>

  <!-- <main class="leftalign">

    <TabHeader :showIndex="0" />
    <div class="content p-4">

      <LoginInfo />

      <h1 class="h2">EP System Information</h1>
      <h2 class="h3">Please answer the following questions about your ePrescribing system:</h2>

      <div class="p-4">
        <Form ref="assessmentSystemForm" v-slot="{ meta: formMeta }" :validation-schema="validationSchema">

        
          <div class="mb-4 row">
            <label class="col-sm-8 col-form-label" for="ep-service-implemented">When (month/year) was current eP system
              implemented? <span class="required-field">*</span></label>
            <div class="col-sm-4">
              <Field v-slot="{ field, meta }" name="ep-service-implemented">
                <VueDatePicker id="ep-service-implemented" ref="epServiceImplemented" v-bind="field" v-model="results.ep_service_implemented"
                  month-picker auto-apply placeholder="Select month/year" :state="meta.dirty ? meta.valid : null"
                  :max-date="new Date()" />
              </Field>
            </div>
            <ErrorMessage name="ep-service-implemented" as="div" class="mt-2 text-danger text-center"
              v-slot="{ message }">
              {{ message }}
            </ErrorMessage>
          </div>

          <div class="mb-4 row">
            <label class="col-sm-8 col-form-label" for="ep-service-updated">When (month/year) was current eP system last updated? <span class="required-field">*</span></label>
            <div class="col-sm-4">
              <Field v-slot="{ field, meta }" name="ep-service-updated">
                <VueDatePicker id="ep-service-updated" ref="epServiceUpdated" v-bind="field" v-model="results.ep_service_updated" month-picker
                  auto-apply placeholder="Select month/year" :state="meta.dirty ? meta.valid : null"
                  :max-date="new Date()" />
              </Field>
            </div>
            <ErrorMessage name="ep-service-updated" as="div" class="mt-2 text-danger text-center" v-slot="{ message }">
              {{ message }}
            </ErrorMessage>
          </div>

          <div class="mb-4 row">
            <label class="col-sm-8 col-form-label" for="num-maintainers">How many WTE maintain the drug catalogue and
              prescribing decision support for this system? <span class="required-field">*</span></label>
            <div class="col-sm-4">
              <Field v-slot="{ field, meta }" v-model="results.num_maintainers" name="num-maintainers">
                <input v-bind="field" id="num-maintainers" type="text" class="form-control" data-bs-toggle="tooltip" data-bs-placement="top"
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
              <Field v-slot="{ field, meta }" v-model="results.ep_usage" name="ep-usage" >
                <select v-bind="field" id="usage-selector" class="form-select"
                  :class="meta.dirty ? (meta.valid ? 'is-valid' : 'is-invalid') : ''">
                  <option value="" disabled>Select percentage...</option>
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
            <label class="col-sm-8 col-form-label" for="add-ep-system">Are there other ePrescribing systems in use in
              the organisation? if so, please provide their names.</label>
            <div class="col-sm-4">
              <Field v-slot="{ field, meta }" v-model="results.add_ep_system" name="add-ep-system" >
                <input v-bind="field" id="add-ep-system" type="text" class="form-control" placeholder="Other...">
              </Field>
            </div>
            <ErrorMessage name="add-ep-system" as="div" class="mt-2 text-danger text-center" v-slot="{ message }">
              {{ message }}
            </ErrorMessage>
          </div>

          <div class="mb-4 row">
            <p class="col-sm-8 fw-bold">Is your hospital laboratory results system fully integrated with your
              ePrescribing system? <span class="required-field">*</span></p>
            <div class="col-sm-4">
              <fieldset>
              <legend style="display: none;">Lab results integration question options</legend>
              <div class="form-check form-check-inline">
                <Field v-slot="{ field, meta }" v-model="results.lab_results" type="radio" name="lab-results"
                  value="true">
                  <input v-bind="field" id="lab-results-yes" type="radio" name="lab-results" value="true" class="form-check-input">
                </Field>
                <label class="form-check-label" for="lab-results-yes">Yes</label>
              </div>
              <div class="form-check form-check-inline">
                <Field v-slot="{ field, meta }" v-model="results.lab_results" type="radio" name="lab-results"
                value="false">
                  <input v-bind="field" id="lab-results-no" type="radio" name="lab-results" value="false" class="form-check-input">
                </Field>
                <label class="form-check-label" for="lab-results-no">No</label>
              </div>
            </fieldset>
            </div>
          </div>

          <div class="mb-4 row" v-if="results.lab_results === 'true'">
            <p class="col-sm-8"><i class="bi bi-caret-right-fill"></i> Are you able to manually enter laboratory
              results into your patient admin and/ or ePrescribing test system that you are using to do this
              assessments?</p>
            <div class="col-sm-4">
            <fieldset>
              <legend style="display: none;">Lab result manual entry options</legend>
              <div class="form-check form-check-inline">
                <Field v-slot="{ field, meta }" v-model="results.man_results" type="radio" name="man-results"
                value="true">
                  <input v-bind="field" id="man-results-yes"  type="radio" name="man-results" value="true" class="form-check-input"
                    autocomplete="off">
                </Field>
                <label class="form-check-label" for="man-results-yes">Yes</label>
              </div>
              <div class="form-check form-check-inline">
                <Field v-slot="{ field, meta }" v-model="results.man_results" type="radio" name="man-results"
                 value="false">
                  <input v-bind="field" id="man-results-no" type="radio" name="man-results" value="false" class="form-check-input"
                    autocomplete="off">
                </Field>
                <label class="form-check-label" for="man-results-no">No</label>
              </div>
            </fieldset>
            </div>
          </div>

          <div class="mb-4 row">
            <p class="col-sm-8 fw-bold">Are you able to manually enter diagnosis and medical history into your test
              system? <span class="required-field">*</span></p>
            <div class="col-sm-4">
            <fieldset>
              <legend style="display: none;">Test system question options</legend>
              <div class="form-check form-check-inline">
                <Field v-slot="{ field, meta }" v-model="results.med_history" type="radio" name="med-history"
                  value="true">
                  <input v-bind="field" id="med-history-yes" type="radio" name="med-history" value="true" class="form-check-input"
                    autocomplete="off">
                </Field>
                <label class="form-check-label" for="med-history-yes">Yes</label>
              </div>
              <div class="form-check form-check-inline">
                <Field v-slot="{ field, meta }" v-model="results.med_history" type="radio" name="med-history"
                  value="false">
                  <input v-bind="field" id="med-history-no" type="radio" name="med-history" value="false" class="form-check-input"
                    autocomplete="off">
                </Field>
                <label class="form-check-label" for="med-history-no">No</label>
              </div>
            </fieldset>
            </div>
          </div>

          <div v-if="results.med_history === 'true'" class="mb-4 row">
            <p class="col-sm-8"><i class="bi bi-caret-right-fill"></i>Are you able to enter diagnosis or comorbidities
              into your test system that you are using to do this assessment?
            </p>
            <div class="col-sm-4">
            <fieldset>
              <legend style="display: none;">Test system manual entry question options</legend>
              <div class="form-check form-check-inline">
                <Field v-slot="{ field, meta }" v-model="results.diagnosis_results" name="diagnosis-results"
                 value="true">
                  <input v-bind="field" id="diagnosis-results-yes" type="radio" name="diagnosis-results" value="true" class="form-check-input"
                    autocomplete="off">
                </Field>
                <label class="form-check-label" for="diagnosis-results-yes">Yes</label>
              </div>
              <div class="form-check form-check-inline">
                <Field v-slot="{ field, meta }" v-model="results.diagnosis_results" name="diagnosis-results"
                 value="false">
                  <input v-bind="field" id="diagnosis-results-no"  type="radio" name="diagnosis-results" value="false" class="form-check-input"
                    autocomplete="off">
                </Field>
                <label class="form-check-label" for="diagnosis-results-no">No</label>
              </div>
            </fieldset>
            </div>
          </div>

          <div class="mb-4 row">
            <p>Nationally there have been a number of patient safety incidents relating to mis-recording of Penicillin
              allergy as Penicillamine allergy in electronic prescribing systems, with the risk of allergy alert
              failure. We are hoping to learn more about contributory factors to this issue with the following three
              questions.</p>
            <label class="col-sm-8 col-form-label fw-bold" for="penicillin-selector">How do you describe Penicillin
              V in your system?<span class="required-field">*</span></label>
            <div class="col-sm-4">
              <Field v-slot="{ field, meta }" v-model="results.penicillin_description" name="penicillin-description">
                <select v-bind="field" id="penicillin-selector" class="form-select"
                  :class="meta.dirty ? (meta.valid ? 'is-valid' : 'is-invalid') : ''">
                  <option value="" disabled>Select description...</option>
                  <option value="penicillin_v">Penicillin V</option>
                  <option value="phenoxymethylpenicillin">Phenoxymethylpenicillin</option>
                  <option value="phenoxymethylpenicillin_tablets">Phenoxymethylpenicillin 250mg Tablets</option>
                  <option value="other">Other</option>
                </select>
              </Field>
            </div>
            <ErrorMessage name="penicillin-description" as="div" class="mt-2 text-danger text-center"
              v-slot="{ message }">
              {{ message }}
            </ErrorMessage>
          </div>

          <div v-if="results.penicillin_description === 'other'" class="mb-4 row">
            <label class="col-sm-8 col-form-label" for="penicillin-description-other">Your description? <span
                class="required-field">*</span></label>
            <div class="col-sm-4">
              <Field v-slot="{ field, meta }" v-model="results.penicillin_description_other"
                name="penicillin-description-other" >
                <input v-bind="field" id="penicillin-description-other" type="text" class="form-control"
                  :class="meta.dirty ? (meta.valid ? 'is-valid' : 'is-invalid') : ''"
                  placeholder="Enter description...">
              </Field>
            </div>
            <ErrorMessage name="penicillin-description-other" as="div" class="mt-2 text-danger text-center"
              v-slot="{ message }">
              {{ message }}
            </ErrorMessage>
          </div>

          <div class="mb-4 row">
            <p class="col-sm-8 fw-bold">Thinking about when you enter Penicill (exactly as stated) in your allergy
              recording function is Penicillamine visible as an option to select? <span class="required-field">*</span>
            </p>
            <div class="col-sm-4">
              <fieldset>
                <legend style="display: none;">Penicill question options</legend>
                <div class="form-check form-check-inline">
                  <Field v-slot="{ field, meta }" v-model="results.penicillin_results" name="penicillin-results"
                value="true">
                    <input v-bind="field" type="radio" id="penicillin-results-yes" name="penicillin-results" value="true" class="form-check-input"
                      autocomplete="off">
                  </Field>
                  <label class="form-check-label" for="penicillin-results-yes">Yes</label>
                </div>
                <div class="form-check form-check-inline">
                  <Field v-slot="{ field, meta }" v-model="results.penicillin_results" name="penicillin-results"
                    value="false">
                    <input v-bind="field" type="radio" id="penicillin-results-no" name="penicillin-results" value="false" class="form-check-input"
                      autocomplete="off">
                  </Field>
                  <label class="form-check-label" for="penicillin-results-no">No</label>
                </div>
              </fieldset>
            </div>
          </div>

          <div class="mb-4 row">
            <label class="col-sm-8 col-form-label fw-bold" for="penicillin-comment">If there is anything you would like to
              tell us about penicillin prescribing in your organisation, please record it here.</label>
            <div class="col-sm-4">
              <Field v-slot="{ field, meta }" v-model="results.penicillin_comment" name="penicillin-comment">
                <input v-bind="field" id="penicillin-comment" type="text" class="form-control" data-bs-toggle="tooltip" data-bs-placement="top">
              </Field>
            </div>
            <ErrorMessage name="penicillin-comment" as="div" class="mt-2 text-danger text-center" v-slot="{ message }">
              {{ message }}
            </ErrorMessage>
          </div>

          <div class="mb-4 row">
            <p class="fw-bold">Is the ePrescribing system used to prescribe the following? <span class="required-field">*</span></p>
            <fieldset>
              <legend style="display: none;">ePrescribing system prescription question options</legend>
              <div v-for="(option, index) in results.options" class="form-check ms-2">
                <Field v-slot="{ field }" v-model="results.high_risk_meds" type="checkbox" name="high_risk_meds" :value="option.value">
                  <input v-bind="field" :id="'id_high_risk_meds_' + index" type="checkbox" class="form-check-input" name="high_risk_meds"
                    :value="option.value">
                </Field>
                <label class="form-check-label" :for="'id_high_risk_meds_' + index">{{ option.text }}</label>
              </div>
            </fieldset>
          </div>

          <div class="mb-4 row">
            <p class="fw-bold">Is the ePrescribing system used in the following areas? <span class="required-field">*</span></p>
            <fieldset>
              <legend style="display: none;">ePrescribing area question options</legend>
              <div v-for="(option, index) in results.area_options" class="form-check ms-2">
                <Field v-slot="{ field }" v-model="results.clinical_areas" type="checkbox"
                  name="clinical_areas" :value="option.value">
                  <input v-bind="field" :id="'id_clinical_areas_' + index" type="checkbox" class="form-check-input" name="clinical_areas"
                    :value="option.value">
                </Field>
                <label class="form-check-label" :for="'id_clinical_areas_' + index">{{ option.text }}</label>
              </div>
            </fieldset>
          </div>

          <div v-if="results.clinical_areas.includes('Other')" class="mb-4 row">
            <label class="col-sm-8 col-form-label" for="other-clinical-area">Other area<span
                class="required-field">*</span></label>
            <fieldset>
              <legend style="display: none;">Clinical area question options</legend>
              <div class="col-sm-4">
                <Field v-slot="{ field, meta }" v-model="results.other_clinical_area" name="other-clinical-area">
                  <input v-bind="field" id="other-clinical-area" type="text" class="form-control"
                    :class="meta.dirty ? (meta.valid ? 'is-valid' : 'is-invalid') : ''" placeholder="Specify...">
                </Field>
              </div>
            </fieldset>
            <ErrorMessage name="other-clinical-area" as="div" class="mt-2 text-danger text-center" v-slot="{ message }">
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
    </div> -->

</template>

<script>

//TODO install https://www.npmjs.com/package/vue-flatpickr-component then
// import flatPicker from "vue-flatpickr-component";
// import monthSelectPlugin from "flatpickr/dist/plugins/monthSelect";

// export default {
//   components: {
//     flatPicker,
//   },
//   data() {
//     return {
//       dpconfig: {
//         wrap: true,
//         altInput: true,
//         dateFormat: "m-y",
//         altFormat: "m-y",
//         plugins: [monthSelectPlugin],
//         // Additional options for flatpickr
//       },
//     };
//   },
// };
import { mapState } from 'pinia'
import { rootStore } from '../stores/root'
import { StaticElement } from '@vueform/vueform/dist/bootstrap'

export default {
  name: "AssessmentSystem",    
  computed: {
    ...mapState(rootStore, ['getEpSystems']),     
    legalCharacterMatcher() {
      return /^[A-Za-z0-9-.,_() ]+$/
    }    
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
      },
      // validationSchema: {
      //   'ep-service': 'required',
      //   'other': (value) => {
      //     if (this.results.ep_service == 'Other') {
      //       if (!value) {
      //         return 'Please give details'
      //       } else if (value.length > 255) {
      //         return 'Input is restricted to 255 characters'
      //       } else if (!value.match(this.legalCharacterMatcher)) {
      //         return 'Input contains illegal characters'
      //       } else {
      //         return true
      //       }
      //     } else {
      //       return true
      //     }
      //   },
      //   'local-ep-system-name': (value) => {
      //     if (!value) {
      //       return true
      //     } else if (value.length > 255) {
      //       return 'Input is restricted to 255 characters'
      //     } else if (!value.match(this.legalCharacterMatcher)) {
      //       return 'Input contains illegal characters'
      //     } else {
      //       return true
      //     }
      //   },
      //   'ep-service-implemented': 'required|validMonthYearDateBefore:@ep-service-updated',
      //   'ep-service-updated': 'required',
      //   'num-maintainers': (value) => {
      //     if (!value || !value.match(/^\d*(\.\d)?$/)) {
      //       return 'Should be a number with at most one decimal place'
      //     }
      //     return true
      //   },
      //   'ep-usage': 'required',
      //   'lab-results': (value) => {
      //     return ['true', 'false'].includes(value) ? true : 'Please select one'
      //   },
      //   'man-results': (value) => {
      //     return (this.results.lab_results == 'true' ? (['true', 'false'].includes(value) ? true : 'Please select one') : true)
      //   },
      //   'med-history': (value) => {
      //     return ['true', 'false'].includes(value) ? true : 'Please select one'
      //   },
      //   'diagnosis-results': (value) => {
      //     return (this.results.med_history == 'true' ? (['true', 'false'].includes(value) ? true : 'Please select one') : true)
      //   },
      //   'penicillin-description': 'required',
      //   'penicillin-description-other': (value) => {
      //     if (this.results.penicillin_description == 'other') {
      //       return !!value || 'Please enter a description'
      //     }
      //     return true
      //   },
      //   'penicillin-results': (value) => {
      //     return ['true', 'false'].includes(value) ? true : 'Please select one'
      //   },
      //   'high_risk_meds': 'required',
      //   'clinical_areas': 'required',
      //   'other-clinical-area': (value) => {
      //     if (this.results.clinical_areas.includes('Other')) {
      //       if (!value) {
      //         return 'Please give details'
      //       } else if (value.length > 255) {
      //         return 'Input is restricted to 255 characters'
      //       } else if (!value.match(this.legalCharacterMatcher)) {
      //         return 'Input contains illegal characters'
      //       } else {
      //         return true
      //       }
      //     } else {
      //       return true
      //     }
      //   }
      // },
      // results: {
      //   ep_service: '',
      //   ep_service_implemented: null,
      //   ep_service_updated: null,
      //   local_ep_system_name: '',
      //   ep_version: '',
      //   num_maintainers: '',
      //   ep_usage: '',
      //   other_ep_system: '',
      //   add_ep_system: '',
      //   patient_type: '',
      //   lab_results: '',
      //   med_history: '',
      //   man_results: '',
      //   diagnosis_results: '',
      //   penicillin_description: '',
      //   penicillin_description_other: '',
      //   penicillin_results: '',
      //   penicillin_comment: '',
      //   high_risk_meds: [],
      //   options: [
      //     // { text: 'Warfarin', value: 'Warfarin' },
      //     // { text: 'Insulin', value: 'Insulin' },
      //     // { text: 'Fluids', value: 'Fluids' },
      //     // { text: 'Oxygen', value: 'Oxygen' },
      //     // { text: 'Patient controlled analgesia (PCA)', value: 'PCA' },
      //     // { text: 'Continuous infusions', value: 'Continuous infusions' },
      //     // { text: 'Parenteral nutrition', value: 'Parenteral nutrition' },
      //     // { text: 'Enteral nutrition', value: 'Enteral nutrition' },
      //     // { text: 'Nutritional supplements (not classed as a medicine)', value: 'Nutritional supplements' },
      //     // { text: 'Medicines undefined with the catalogue (free text function)', value: 'Undefined medicines' }
      //     // Updates 2024-07-01 & 2024-10-02 (chemo => 2 options)
      //     { text: 'All medicines (e.g. Licensed / Unlicensed / Formulary)', value: 'All medicines' },
      //     { text: 'IV Infusions (e.g. Continuous / Intermittent / Complex)', value: 'IV infusions' },
      //     { text: 'Warfarin', value: 'Warfarin' },
      //     { text: 'Heparin', value: 'Heparin' },
      //     { text: 'Insulin', value: 'Insulin' },
      //     { text: 'Insulin Sliding Scales', value: 'Insulin Sliding Scales' },
      //     { text: 'Chemotherapy oral', value: 'Chemotherapy oral' },
      //     { text: 'Chemotherapy IV', value: 'Chemotherapy IV'},
      //     { text: 'Scheduling system for Immunisations / Vaccinations', value: 'Scheduling System' },
      //     { text: 'Antimicrobials', value: 'Antimicrobials' },
      //     { text: 'Antipsychotics / Antidepressants (e.g. Depot Injections)', value: 'Antipsychotics' },
      //     { text: 'Controlled Drugs', value: 'Controlled Drugs' },
      //     { text: 'Patient Controlled Analgesia', value: 'PCA' },
      //     { text: 'Multi-Ingredient Infusions (e.g Morphine, Cyclizine, Water for Injection)', value: 'MII' },
      //     { text: 'Pharmacogenomics', value: 'Pharmacogenomics' },
      //     { text: 'Fluids', value: 'Fluids' },
      //     { text: 'Blood Products / Components (e.g. red cells, platelets, fresh frozen plasma and cryoprecipitate, or plasma derivatives)', value: 'Blood Products' },
      //     { text: 'Medical Gases (e.g. Oxygen, Medical Air, Nitrous Oxide)', value: 'Medical Gases' },
      //     { text: 'Parenteral Nutrition', value: 'Parenteral Nutrition' },
      //     { text: 'Other Nutrition', value: 'Other Nutrition' },
      //     { text: 'Linked Therapeutic Drug Monitoring (e.g. Gentamicin / Vancomycin)', value: 'LTDM' },
      //     { text: 'Ability to prescribe dose titration', value: 'Dose Titration' }
      //   ],
      //   clinical_areas: [],
      //   other_clinical_area: '',
      //   area_options: [
      //     // { text: 'Adult Critical Care', value: 'ACC' },
      //     // { text: 'Paediatric Critical Care', value: 'PCC' },
      //     // { text: 'Paediatric Wards', value: 'Paediatric Wards' },
      //     // { text: 'A & E', value: 'A&E' },
      //     // { text: 'Chemotherapy', value: 'Chemotherapy' },
      //     // { text: 'Outpatients', value: 'Outpatients' },
      //     // { text: 'Community Beds', value: 'Community beds' },
      //     // { text: 'Day Cases', value: 'Day cases' },
      //     // { text: 'Clinical Trials', value: 'Clinical trials' },
      //     // { text: 'Intermediate Care', value: 'Intermediate care' }
      //     // Updates 2024-07-01
      //     { text: 'Accident and Emergency EPMA Accessible i.e. open to view medication records (A&E) ', value: 'A&E EPMA Acc' },
      //     { text: 'Accident and Emergency EPMA being used for prescribing (A&E) ', value: 'A&E EPMA Prescribing' },
      //     { text: 'Inpatient (e.g. Ambulatory unit, Care of the Elderly, Orthopaedics)', value: 'Inpatient' },
      //     { text: 'Intensive Care Unit (ICU)', value: 'ICU' },
      //     { text: 'Theatre', value: 'Theatre' },
      //     { text: 'Day Cases ( e.g. procedures)', value: 'Day Cases' },
      //     { text: 'Outpatients', value: 'Outpatients' },
      //     { text: 'Special Clinics (e.g. Dialysis / Renal)', value: 'Special Clinics' },
      //     { text: 'Sexual and Reproductive Health (SRH) services or Genitourinary Medicine Clinics (GUM)', value: 'SRH' },
      //     { text: 'Maternity', value: 'Maternity' },
      //     { text: 'Neonatal', value: 'Neonatal' },
      //     { text: 'Special Care Baby Unit (SCBU) / Neonatal Intensive Care (NICU)', value: 'SCBU' },
      //     { text: 'Paediatrics', value: 'Paediatrics' },
      //     { text: 'Paediatric Intensive Care (PICU)', value: 'PICU' },
      //     { text: 'Cancer Services', value: 'Cancer Services' },
      //     { text: 'Community', value: 'Community' },
      //     { text: 'Intermediate Care', value: 'Intermediate Care' },
      //     { text: 'Virtual Wards', value: 'Virtual Wards' },
      //     { text: 'Homecare medicines service', value: 'HMS' },
      //     { text: 'Clinical Trials ', value: 'Clinical Trials' },
      //     { text: 'Other (please specify)', value: 'Other' }
      //   ]
      // },
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

    // onResetClick() {
    //   this.$refs.assessmentSystemForm.resetForm()
    //   this.results.ep_service_implemented = null
    //   this.results.ep_service_updated = null
    // },
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
  }
}
</script>

<style scoped></style>
