<template>

    <div id="test-scenario">

      <div class="config-error-info">
        <p>
          Are you still able to access the patient record for <strong>{{ getPreviousPatient }}</strong>?<br/><br/>
          (Click 'No' if you had to close the patient record to continue or if the system closed it for you automatically.
          Click 'Yes' if you manually closed it but were not required to do so by the system.)
        </p>
      </div>
      <div align="center">
        <div class="questionnaire">
          <h4>Questions</h4>
          <form>
            <div class="question form-group" id="question-1">
              <p class="recordlabel">Was the patient record still open?</p>
              <span class="radio-buttons">
          <label for="radio-yes" class="radio-label">Yes</label>
            <input type="radio" value=1 id="radio-yes" name="patientrecord" v-model="response.result" v-validate="'required'">

          <label for="radio-no" class="radio-label">No </label>
            <input type="radio" value=0 id="radio-no" name="patientrecord" v-model="response.result">
        </span>
            </div>
            <div class="assessment">
              <p>Note any intervention from the system using the box below.</p>
              <div align="center">
                <div class="alert alert-warning" role="alert">
                  To optimise the use of this tool please record ALL types of guidance that appears on your system screen
                </div>
                <textarea type="text" name="input" id="patient-intervention" class="form-control" v-model="response.qualitative_data" placeholder="Enter notes here..." maxlength="500"></textarea>
              </div>
            </div>
          </form>

        </div>
      </div>

      <div class="form-group footer" align="center">
        <div class="buttons">
          <button type="button" class="scenario-btn btn btn-primary visible" id="next-button" @click="onNextClick()" :disabled="isFormInvalid">Next</button>
        </div>
      </div>

  </div>

</template>

<script>

    export default {
        name: "ConfigError",
        components: {
        },
        computed: {
            getPreviousPatient() {
                let tests = this.$store.state.testList;
                let previousPatientId = tests.testList[0].patient_id;
                return localStorage.getItem(previousPatientId);
            },
            isFormInvalid() {
                if(!this.response.result){
                    return true;
                }
            },
            getPresTestIndex() {
                return this.$store.state.testIndex;
            }
        },
        data() {
            return {
                response: {
                    test_id : 'C001',
                    result: '',
                    qualitative_data: '',
                    time_taken: ''
                },
                startTime: ''
            }
        },
        methods : {
            onNextClick()  {
                this.saveData();
                this.$router.push('/assessmentscenarios');
            },
            saveData() {
                this.submitted = true;
                this.$validator.validate().then(valid => {
                    if (valid) {

                        let endTime = new Date();
                        let elapsedTime = endTime.getTime() - this.startTime.getTime();
                        this.response.time_taken = elapsedTime/1000;

                        const test_id = this.response.test_id;
                        const risk_score = 0;
                        const result_score = 0;
                        const result = this.response.result;
                        const time_taken = this.response.time_taken;
                        const qualitative_data = this.response.qualitative_data;
                        const index = this.getPresTestIndex;

                        const { dispatch } = this.$store;
                        if (time_taken){
                            dispatch('saveConfigError', {test_id, risk_score, result_score, result, time_taken, qualitative_data, index });
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

  #test-scenario {
    width: 100%;
    padding: 20px 0px;
  }

  .config-error-info {
    margin-bottom: 40px;
  }

  .config-error-info p {
    text-align: left;
  }

  .radio-label {
    padding-left: 20px;
    padding-right: 5px;
  }

  .questionnaire {
    max-width: 890px;
    margin-top: 20px;
    margin-bottom: 30px;
  }

  .question p {
    margin-bottom: 20px;
    text-align: left;
  }

  button:disabled {
    background-color: dimgray;
  }

  .assessment {
    padding-top: 25px;
  }


  #patient-intervention {
    width: 100%;
    height: 100px;
  }

  .recordlabel {
    font-weight: 700;
    max-width: 400px;
    display: inline-block;
    float:left;
  }

  #radio-yes {
    width: 12px;
  }

  #radio-no {
    width: 12px;
  }

  .radio-buttons {
    margin-left: 20px;
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

  input[type=radio] {
    margin: 0;
  }

  .alert-warning {
    background-color: #f6ecb8;
    border-color: #ffd47d;
  }

  .scenario-btn {
    background-color: #02b9b8;
    border: 0;
  }



</style>
