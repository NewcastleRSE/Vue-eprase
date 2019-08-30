<template>
  <div id="page">

    <Header />

    <div id="test-scenario">

      <p class="subtitle" v-if="assessment.debugMode"><{{prescription.id}} - Risk: {{prescription.risk_score}}></p>

      <div class="prescription-info">
        <p>Prescribe the following medication to the specified patient using your normal prescribing practice, then answer the questions below.<br/></p>
        <p><strong>Patient:</strong> {{ getCurrentPatient.first_name}} {{ getCurrentPatient.surname}}</p>
        <table id="test-patient">
          <tr>
            <td><strong>Drug</strong></td>
            <td><strong>Dose</strong></td>
            <td><strong>Route</strong></td>
            <td><strong>Frequency</strong></td>
            <td><strong>Duration</strong></td>
          </tr>
          <tr>
            <td>{{prescription.drug_name}}</td>
            <td>{{prescription.drug_dose}}</td>
            <td>{{prescription.route}}</td>
            <td>{{prescription.drug_frequency}}</td>
            <td>{{prescription.duration}}</td>
          </tr>
        </table>
      </div>
      <div>
        <div class="questionnaire">
          <h4>Questions</h4>
          <div class="question" id="question-1">
            <label for="selector-1">What of the following best describes the response from the system when you attempted to prescribe the specified drug?</label>
            <select name="singleSelect" id="selector-1" class="form-control" @change="onSelect1()" v-model="response.response1">
              <option :value="undefined" selected disabled hidden>Select a Response...</option>
              <option v-for="response in outcomeResponses" :value="response.display">{{response.display}}</option>
            </select>

          </div>
          <div class="question" id="question-2" hidden>
            <p>What was the stated reason(s) for the intervention? Please choose any that apply.</p>

            <div class="intervention bottom-border" v-for="check in checkBoxList">
              <label>{{check.name}}</label>
              <input type="checkbox" :value="check.name" v-model="check.selected">
              <div id="response-other" v-if="check.name=='Other Please Specify' && check.selected">
                <label id="other"> Other: </label>
                <input type="text" id="advice-other" class="form-control" v-model="response.other" minlength="3" maxlength="50">
                <div v-if="other.invalid && other.touched" class="alert alert-danger">
                  Other is required with a minimum of 3 characters
                </div>
              </div>
            </div>

          </div>
          <div class="question" id="question-3" hidden>
            <label for="selector-2">Were you given any option to override and complete the prescription?</label>
            <select name="singleSelect" id="selector-2" class="form-control" @change="onSelect3()" v-model="response.response3">
              <option :value="undefined" selected disabled hidden>Select a Response...</option>
              <option v-for="response in interventionOverrides" :value="response.display">{{response.display}}</option>
            </select>
          </div>
          <div class="assessment">
            <div>
              <label for="patient-intervention">Note any intervention from the system using the box below.</label>
              <div class="alert alert-warning" role="alert">
                To optimise the use of this tool please record ALL types of guidance that appears on your system screen in the comments boxes provided
              </div>
              <textarea type="text" name="input" id="patient-intervention" class="form-control" v-model="response.qualitative_data" placeholder="Enter notes here..." maxlength="250"></textarea>
            </div>
          </div>
          <p class="subtitle" v-if="assessment.debugMode">< Results Score: {{ getResultScore }} ></p>
        </div>
      </div>
    </div>  <!-- end box -->


    <div class="form-group footer" align="center">
      <div class="buttons">
        <button type="button" class="btn btn-primary" @click="onExitClick()">Exit</button>
        <button type="button" id="next-button" class="btn btn-primary visible" @click="onNextClick()" disabled>Next</button>
        <button type="button" id="done-button" class="btn btn-primary invisible" @click="onDoneClick()" disabled>Done</button>
      </div>
    </div>

  </div>

</template>

<script>

    import jsoninterventions from '../json/interventions.json';
    import jsonoutcomes from '../json/outcomes.json';
    import jsonoverrides from '../json/overrides.json';
    import jsoncheckboxes from '../json/checkboxes.json';

    import { dataService } from '../services/data.service';
    import { patientService } from '../services/patient.service';
    import Header from './Header';

    export default {
        name: "Prescription",
        components: {
            Header
        },
        computed : {
            getCurrentPatient() {
                return this.$store.state.patientIndex;
            },
            getResultScore() {
                return 0;
            }
        },
        data() {
            return {
                assessment: {
                    debugMode: true,
                    isConfigErrorTest: false
                },
                prescription: {
                    id : null,
                    risk_score : null,
                    drug_name : null,
                    drug_dose: null,
                    route: null,
                    drug_frequency : null,
                    duration : null
                },
                response: {
                    response1 : '',
                    response2 : '',
                    response3 : ''
                },
                outcomeResponses : jsonoutcomes,
                interventionDetails : jsoninterventions,
                interventionOverrides : jsonoverrides,
                checkBoxList : jsoncheckboxes,
                startTime: ''
            }
        },
    }
</script>

<style scoped>

  #page {
    text-align: left;
  }

  .subtitle {
    text-align: center;
    color: darkgrey;
  }

  .prescription-info {
    width: 100%;
    margin-bottom: 40px;
  }

  .prescription-info table {
    width: 100%;
  }

  .prescription-info td {
    border: solid grey 1px;
    font-size: 14px;
    padding: 2px 10px;
    width: auto;
  }

  .prescription-info p {
    text-align: left;
  }

  .prescription {
    margin-top: 30px;
    margin-bottom: 30px;
  }

  .questionnaire {
    width: 100%;
    margin-top: 10px;
    margin-bottom: 40px;
  }


  .question p {
    margin-top: 20px;
    margin-bottom: 20px;
    text-align: left;
  }

  #question-2 {
    padding-bottom: 30px;
  }

  #question-2 p {
    margin-left: 10px;
    padding-top: 20px;
  }

  #test-scenario {
    border: 1px solid #c2c2c2;
    padding: 20px;
  }


  #test-patient {
    padding: 15px;
    margin-top: 20px;
    margin-bottom: 20px;
    width: 600px;
    border: 1px solid #6b9bc7;
  }


  #test-patient td {
    width: auto;
    font-size: 16px;
    background-color: #cdf8ff;
    padding: 5px;
    border:  1px solid #6b9bc7;
  }

  #selector-1, #selector-2 {
    width: 250px;
  }

  #selector-2 {
    width: 280px;
  }

  td {
    width: 300px;
    font-weight: normal;
    font-size: 14px;
  }

  .question table {
    width: auto;
  }

  .question td {
    width: auto;
    padding-left: 10px;
    padding-right: 10px;
    text-align: right;
  }

  button:disabled {
    background-color: dimgray;
  }

  .assessment {
    padding-top: 25px;
  }

  .assessment p {
    text-align: left;
  }

  #patient-intervention {
    width: 600px;
    height: 100px;
  }

  button {
    height: 40px;
    width: 100px;
    margin: 10px 0px;
    font-size: 1.2em;
    margin: 0 50px;
  }

  .visible {
    visibility: visible;
  }
  .invisible {
    visibility: hidden;
  }

  .footer {
    margin-top: 10px;
    margin-bottom: 40px;
  }

  .footer p {
    padding-bottom: 10px;
  }

  label {
    text-align: left;
    max-width: 550px;
  }

  select {
    width: 200px;
    margin-right: 35px;
    float: right;
  }

  .intervention {
    text-align: left;
    padding: 5px 0px;
    /* border-bottom: 1px solid #c2c2c2; */
    max-width: 95%;
  }

  .intervention label {
    max-width: 300px;
    margin-bottom: 0;
    line-height: 1.2em;
  }

  .intervention input[type=checkbox] {
    height: 12px;
    position: absolute;
    left: 50%;
  }

  #response-other {
    padding: 40px 0;
    text-align: left;
  }

  #question-1 {
    text-align: left;
  }

  .bottom-border {
    border-bottom: 1px solid #c2c2c2;
  }

  .alert {
    height: 40px;
    width: 450px;
    padding: 10px;
  }

  .alert-warning {
    background-color: #f6ecb8;
    border-color: #ffd47d;
    height: 50px;
    padding: 15px;
    margin-bottom: 20px;
    width: 100%;
  }

</style>
