<template>

  <div id="page">

    <TabHeader system-opacity="0.5" patient-opacity="0.2" scenario-opacity="0.2" report-opacity="0.2"></TabHeader>
    <div class="content">
      <h4>EP System Information</h4>
      <p>Please answer the following questions about your ePrescribing system:</p>

      <div class="assessment-system">
        <div>
          <form id="ep-system-form" @submit.prevent="handleSubmit">
            <div class="form-group">
              <label for="ep-system-selector">Which electronic prescribing (eP) service are you using? *</label>
              <select name="ep-service" id="ep-system-selector" class="form-control" v-model="results.ep_service" v-validate="{required: true, min: 1 }" >
                <option :value="null">Select System...</option>
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
                <option value="Other"> Other (Please Specify) </option>
              </select>
            </div>

            <div v-show="results.ep_service === 'Other'" class="form-group">
              <label for="other-ep-system"> Other eP service?</label>
              <input type="text" name="other" id="other-ep-system" class="form-control" v-model="results.other_ep_system" minlength="3" maxlength="50" placeholder="Enter service...">
              <div v-if="submitted && errors.has('other_ep_system')" class="invalid-feedback alert alert-danger">{{ errors.first('other_ep_system') }}</div>
            </div>

            <div class="form-group">
              <label for="ep-version">What version of the service are you currently using? *</label>
              <span id="version"><input id="ep-version" name="ep-version" type="text" class="form-control" v-model="results.ep_version" v-validate="{required: true, min: 1, max: 50}" placeholder="Enter version..."></span>
              <div v-if="submitted && errors.has('ep_version')" class="invalid-feedback alert alert-danger">{{ errors.first('ep_version') }}</div>
            </div>

            <div class="question form-group" id="question-1">
              <label for="usage-selector">Approximately what percentage of inpatient prescription orders are prescribed through the eP system across your organisation? *</label>
              <select name="ep-usage" id="usage-selector" class="form-control" v-model="results.ep_usage" v-validate="{required: true, min: 1 }" >
                <option :value="null">Select Percentage...</option>
                <option value="76-100">76-100%</option>
                <option value="51-75">51-75%</option>
                <option value="26-50">26-50%</option>
                <option value="0-25">0-25%</option>
              </select>
            </div>

            <!-- remove until Paediatrics scenarios are supported -->
            <!--  <div class="question form-group" id="question-2">
              <label for="ep-patients">Do you use your ePrescribing system for adults, paediatrics or both?</label>
              <select name="ep-usage" id="ep-patients" class="form-control"  v-model="results.patient_type" v-validate="{required: true, min: 1 }" >
                <option :value="null">Select an Option...</option>
                <option value="Adults">Adults</option>
                <option value="Paediatrics">Paediatrics</option>
                <option value="Both">Both</option>
              </select>
            </div> -->

            <div class="form-group">
              <label for="add-ep-system">Are there other e-prescribing systems in use in the organisation? if so, please provide their names.</label>
              <input type="text" name="add-ep-system" id="add-ep-system" class="form-control" v-model="results.add_ep_system" minlength="3" maxlength="50" placeholder="Other...">
              <div v-if="submitted && errors.has('add_ep_system')" class="invalid-feedback alert alert-danger">{{ errors.first('add_ep_system') }}</div>
            </div>

            <div id="radio-button-group">

              <div class="question form-group" id="question-4">
                <p class="results-label"> Is your hospital laboratory results system fully integrated with your e-prescribing system? *</p>
                <span class="radio-buttons">
                <label for="lab-results-yes">Yes</label>
                <input type="radio" value=true class="radio-yes" name="lab-results" id="lab-results-yes"  v-model="results.lab_results" v-validate="'required'">

                <label for="lab-results-no">No</label>
                <input type="radio" value=false class="radio-no" name="lab-results" id="lab-results-no"  v-model="results.lab_results">
              </span>
              </div>


              <div v-show="results.lab_results === 'true'"  class="question form-group" id="question-5">
                <p class="add_results_label"><i class="bi bi-caret-right"></i> Are you able to manually enter laboratory results into your patient admin and/ or e-prescribing test system that you are using to do this assessments?</p>
                <span class="radio-buttons">
                  <label for="man-results-yes">Yes</label>
                  <input type="radio" value=true class="radio-yes" name="man-results" id="man-results-yes"  v-model="results.man_results">

                  <label for="man-results-no">No</label>
                  <input type="radio" value=false class="radio-no" name="man-results" id="man-results-no"  v-model="results.man_results">
                </span>
              </div>

              <div class="question form-group" id="question-6">
                <p class="results-label">Are you able to manually enter diagnosis and medical history into your test system? *</p>
                <span class="radio-buttons">
                  <label for="med-history-yes">Yes</label>
                  <input type="radio" value=true class="radio-yes" name="med-history" id="med-history-yes" v-model="results.med_history" v-validate="'required'">
                  <label for="med-history-no">No</label>
                  <input type="radio" value=false class="radio-no" name="med-history" id="med-history-no" v-model="results.med_history">
                </span>
              </div>

              <div v-if="results.med_history === 'true'"  class="question form-group" id="question-7">
                <p class="add_results_label"><i class="bi bi-caret-right"></i> Are you able to enter diagnosis or comorbidities into your test system that you are using to do this assessments?</p>
                <span class="radio-buttons">
                <label for="diagnosis-results-yes">Yes</label>
                <input type="radio" value=true class="radio-yes" name="diagnosis-results" id="diagnosis-results-yes"  v-model="results.diagnosis_results">

                <label for="diagnosis-results-no">No</label>
                <input type="radio" value=false class="radio-no" name="diagnosis-results" id="diagnosis-results-no"  v-model="results.diagnosis_results">
              </span>
              </div>

            </div>
            <div class="hm-checkbox">
              <b-form-group label="Is the e-prescribing system used to prescribe the following?">
                <b-form-checkbox-group
                  id="high_risk"
                  v-model="results.high_risk_meds"
                  :options="results.options"
                  name="high_risk_meds"
                  stacked
                ></b-form-checkbox-group>
              </b-form-group>

              <!--<ul>
                <li v-for="option in results.options">
                  <input type="checkbox" :id="option.value" :value="option.value" v-model="results.high_risk_meds">
                  <label :for="option.value">{{option.text}}</label>
                </li>
              </ul> -->

            </div>

            <div class="hm-checkbox">
              <b-form-group label="Is the e-prescribing system used in the following areas?">
                <b-form-checkbox-group
                  id="clinical_areas"
                  v-model="results.clinical_areas"
                  :options="results.area_options"
                  name="clinical_areas"
                  stacked
                ></b-form-checkbox-group>
              </b-form-group>
            </div>

            <div class="form-group footer">
              <div class="buttons">
                <p id="required-text"> * required fields</p>
                <p>When you have answered all of the questions, click <strong>Next</strong>.</p>
                <button type="button" class="exit-btn btn btn-primary" id="exit-button" @click="onExitClick()">Exit</button>
                <button type="button" class="next-btn btn btn-primary" id="next-button" @click="onNextClick()" :disabled="isFormInvalid">Next</button>
              </div>
            </div>
          </form>
        </div>
      </div>

    </div>

    <ExitModal v-if="showExitModal" @close="showExitModal = false" />
    <AppLogo></AppLogo>

  </div>

</template>

<script>

    import TabHeader from './TabHeader';
    import AppLogo from './AppLogo';
    import ExitModal from "./ExitModal";
    import { dataService } from '../services/data.service';

    export default {
        name: "AssessmentSystem",
        components: {
            TabHeader,
            AppLogo,
            ExitModal
        },
        computed: {
            isFormInvalid() {
                return Object.keys(this.fields).some(key => this.fields[key].invalid);
            },
            user() {
                return this.$store.state.authentication.user;
            }
        },
        data() {
            return {
                results: {
                    ep_service: null,
                    ep_version: '',
                    ep_usage: null,
                    other_ep_system: null,
                    add_ep_system: null,
                    patient_type: null,
                    lab_results: '',
                    med_history: '',
                    man_results : '',
                    diagnosis_results: '',
                    time_taken: '',
                    high_risk_meds: [],
                    options: [
                      { text: 'Warfarin', value: 'Warfarin'},
                      { text: 'Insulin', value: 'Insulin'},
                      { text: 'Fluids', value: 'Fluids'},
                      { text: 'Oxygen', value: 'Oxygen'},
                      { text: 'Patient controlled analgesia (PCA)', value: 'PCA'},
                      { text: 'Continuous infusions', value: 'Continuous infusions'},
                      { text: 'Parenteral nutrition', value: 'Parenteral nutrition'},
                      { text: 'Enteral nutrition', value: 'Enteral nutrition'},
                      { text: 'Nutritional supplements (not classed as a medicine)', value: 'Nutritional supplements'},
                      { text: 'Medicines undefined with the catalogue (free text function)', value: 'Undefined medicines'}
                    ],
                    clinical_areas: [],
                    area_options: [
                      { text: 'Adult Critical Care', value: 'ACC'},
                      { text: 'Paediatric Critical Care', value: 'PCC'},
                      { text: 'Paediatric Wards', value: 'Paediatric Wards'},
                      { text: 'A & E', value: 'A&E'},
                      { text: 'Chemotherapy', value: 'Chemotherapy'},
                      { text: 'Outpatients', value: 'Outpatients'},
                      { text: 'Community Beds', value: 'Community beds'},
                      { text: 'Day Cases', value: 'Day cases'},
                      { text: 'Clinical Trials', value: 'Clinical trials'},
                      { text: 'Intermediate Care', value: 'Intermediate care'}
                    ]
                },
                submitted: false,
                startTime: '',
                showExitModal: false
            }
        },
        methods: {
            resetForm: function () {
                this.$data.results = {};
                this.errors.clear();
            },
            onExitClick() {
               // this.$router.push('/logout');
               this.showExitModal = true;
            },
            onNextClick()  {
                this.submitted = true;

                this.$validator.validate().then(valid => {
                    if (valid) {

                        let endTime = new Date();
                        let elapsedTime = endTime.getTime() - this.startTime.getTime();
                        this.results.time_taken = elapsedTime/1000;

                        const ep_service  = this.results.ep_service;
                        const ep_version = this.results.ep_version;
                        const other_ep_system = this.results.other_ep_system;
                        const ep_usage = this.results.ep_usage;
                        const add_ep_system = this.results.add_ep_system;
                        const patient_type = 'Adults';
                        const lab_results = this.results.lab_results;
                        const man_results = this.results.man_results;
                        const diagnosis_results = this.results.diagnosis_results;
                        const med_history = this.results.med_history;
                        const time_taken = this.results.time_taken;
                        const high_risk_meds = this.results.high_risk_meds.toString();
                        const clinical_areas = this.results.clinical_areas.toString();
                        const { dispatch } = this.$store;
                        if (time_taken){
                            dispatch('saveSystemData', { ep_service, other_ep_system, ep_version, ep_usage, add_ep_system, patient_type, lab_results, man_results, diagnosis_results, med_history, high_risk_meds, clinical_areas, time_taken });
                        }
                        // audit
                        dataService.audit('Save system data', '/assessmentSystem');
                        this.$router.push({ path: './setpatients/' + patient_type });
                    }
                });
            }
        },
        created : function() {
            this.startTime = new Date();
        },
        mounted : function() {
          history.pushState(null, null, location.href);
            window.onpopstate = function () {
                history.go(1);
            };
        }
    }
</script>

<style scoped>

  .content p {
    text-align: left;
  }

  #page {

    }

  .content {
    padding: 40px;
  }

  #ep-system-form {
    margin-top: 40px;
    padding: 20px 20px 0 20px;
    border-radius: 25px;
    width: 100%;
  }

  #version, #other-ep-system, #other-ep-system, #add-ep-system {
    float: right;
  }

  h4 {
    font-weight: bold;
    text-align: left;
    padding-top: 20px;
  }
  label {
    max-width: 600px;
  }

  .patient-info p {
    text-align: left;
  }

  .results-label{
    font-weight: 700;
    max-width: 655px;
    display: inline-block;
  }

  .add_results_label {
    max-width: 750px;
    display: inline-block;
    padding-left: 20px;
  }

  .radio-yes, .radio-no {
    width: 25px;
  }

  .radio-buttons {
    float:right;
    margin-right: 50px;
  }

  .form-group {
    margin-bottom : 25px;
    text-align: left;
  }

  .form-control {
    width: 200px;
    padding: 5px;
  }

  input {
    width: 200px;
    margin-right: 35px;
  }

  select {
    width: 200px;
    margin-right: 35px;
    float: right;
  }

  table {
    margin-top: 20px;
    margin-bottom: 20px;
    width: 500px;
  }

  td {
    width: auto;
    font-size: 14px;
  }

  .patient-info table
  {
    text-align: left;
    width: auto;
    margin-left: 30px;
  }

  .patient-info td
  {
    width: auto;
    border: solid grey 1px;
    padding: 2px 10px;
    font-size: 14px;
  }

  .assessment-system {
    padding-bottom: 25px;
  }

  button:disabled {
    background-color: dimgray;
  }

  button {
    height: 40px;
    width: 100px;
    font-size: 1.2em;
    margin: 0 50px;
  }

  .exit-btn, .next-btn {
    background-color: #07818e;
    border: 0;
  }

  .footer {
    margin-top: 40px;
    text-align: center;
  }

  .footer p {
    padding-bottom: 10px;
  }

  .form-control.is-invalid, .form-control:valid, .form-control.is-invalid,  .form-control:invalid {
    background: none;
    background-color: #fff;
  }

  #radio-button-group {
    padding: 20px 0;
  }

   #required-text {
    color: #07818e;
    background-color: #fff;
    font-size: 0.9em;
    height: 30px;
    line-height: 30px;
  }


</style>
