<template>
  <div id="page">
    <Header />
    <div id="content">

      <h1>ePRaSE Assessment</h1>
      <h4>Part 1 - EP System Information</h4>
      <p>Before we begin the assessment, please provide the following information.</p>

      <div class="assessment-part1">
        <h4>About your system</h4>
        <p>Please answer the following questions about your ePrescribing system:</p>

        <div>
          <form id="ep-system-form" @submit.prevent="handleSubmit">
            <div class="form-group">
              <label for="ep-system-selector">Which electronic prescribing (eP) service are you using? </label>
              <select name="ep-service" id="ep-system-selector" class="form-control" v-model="results.ep_service">
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

            <div id="other" class="form-group" hidden>
              <ul style="list-style-type:circle">
                <li><input type="text" ></li>
              </ul>
            </div>
            <div class="form-group">
              <label for="ep-version">What version of the service are you currently using?</label>
              <span id="version"><input id="ep-version" name="ep-version" type="text" class="form-control" v-model="results.ep_version" v-validate="{required: true, min: 1, max: 50}" ></span>
              <div v-if="submitted && errors.has('ep-version')" class="invalid-feedback alert alert-danger">{{ errors.first('ep-version') }}</div>
            </div>

            <div class="question form-group" id="question-1">
              <label for="usage-selector">Approximately what percentage of inpatient prescription orders are prescribed through the eP system across your organisation?</label>
              <select name="ep-usage" id="usage-selector" class="form-control" v-model="results.ep_usage">
                <option :value="null">Select Percentage...</option>
                <option value="76-100">76-100%</option>
                <option value="51-75">51-75%</option>
                <option value="26-50">26-50%</option>
                <option value="0-25">0-25%</option>
              </select>
            </div>

            <div class="question form-group" id="question-2">
              <label for="ep-patients">Do you use your ePrescribing system for adults, paediatrics or both?</label>
              <select name="ep-usage" id="ep-patients" class="form-control"  v-model="results.patient_type">
                <option :value="null">Select an Option...</option>
                <option value="Adults">Adults</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Both">Both</option>
              </select>
            </div>

            <div class="question form-group" id="question-4">
              <p class="lab-results-label"> Is your hospital laboratory results system fully integrated with your e-prescribing system?</p>
              <span class="radio-buttons">
                <label for="lab-results-yes">Yes</label>
                <input type="radio" value=true class="radio-yes" name="lab-results-yes" id="lab-results-yes"  v-model="results.lab_results">

                <label for="lab-results-no">No</label>
                <input type="radio" value=false class="radio-no" name="lab-results-no" id="lab-results-no"  v-model="results.lab_results">
              </span>
            </div>

            <div class="question form-group" id="question-5">
              <p class="med-history-label">Are you able to manually enter diagnosis and medical history into your test system?</p>
              <span class="radio-buttons">
                  <label for="med-history-yes">Yes</label>
                    <input type="radio" value=true class="radio-yes" name="med-history-yes" id="med-history-yes" v-model="results.med_history">
                  <label for="med-history-no">No</label>
                    <input type="radio" value=false class="radio-no" name="med-history-no" id="med-history-no" v-model="results.med_history">
            </span>
            </div>

            <div class="form-group footer">
              <div class="buttons">
                <p>When you have answered all of the questions, click <strong>Next</strong>.</p>
                <button type="button" class="btn btn-primary" id="exit-button" @click="onExitClick()">Exit</button>
                <button type="button" class="btn btn-primary" id="next-button" @click="onNextClick()" :disabled="isFormInvalid">Next</button>
              </div>
            </div>
          </form>
        </div>
      </div>

    </div>
  </div>
</template>

<script>

    import Header from './Header';
    import { dataService } from '../services/data.service';

    export default {
        name: "AssessmentPart1",
        components: {
            Header
        },
        computed: {
            isFormInvalid() {
                return Object.keys(this.fields).some(key => this.fields[key].invalid);
            }
        },
        data() {
            return {
                results: {
                    ep_service: null,
                    ep_version: '',
                    ep_usage: null,
                    patient_type: null,
                    lab_results: '',
                    med_history: '',
                    time_taken: ''
                },
                submitted: false,
                assessment: {
                    currentPart: dataService.getAssessmentPart(),
                },
                startTime: ''
            }
        },
        methods: {
            resetForm: function () {
                this.$data.results = {};
                this.errors.clear();
            },
            onExitClick() {
                window.location.href = './logout'
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
                        const ep_usage = this.results.ep_usage;
                        const patient_type = this.results.patient_type;
                        const lab_results = this.results.lab_results;
                        const med_history = this.results.med_history;
                        const time_taken = this.results.time_taken;
                        const { dispatch } = this.$store;
                        if (time_taken){
                            dispatch('authentication/savePart1Data', { ep_service, ep_version, ep_usage, patient_type, lab_results, med_history, time_taken });
                        }
                    }
                });
            }
        },
        created : function() {
            this.startTime = new Date();
        }
    }
</script>

<style scoped>

  #page {
    text-align: left;
  }

  #content {
    padding: 40px;
  }

  #ep-system-form {
    margin-top: 40px;
    background-color: #cdf8ff;
    border: 1px solid #6b9bc7;
    padding: 20px;
    border-radius: 25px;
    max-width: 950px;
  }

  #version {
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

  .lab-results-label, .med-history-label {
    font-weight: 700;
    max-width: 550px;
    display: inline-block;
  }

  .radio-yes {
    width: 25px;
  }

  .radio-no {
    width: 25px;
  }

  .radio-buttons {
    margin-left: 140px;
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

  .assessment-part1 {
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

  .footer {
    margin-top: 40px;
    text-align: center;
  }

  .footer p {
    padding-bottom: 10px;
  }



</style>
