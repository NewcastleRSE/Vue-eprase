<template>

  <div>
    <div id="test-scenario">

      <p class="subtitle" v-if="assessment.debugMode"><{{prescription.id}} - Risk: {{prescription.risk_level}} ></p>

      <div class="prescription-info">
        <p>Prescribe the following medication to the specified patient using your normal prescribing practice, then answer the questions below.<br/></p>
        <p><strong>Patient:</strong> {{ getCurrentPatient }} </p>

        <table id="test-patient">
          <thead>
            <tr>
              <th>Drug</th>
              <th>Dose</th>
              <th>Route</th>
              <th>Frequency</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{prescription.drug_name}}</td>
              <td>{{prescription.drug_dose}}</td>
              <td>{{prescription.route}}</td>
              <td>{{prescription.drug_frequency}}</td>
              <td>{{prescription.duration}}</td>
            </tr>
          </tbody>
        </table>

        <table id="justification" v-if="prescription.justification">
          <tr><th>Indication</th><td>{{ prescription.justification }}</td></tr>
        </table>
      </div>
      <div>
        <div class="questionnaire">
          <h4>Questions</h4>
          <div class="question form-group" id="question-1">
            <div class="outcomes">Which of the following best describes the response from the system when you attempted to prescribe the specified drug?</div>

              <div class="radio-buttons">
                <div>
                   <input type="radio" name="outcome-radios" value="no-intervention" id="no-intervention" v-model="response.outcomes"  v-validate="'required'" >
                  <label for="no-intervention">You were able to complete the prescription (includes followed order sentence) <strong><em>without any additional user or system input</em></strong>. </label> <b-button v-b-tooltip.hover.right title="Tip: You placed the order for the new medicine using your normal processes, which may have included the selection of a provided order sentence and did not receive any advice or information from the electronic prescribing system. " variant="primary" class="category-tip">i</b-button>

                </div>
                <div>
                   <input type="radio" name="outcome-radios" value="order-set-overridden" id="order-set-overridden" v-model="response.outcomes">
                  <label for="order-set-overridden">You were able to complete the prescription, <strong><em>but had to override components of the order sentence</em></strong>.</label> <b-button v-b-tooltip.hover.right title="Tip: You placed the order for the new medicine but had to ignore, modify or override a provided order sentence to complete it" variant="primary" class="category-tip">i</b-button>
                </div>
                <div>
                   <input type="radio" name="outcome-radios" value="intervention" id="intervention" v-model="response.outcomes">
                   <label for="intervention">You were able to complete the prescription, <strong><em>with system/user intervention</em></strong></label><b-button v-b-tooltip.hover.right title="Tip:  You placed the order and received some system advice or information in relation to  allergies, abnormal lab results, dosing, route, age of patient, therapeutic duplication, monitoring , contraindication or something other , that required you to take some action in order to continue. Please tell us more about what happened,  using the tick box option descriptions  provided and / or the freehand comments box that will appear when you select  this response option. " variant="primary" class="category-tip">i</b-button>
                </div>
                <div>
                   <input type="radio" name="outcome-radios" value="order-prevented" id="order-prevented" v-model="response.outcomes">
                  <label for="order-prevented">Prevented from prescribing</label>
                </div>
                <div>
                   <input type="radio" name="outcome-radios" value="not-available" id="not-available" v-model="response.outcomes">
                   <label for="not-available">Medicine or formulary alternative not available in the system</label>
                </div>
             </div>

          </div>

          <div v-show="response.outcomes === 'intervention'" class="question" id="question-2">
            <div class="alert alert-warning" role="alert">If the system was to respond to the challenge, please indicate what category of intervention (e.g. dose, frequency dialogue) and the type of response i.e. alert (interruptive type, maybe a pop-up that requires  action) OR advisory (passive dialogue, maybe a banner message on the bottom of the screen) you would expect.</div>

            <p>You have received advice or information concerning (check all that apply).</p>

            <table id="drug-table" class="table-striped">
              <tbody>
              <tr><td><input type="checkbox" class="custom-checkbox" value="drug-age" id="drug-age" v-model="response.intervention_type"></td><td><label class="category-label" for="drug-age">Drug and patient age</label> <b-button v-b-tooltip.hover.right title="Tip: Drug contraindication (or dose adjustment) based on patient age" variant="primary" class="category-tip">i</b-button></td></tr>
              <tr><td><input type="checkbox" class="custom-checkbox" value="drug-dose" id="drug-dose" v-model="response.intervention_type"></td><td><label class="category-label" for="drug-dose">Drug dose level</label> <b-button v-b-tooltip.hover.right title="Tip: Specified dose for prescribed drug is outside recommended dose range for any patient (includes doses that are too high or too low)" variant="primary" class="category-tip">i</b-button></td></tr>
              <tr><td><input type="checkbox" class="custom-checkbox" value="drug-formulary" id="drug-formulary" v-model="response.intervention_type"></td><td><label class="category-label" for="drug-formulary">Drug formulary</label> <b-button v-b-tooltip.hover.right title="Tip: Drug is not recommended for prescribing according to local guidance" variant="primary" class="category-tip">i</b-button></td></tr>
              <tr><td><input type="checkbox" class="custom-checkbox" value="drug-interaction" id="drug-interaction" v-model="response.intervention_type"></td><td> <label class="category-label" for="drug-interaction">Drug interaction</label> <b-button v-b-tooltip.hover.right title="Tip: Interaction between prescribed drug and one or more concomitant prescribed drug(s) may result in patient harm" variant="primary" class="category-tip">i</b-button></td></tr>
              <tr><td><input type="checkbox" class="custom-checkbox" value="drug-allergies" id="drug-allergies" v-model="response.intervention_type"></td><td> <label class="category-label" for="drug-allergies">Drug allergies</label> <b-button v-b-tooltip.hover.right title="Tip: Allergy or intolerance to prescribed drug (or another drug in the same category) documented" variant="primary" class="category-tip">i</b-button></td></tr>
              <tr><td><input type="checkbox" class="custom-checkbox" value="drug-duplication" id="drug-duplication" v-model="response.intervention_type"></td><td><label class="category-label" for="drug-duplication">Drug duplication</label> <b-button v-b-tooltip.hover.right title="Tip: Specified drug prescribed more than once for the same patient" variant="primary" class="category-tip">i</b-button></td></tr>
              <tr><td><input type="checkbox" class="custom-checkbox" value="drug-disease" id="drug-disease" v-model="response.intervention_type"></td><td><label class="category-label" for="drug-disease">Drug disease</label><b-button v-b-tooltip.hover.right title="Tip: Drug contraindication (or dose adjustment) based on patient diagnosis or co-morbidities" variant="primary" class="category-tip">i</b-button></td></tr>
              <tr><td><input type="checkbox" class="custom-checkbox" value="drug-ommissions" id="drug-ommissions" v-model="response.intervention_type"></td><td><label class="category-label" for="drug-ommissions">Drug omissions</label> <b-button v-b-tooltip.hover.right title="Tip: Critical medication NOT prescribed based upon patient diagnosis or other prescribed medication" variant="primary" class="category-tip">i</b-button></td></tr>
              <tr><td><input type="checkbox" class="custom-checkbox" value="theraputic_duplication" id="theraputic_duplication" v-model="response.intervention_type"></td><td><label class="category-label" for="theraputic_duplication">Theraputic duplication</label> <b-button v-b-tooltip.hover.right title="Tip: Two different medicines prescribed simultaneously with the same or similar therapeutic aims" variant="primary" class="category-tip">i</b-button></td></tr>
              <tr><td><input type="checkbox" class="custom-checkbox" value="drug-lab" id="drug-lab" v-model="response.intervention_type"></td><td><label class="category-label" for="drug-lab">Lab results/monitoring/TDM</label> <b-button v-b-tooltip.hover.right title="Tip: Drug contraindication (or dose adjustment) based on laboratory test result (includes therapeutic drug monitoring, direct notification/ display of abnormal labs; dosing suggestions; monitoring advisory or monitoring order request)" variant="primary" class="category-tip">i</b-button></td></tr>
              <tr><td><input type="checkbox" class="custom-checkbox" value="drug-brand" id="drug-brand" v-model="response.intervention_type"></td><td><label class="category-label" for="drug-route">Drug brand</label> <b-button v-b-tooltip.hover.right title="Tip: Drug that must be prescribed by BRAND rather than using generic name" variant="primary" class="category-tip">i</b-button></td></tr>
              <tr><td><input type="checkbox" class="custom-checkbox" value="drug-route" id="drug-route" v-model="response.intervention_type"></td><td><label class="category-label" for="drug-route">Incorrect route</label> <b-button v-b-tooltip.hover.right title="Tip: Specified route is contraindicated for drug and/ or  dose prescribed" variant="primary" class="category-tip">i</b-button></td></tr>
              <tr><td><input type="checkbox" class="custom-checkbox" value="missing-field" id="missing-field" v-model="response.intervention_type"></td><td><label class="category-label" for="missing-field">Missing field alert</label> <b-button v-b-tooltip.hover.right title="Tip: Unable to complete prescription as information provided incomplete (e.g. indication or duration of treatment omitted)" variant="primary" class="category-tip">i</b-button></td></tr>

              </tbody>
            </table>

            <div id="selected-type">
              <select id="intervention-select"  class="form-control" v-model="response.selected_type" >
                <option value="alert">Alert</option>
                <option value="advisory">Advisory</option>
                <option value="alert">Both</option>
              </select>

              <label for="intervention-select"><strong>Please indicate whether intervention was an alert or advisory:</strong> </label>
            </div>


            <textarea type="text" class="form-control" name="input" id="patient-intervention" v-model="response.qualitative_data" placeholder="Please tell us about the system response..." maxlength="500"></textarea>
          </div>

          <div id="discontinue">Please discontinue the prescription order before proceeding to the next scenario.</div>

          <input type="hidden" id="test_id" v-model="response.prescription=prescription.id" />
          <input type="hidden" id="result_score" v-model="response.result_score=getResult" />
          <input type="hidden" id="risk_level" v-model="response.risk_level=prescription.risk_level" />

        </div>
      </div>
    </div>  <!-- end box -->

    <div v-show="doneEnabled" class="text">Congratulations, you have reached the end of the scenarios!</div>


    <div class="form-group footer" align="center">
      <div class="buttons">
        <button v-show='nextEnabled' id="next-button" type="button" class="scenario-btn btn btn-primary" @click="onNextClick()" :disabled="isFormInvalid">Next</button>
        <button v-show='doneEnabled' id="done-button" type="button" class="scenario-btn btn btn-primary" @click="onDoneClick()">Done</button>
      </div>
    </div>

  </div>

</template>

<script>

    import { dataService } from '../services/data.service';
    import { settings } from '../settings'

    export default {
        name: "ScenarioPrescription",
        components: {

        },
        computed : {
            // vue allows the use of 'this' with computed....
            prescription() {
                // this needs to return the first test from testList in store
                let prescription = this.$store.state.testList;
                return prescription.testList[this.getPresTestIndex];
            },
            getCurrentPatient() {
                let testPatientId = this.prescription['patient'].code;
                return localStorage.getItem(testPatientId);
            },
            isFormInvalid() {

              if(!this.response.outcomes){
                return true;
              }
              else if(this.response.outcomes === 'intervention' &&  !this.response.selected_type){
                return true
              }

            },
            getPresTestIndex() {
                return this.$store.state.testIndex;
            },
            user() {
                return this.$store.state.authentication.user;
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
                    time_taken: '',
                    prescription : '',
                    risk_level: '',
                    selected_type: '',
                    qualitative_data : '',
                    intervention_type : []
                },
                result : null,
                result_score : '',
                showInterventions: false,
                completed: false,
                nextEnabled: true,
                doneEnabled: false,
                startTime: '',
                numTests : parseInt(localStorage.getItem('numPrescriptions'))  + settings.numConfigError
            }
        },
        methods : {
            getResult(risk_level, outcome) {

                let result = '';

                // get outcome and result_score
                // if no drug is available, don't bother with the risk level, as all results are null
                if (outcome === 'not-available'){
                    result = 'Null';
                }
                else if(risk_level === 'Extreme'){

                    if(outcome === 'no-intervention'){
                      result = 'No Mitigation/Fail';
                    }
                    else if (outcome === 'order-prevented'){
                      result = 'Good Mitigation/Pass';
                    }
                    else if (outcome === 'order-set-overridden' || outcome === 'intervention'){
                      result = 'Some Mitigation';
                    }
                }
                else if(risk_level === 'High'){

                    if(outcome === 'no-intervention'){
                      result = 'No Mitigation/Fail';
                    }
                    else if (outcome === 'order-prevented'){
                      result = 'Over Mitigation';
                    }
                    else if (outcome === 'order-set-overridden' || outcome === 'intervention'){
                     result = 'Good Mitigation/Pass';
                    }
                }
                else if(risk_level === 'Low'){

                    if(outcome === 'no-intervention'){
                      result = 'Good Mitigation/Pass';
                    }
                    else if (outcome === 'order-prevented'){
                      result = 'Over Mitigation';
                    }
                    else if (outcome === 'order-set-overridden' || outcome === 'intervention'){
                      result = 'Over Mitigation';
                    }
                }

                return result;
            },
            getResultScore(result) {

                let result_score = 0;

                if (result === 'Over Mitigation'){
                    result_score = 15;
                }
                if(result === 'Good Mitigation/Pass'){
                    result_score = 10;
                }
                else if (result === 'Some Mitigation'){
                    result_score = 5;
                }
                else if (result === 'No Mitigation/Fail'){
                    result_score = 1;
                }
                return result_score;
            },
            onNextClick()  {
                this.saveData();
              // catch is needed as router keeps going to the same location and causes error
                this.$router.push('/assessmentscenarios').catch(err => {});
            },
            saveData() {
                this.submitted = true;
                this.$validator.validate().then(valid => {
                    if (valid) {

                        let endTime = new Date();
                        let elapsedTime = endTime.getTime() - this.startTime.getTime();
                        this.response.time_taken = elapsedTime/1000;

                        const prescription = this.response.prescription;
                        const outcome = this.response.outcomes;
                        const other = this.response.other;
                        const intervention_type = this.response.intervention_type.toString();
                        const selected_type = this.response.selected_type;
                        const time_taken = this.response.time_taken;
                        const qualitative_data = this.response.qualitative_data;
                        const risk_level = this.prescription.risk_level;
                        const result = this.getResult(risk_level, outcome);
                        const result_score = this.getResultScore(result);
                        const index = this.getPresTestIndex;
                        const completed = this.completed;
                        const { dispatch } = this.$store;
                        if (time_taken){
                            dispatch('savePrescriptionData', {prescription, outcome, other, intervention_type, selected_type, risk_level, result, result_score, time_taken, qualitative_data, index, completed });
                        }
                        // reset data fields
                        this.resetDataFields();
                        this.clearCheckBoxes();
                    }
                });
            },
            onDoneClick() {
                // this is now true
                this.completed = true;
                let id = localStorage.getItem('assessmentId');

                // save the last test data
                this.saveData();

                // audit
                const user_id =  this.user.user_id;
                dataService.audit('Completed scenarios', '/assessmentscenarios');
                this.$router.push('/assessmentresults?ID='+ id);
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
                this.response.other = '';
                this.response.risk_level = '';
                this.response.intervention_type = [];
                this.response.selected_type = '';
                this.response.qualitative_data = '';
                this.test_id = '';
              //  this.result_score = null;
            }
        },
        created : function() {
            this.startTime = new Date();
        },
        beforeUpdate: function() {
            let index = this.$store.state.testIndex;
            if (index === (this.numTests -1) || index > (this.numTests -1)) {
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

  .outcomes {
    padding-bottom: 20px;
    font-weight: bold;
  }

  .question p {
    margin-top: 20px;
    margin-bottom: 20px;
    text-align: left;
  }

  #question-2 {
    padding-bottom: 30px;
    text-align: left;
  }

  #question-2 p {
    margin-left: 10px;
    padding-top: 20px;
  }

  #test-patient {
    padding: 15px;
    margin-top: 20px;
    margin-bottom: 20px;
    width: 100%;
    border: 1px solid #b0aeb2;
    border-collapse: collapse;
  }

  #test-patient th {
    border:  1px solid #7f7d81;
    background-color: #ffffff;
    padding: 5px;
  }

  #test-patient td {
    width: 150px;
    font-size: 16px;
    background-color: #f5f5f5;
    padding: 5px;
    border:  1px solid #b0aeb2;
  }
  #drug-table td{
    text-align: left;
    padding: 3px 5px 3px 5px;
  }

  td {
    width: 300px;
    font-weight: normal;
    font-size: 14px;
  }

  #drug-table tr td:first-child {
      width: 50px;
  }

  .question table {
    width: 100%;
  }

  .question td {
    width: auto;
    padding-left: 10px;
    padding-right: 10px;
    text-align: right;
  }

  .justification th {
    width: 20%;
  }

  .justification td {
    width: 80%;
  }

  button:disabled {
    background-color: dimgray;
  }

  #discontinue {
    padding-top: 25px;
    font-weight: bold;
  }

  .assessment p {
    text-align: left;
  }

  #patient-intervention {
    width: 100%;
    height: 100px;
  }

  button {
    width: 30px;
    height: 20px;
    margin: 0 10px;
    line-height: 0.5em;
    font-weight: bold;
  }

  .scenario-btn {
    background-color: #02b9b8;
    border: 0;
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
    padding-left: 10px;
  }

  #selected-type {
    padding: 30px 0;
  }

  select {
    width: 220px;
    float: right;
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
    height: 100px;
    padding: 15px;
    margin-bottom: 20px;
    width: 100%;
  }

  .form-control.is-invalid, .form-control:valid, .form-control.is-invalid,  .form-control:invalid {
    background: none;
    background-color: #fff;
  }

  .form-control.is-invalid {
      border-color: #ced4da;
  }

  .category-tip {
      background-color: #07818e;
      color: #fff;
      font-size: 0.9em;
  }

  .category-label {
      margin-top: 5px;
      font-size: 1.2em;
  }

  .custom-checkbox {
      transform: scale(1.5);
      -webkit-transform: scale(1.5);
      margin-left: 10px;
  }

  input[type=radio] {
       transform: scale(1.5);
      -webkit-transform: scale(1.5);
      margin-left: 10px;
  }

</style>
