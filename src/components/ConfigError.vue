<template>

  <div>
    <h5>{{ config.description }}</h5>
    <div>
      <Form ref="configErrorForm" v-slot="{ meta: formMeta }" :validation-schema="validationSchema">

        <div class="form-check mb-2">
          <Field v-slot="{ field }" v-model="response.result" type="radio" name="config-err-radios"
            id="config-err-radio-yes" value="yes">
            <input v-bind="field" type="radio" name="config-err-radios" value="yes" class="form-check-input">
          </Field>
          <label class="form-check-label" for="config-err-radio-yes">Yes</label>
        </div>

        <div class="form-check mb-2">
          <Field v-slot="{ field }" v-model="response.result" type="radio" name="config-err-radios"
            id="config-err-radio-no" value="no">
            <input v-bind="field" type="radio" name="config-err-radios" value="no" class="form-check-input">
          </Field>
          <label class="form-check-label" for="config-err-radio-no">No</label>
        </div>

        <input type="hidden" id="config-err-code" :value="config.configErrorCode">
      </Form>

    </div>
  </div>

</template>

<script>

import { settings } from "../settings"
import { Form, Field, ErrorMessage } from 'vee-validate'

export default {
  name: "ConfigError",
  props: {
    config: {}
  },
  components: {
    Form,
    Field,
    ErrorMessage
  },
  computed: {
    getPreviousPatient() {
      let tests = this.$store.state.testList
      let previousPatientId = tests.testList[0].patient.patient_id
      return localStorage.getItem(previousPatientId)
    },
    configError() {
      let configError = this.$store.state.testList
      return configError.testList[this.getPresTestIndex]
    },
    getPresTestIndex() {
      return this.$store.state.testIndex
    },
    isFormInvalid() {
      if (!this.response.result) {
        return true
      }
    }
  },
  data() {
    return {
      response: {
        result: '',
        time_taken: ''
      },
      startTime: '',
      index: '',
      numTests: parseInt(localStorage.getItem('numPrescriptions')) + settings.numConfigError,
      nextEnabled: true
    }
  },
  methods: {
    onNextClick() {
      this.saveData()
      // catch is needed as router keeps going to the same location and causes error
      this.$router.push('/assessmentscenarios').catch(err => { })
    },
    saveData() {
      this.submitted = true
      this.$validator.validate().then(valid => {
        if (valid) {

          let endTime = new Date()
          let elapsedTime = endTime.getTime() - this.startTime.getTime()
          this.response.time_taken = elapsedTime / 1000
          const test_id = document.getElementById("test_id").value
          const result = this.response.result
          const time_taken = this.response.time_taken
          const index = this.index

          const { dispatch } = this.$store
          if (time_taken) {
            dispatch('saveConfigError', { test_id, result, time_taken, index })
          }
        }
      })
    }
  },
  created: function () {
    this.startTime = new Date()
    this.index = this.$store.state.testIndex
    this.response.test_id = this.$store.state.testList.testList[this.index].configErrorCode
  },
  beforeUpdate: function () {
    let index = this.$store.state.testIndex
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
  float: left;
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
