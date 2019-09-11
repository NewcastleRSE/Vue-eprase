<template>

  <div >
    <div id="test-scenario">

      <p class="subtitle" v-if="assessment.debugMode"><{{prescription.id}} - Risk: {{prescription.risk_score}}></p>

      <div class="prescription-info">
        <p>Prescribe the following medication to the specified patient using your normal prescribing practice, then answer the questions below.<br/></p>
        <p><strong>Patient:</strong> {{ getCurrentPatient }} </p>

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
            <select name="singleSelect" id="selector-1" class="form-control" v-model="response.outcomes" v-validate="{required: true, min: 1 }" >
              <option value="" >Select an Response...</option>
              <option v-for="response in outcomeResponses" :value="response.display">{{response.display}}</option>
            </select>

          </div>
          <div v-show="response.outcomes === 'Intervention'" class="question" id="question-2">
            <p>What was the stated reason(s) for the intervention? Please choose any that apply.</p>

            <div class="intervention bottom-border" v-for="check in checkBoxList">
              <label>{{check.name}}</label>
              <input type="checkbox" :value="check.name" v-model="check.selected">

              <div v-show="check.name === 'Other Please Specify' && check.selected" id="response-other">
                <label id="other"> Other: </label>
                <input type="text" id="advice-other" class="form-control" v-model="response.other" minlength="3" maxlength="50">
                <div v-if="response.other.invalid && response.other.touched" class="alert alert-danger">
                  Other is required with a minimum of 3 characters
                </div>
              </div>
            </div>

          </div>
          <div v-show="response.outcomes === 'Intervention'" class="question" id="question-3">
            <label for="selector-2">Were you given any option to override and complete the prescription?</label>
            <select name="singleSelect" id="selector-2" class="form-control" v-model="response.overrides">
              <option value="">Select an Response...</option>
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

          <input type="hidden" id="test_id" v-model="response.test_id=prescription.id" />
          <input type="hidden" id="result_score" v-model="response.result_score=getResultScore" />
          <input type="hidden" id="risk_score" v-model="response.risk_score=prescription.risk_score" />

        </div>
      </div>
    </div>  <!-- end box -->


    <div class="form-group footer" align="center">
      <div class="buttons">
        <button type="button" class="btn btn-primary" @click="onExitClick()">Exit</button>
        <button v-show='nextEnabled' id="next-button" type="button" class="btn btn-primary" @click="onNextClick()" :disabled="isFormInvalid">Next</button>
        <button v-show='doneEnabled' id="done-button" type="button" class="btn btn-primary" @click="onDoneClick()">Done</button>
      </div>
    </div>

  </div>

</template>

<script>

    import jsoninterventions from '../json/interventions.json';
    import jsonoutcomes from '../json/outcomes.json';
    import jsonoverrides from '../json/overrides.json';
    import jsoncheckboxes from '../json/checkboxes.json';
    import { patientService } from '../services/patient.service';
    import Header from './Header';

    export default {
        name: "Prescription",
        components: {
            Header
        },
        computed : {
            // vue allows the use of 'this' with computed....
            prescription() {
                // this needs to return the first test from testList in store
                let prescription = this.$store.state.testList;
                return prescription.testList[this.getPresTestIndex];
            },
            getCurrentPatient() {
                let testPatientId = this.prescription.patient_id;
                return localStorage.getItem(testPatientId);
            },
            isFormInvalid() {
                return Object.keys(this.fields).some(key => this.fields[key].invalid);
            },
            getPresTestIndex() {
                return this.$store.state.testIndex;
            }
        },
        data() {
            return {
                assessment: {
                    debugMode: true,
                    isConfigErrorTest: false,
                },
                response: {
                    outcomes: '',
                    other: '',
                    overrides: '',
                    time_taken: '',
                    test_id : '',
                    risk_score : '',
                    interventions : [],
                    qualitative_data : ''
                },
                outcomeResponses: jsonoutcomes,
                interventionDetails: jsoninterventions,
                interventionOverrides: jsonoverrides,
                checkBoxList: jsoncheckboxes,
                result_score : null,
                showInterventions: false,
                completed: false,
                nextEnabled: true,
                doneEnabled: false,
                startTime: '',
                numTests : patientService.numPrescriptions
            }
        },
        methods : {
            getInterventions() {

                this.result_score = this.prescription.risk_score;
                console.log('Risk score ' + this.result_score);

                for (let index in this.checkBoxList) {
                    if(this.checkBoxList.hasOwnProperty(index)){
                        if (this.checkBoxList[index].selected === true) {
                            this.response.interventions.push({
                                display: this.checkBoxList[index].name,
                                score_value: this.checkBoxList[index].score_value
                            });
                            // add to interventionTotal
                            this.result_score += parseInt(this.checkBoxList[index].score_value);
                        }
                    }
                }
                console.log('Result score after interventions ' + this.result_score);
                return this.response.interventions;

            },
            getResultScore() {

                // get outcomes scoring
                if (this.response.outcomes === 'Intervention') {
                    this.result_score += -4;
                }
                else if (this.response.outcomes === 'Unable to Initiate Order'){
                    this.result_score += -10;
                }
                else {
                    this.result_score += 0;
                }
                console.log('Result score after outcome ' + this.result_score);
                // get overrides scoring
                if(this.response.overrides === 'Unable to Override'){
                    this.result_score += -3;
                }
                else if (this.response.overrides !== ''){
                    this.result_score += -1;
                }
                else {
                    this.result_score += 0;
                }
                console.log('Result score after override ' + this.result_score);
                return this.result_score;
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
                        this.response.time_taken = elapsedTime/1000;

                        const test_id = this.response.test_id;
                        const outcome = this.response.outcomes;
                        const other = this.response.other;
                        const override = this.response.overrides;
                        const time_taken = this.response.time_taken;
                        const qualitative_data = this.response.qualitative_data;
                        const risk_score = this.response.risk_score;
                        const interventions = this.getInterventions();
                        const result_score = this.getResultScore();
                        const index = this.getPresTestIndex;
                        const completed = this.completed;

                        const { dispatch } = this.$store;
                        if (time_taken){
                            dispatch('savePrescriptionData', {test_id, outcome, other, override, risk_score, result_score, time_taken, qualitative_data, interventions, index, completed });
                        }
                        // reset data fields
                        this.resetDataFields();
                        this.clearCheckBoxes();
                    }
                });
            },
            onDoneClick() {
                const { dispatch } = this.$store;
                dispatch('completePart4');
                this.$router.push('/assessmentresults');
            },
            clearCheckBoxes() {
                for (let index in this.checkBoxList) {
                    if(this.checkBoxList.hasOwnProperty(index)){
                        if (this.checkBoxList[index].selected === true) {
                            this.checkBoxList[index].selected = false;
                        }
                    }
                }
            },
            resetDataFields() {
                this.response.outcomes = '';
                this.response.overrides = '';
                this.response.qualitative_data = '';
                this.response.interventions = [];
                this.response.other = '';
                this.result_score = null;
            }
        },
        created : function() {
            this.startTime = new Date();
        },
        beforeUpdate: function() {
            let index = this.$store.state.testIndex;
            if (index === (this.numTests)) {
                this.nextEnabled = false;
                this.doneEnabled = true;
            }
        }
    }
</script>

<style scoped>

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

  .form-control.is-invalid, .form-control:valid, .form-control.is-invalid,  .form-control:invalid {
    background: none;
    background-color: #fff;
  }


</style>
