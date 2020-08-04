<template>

    <div id="test-scenario">

      <div class="config-error-info">
        <p>
          {{ configError.description }}
        </p>
      </div>
      <div align="center">
        <div class="questionnaire">
          <form>
              <span class="radio-buttons">
          <label for="radio-yes" class="radio-label">Yes</label>
            <input type="radio" value=1 id="radio-yes" name="patientrecord" v-model="response.result" v-validate="'required'">

          <label for="radio-no" class="radio-label">No </label>
            <input type="radio" value=0 id="radio-no" name="patientrecord" v-model="response.result">
        </span>

            <input type="hidden" id="test_id" v-model="response.test_id=configError.configErrorCode" >
          </form>

        </div>
      </div>

      <div class="form-group footer" align="center">
        <div class="buttons">
          <button v-show='nextEnabled' id="next-button" type="button" class="scenario-btn btn btn-primary" @click="onNextClick()" :disabled="isFormInvalid">Next</button>
        </div>
      </div>

  </div>

</template>

<script>

    import {settings} from "../settings";

    export default {
        name: "ConfigError",
        components: {
        },
        computed: {
            getPreviousPatient() {
                let tests = this.$store.state.testList;
                let previousPatientId = tests.testList[0].patient.patient_id;
                return localStorage.getItem(previousPatientId);
            },
            configError() {
              let configError = this.$store.state.testList;
              return configError.testList[this.getPresTestIndex];
            },
          getPresTestIndex() {
            return this.$store.state.testIndex;
          },
            isFormInvalid() {
                if(!this.response.result){
                    return true;
                }
            }
        },
        data() {
            return {
                response: {
                    test_id : '',
                    result: '',
                    time_taken: ''
                },
                startTime: '',
                index: '',
                numTests : settings.numPrescriptions + settings.numConfigError,
                nextEnabled: true
            }
        },
        methods : {
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
                        const test_id = this.response.test_id;
                        const result = this.response.result;
                        const time_taken = this.response.time_taken;
                        const index = this.index;

                        const { dispatch } = this.$store;
                        if (time_taken){
                            dispatch('saveConfigError', {test_id, result, time_taken, index });
                        }
                    }
                });
            }
        },
        created : function() {
            this.startTime = new Date();
            this.index = this.$store.state.testIndex;
            this.response.test_id = this.$store.state.testList.testList[this.index].configErrorCode;
        },
        beforeUpdate: function() {
          let index = this.$store.state.testIndex;
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
    width: 100%;
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
