<template>
  <div class="page">
    <Header />
    <div class="content">

      <h1>ePRaSE Assessment</h1>
      <h3>Part 1 - EP System Information</h3>
      <p>Before we begin the assessment, please provide the following information.</p>

      <div class="assessment-part1">
        <p>Please answer the following questions about your ePrescribing system:</p>

        <div>
          <form id="ep-system-form">
            <div class="form-group">
              <label for="ep-system-selector">Which electronic prescribing (eP) service are you using? </label>
              <select name="ep-service" id="ep-system-selector" class="form-control" v-model="results.ep_service" required>
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
              <span id="version"><input id="ep-version" name="ep-version" type="text" class="form-control" v-model="results.ep_version" maxlength="12" ></span>
            </div>

            <div class="question form-group" id="question-1">
              <label for="usage-selector">Approximately what percentage of inpatient prescription orders are prescribed through the eP system across your organisation?</label>
              <select name="ep-usage" id="usage-selector" class="form-control" v-model="results.ep_usage" required>
                <option :value="null">Select Percentage...</option>
                <option value="76-100">76-100%</option>
                <option value="51-75">51-75%</option>
                <option value="26-50">26-50%</option>
                <option value="0-25">0-25%</option>
              </select>
            </div>

            <div class="question form-group" id="question-2">
              <label for="ep-patients">Do you use your ePrescribing system for adults, paediatrics or both?</label>
              <select name="ep-usage" id="ep-patients" class="form-control"  v-model="results.patient_type" required>
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
                <input type="radio" value=true class="radio-yes" name="lab-results-yes" id="lab-results-yes"  v-model="results.lab_results" checked>

                <label for="lab-results-no">No</label>
                <input type="radio" value=false class="radio-no" name="lab-results-no" id="lab-results-no"  v-model="results.lab_results">
              </span>
            </div>

            <div class="question form-group" id="question-5">
              <p class="med-history-label">Are you able to manually enter diagnosis and medical history into your test system?</p>
              <span class="radio-buttons">
                  <label for="med-history-yes">Yes</label>
                    <input type="radio" value=true class="radio-yes" name="med-history-yes" id="med-history-yes" v-model="results.med_history" checked>
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
                    med_history: ''
                },
                submitted: false
            }
        },
        methods: {
            resetForm: function () {
                this.$data.results = {};
                this.errors.clear();
            },
            onExitClick() {
            },
            onNextClick()  {
            }
        }
    }
</script>

<style scoped>

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

  #ep-system-form {
    margin-top: 40px;
    background-color: #cdf8ff;
    border: 1px solid #6b9bc7;
    padding: 20px;
    border-radius: 25px;
    margin: 0 auto;
    max-width: 950px;
  }

  #version {
    float: right;
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
