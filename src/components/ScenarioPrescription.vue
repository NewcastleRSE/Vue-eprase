<template>

  <div>

    <div class="patient-details">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title"> {{ getCurrentPatient }}
            <span class="patient-image">
              <img v-if="getCurrentPatientGender === 'male'" src="../assets/images/anon-male.png" />
              <img v-if="getCurrentPatientGender === 'female'" src="../assets/images/anon-female.png" />
            </span>
          </h5>
          <p class="card-text">Age: {{ prescription.patient.age }}</p>

        </div>
      </div>
    </div>

    <h5 v-if="debugMode"> {{ prescription.id }} - Risk: {{ prescription.risk_level }}</h5>

    <div>
      <p class="py-2">Prescribe the following medication to the specified patient using your normal prescribing
        practice, then
        answer the questions below.</p>

      <p class="fw-bold">Patient: {{ getCurrentPatientName }}</p>

      <table class="table table-striped">
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
            <td>{{ prescription.drug_name }}</td>
            <td>{{ prescription.drug_dose }}</td>
            <td>{{ prescription.route }}</td>
            <td>{{ prescription.drug_frequency }}</td>
            <td>{{ prescription.duration }}</td>
          </tr>
        </tbody>
      </table>

      <table class="table table-striped" v-if="prescription.justification">
        <tr>
          <th>Indication</th>
          <td>{{ prescription.justification }}</td>
        </tr>
      </table>
    </div>

    <div>
      <h4>Questions</h4>
      <Form ref="scenarioPrescriptionForm" v-slot="{ meta: formMeta }" :validation-schema="validationSchema">

        <div ref="question1">
          <h5 class="my-4">Which of the following best describes the response from the system when you attempted
            to prescribe the specified drug? <span class="required-field">*</span></h5>

          <div class="form-check mb-2">
            <Field v-slot="{ field, meta }" v-model="response.outcomes" type="radio" name="outcome-radios"
              id="no-intervention" value="no-intervention">
              <input v-bind="field" type="radio" name="outcome-radios" value="no-intervention" class="form-check-input">
            </Field>
            <label class="form-check-label" for="no-intervention">
              You were able to complete the prescription (includes followed order sentence)
              <span class="fw-bold">without any additional user or system input</span>
              <a class="icon-link" data-bs-toggle="tooltip" data-bs-placement="right" href="javascroipt:void(0)"
                data-bs-title="Tip: You placed the order for the new medicine using your normal processes, which may have included the selection of a provided order sentence and did not receive any advice or information from the electronic prescribing system">
                <i class="bi bi-info-circle-fill link-primary ms-2"></i>
            </a>
            </label>
          </div>

          <div class="form-check mb-2">
            <Field v-slot="{ field }" v-model="response.outcomes" type="radio" name="outcome-radios"
              id="order-set-overridden" value="order-set-overridden">
              <input v-bind="field" type="radio" name="outcome-radios" value="order-set-overridden"
                class="form-check-input">
            </Field>
            <label class="form-check-label" for="order-set-overridden">
              You were able to complete the prescription, <span class="fw-bold">but had to override components of the
                order sentence</span>
              <a class="icon-link" data-bs-toggle="tooltip" data-bs-placement="right" href="javascroipt:void(0)"
                data-bs-title="Tip: You placed the order for the new medicine but had to ignore, modify or override a provided order sentence to complete it">
                <i class="bi bi-info-circle-fill link-primary ms-2"></i>
              </a>
            </label>
          </div>

          <div class="form-check mb-2">
            <Field v-slot="{ field }" v-model="response.outcomes" type="radio" name="outcome-radios"
              id="intervention" value="intervention">
              <input v-bind="field" type="radio" name="outcome-radios" value="intervention" class="form-check-input">
            </Field>
            <label class="form-check-label" for="intervention">
              You were able to complete the prescription, <span class="fw-bold">with system/user intervention</span>
              <a class="icon-link" data-bs-toggle="tooltip" data-bs-placement="right" href="javascroipt:void(0)"
                data-bs-title="Tip: You placed the order and received some system advice or information in relation to  allergies, abnormal lab results, dosing, route, age of patient, therapeutic duplication, monitoring , contraindication or something other , that required you to take some action in order to continue. Please tell us more about what happened,  using the tick box option descriptions  provided and / or the freehand comments box that will appear when you select  this response option">
                <i class="bi bi-info-circle-fill link-primary ms-2"></i>
            </a>
            </label>
          </div>

          <div class="form-check mb-2">
            <Field v-slot="{ field }" v-model="response.outcomes" type="radio" name="outcome-radios"
              id="order-prevented" value="order-prevented">
              <input v-bind="field" type="radio" name="outcome-radios" value="order-prevented" class="form-check-input">
            </Field>
            <label class="form-check-label" for="order-prevented">
              Prevented from prescribing
            </label>
          </div>

          <div class="form-check mb-2">
            <Field v-slot="{ field }" v-model="response.outcomes" type="radio" name="outcome-radios"
              id="not-available" value="not-available">
              <input v-bind="field" type="radio" name="outcome-radios" value="not-available" class="form-check-input">
            </Field>
            <label class="form-check-label" for="not-available">
              Medicine or formulary alternative not available in the system
            </label>
          </div>

          <ErrorMessage name="outcome-radios" as="div" class="mt-2 text-danger text-center" v-slot="{ message }">
            {{ message }}
          </ErrorMessage>

        </div>
        <div ref="question2" v-if="response.outcomes === 'intervention'">
          <p class="bg-warning-subtle rounded p-2">If the system were to respond to the challenge, please indicate
            what category of intervention (e.g. dose, frequency dialogue) and the type of response i.e. alert
            (interruptive type, maybe a pop-up that requires action) OR advisory (passive dialogue, maybe a banner
            message on the bottom of the screen) you would expect.</p>
          <p>You have received advice or information concerning (check all that apply):</p>
          <table class="table table-striped w-50">
            <tbody>
              <tr v-for="intType in interventionTypeOptions">
                <td>
                  <Field v-slot="{ field }" v-model="response.intervention_type" type="checkbox" :id="intType.id"
                    name="intervention-type" :value="intType.id">
                    <input v-bind="field" type="checkbox" class="form-check-input" name="intervention-type"
                      :value="intType.id">
                  </Field>
                </td>
                <td>
                  <label class="category-label" for="intType.id">{{ intType.label }}</label>
                </td>
                <td>
                  <a class="icon-link" data-bs-toggle="tooltip" data-bs-placement="right" :data-bs-title="intType.tip">
                    <i class="bi bi-info-circle-fill link-primary ms-2"></i>
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="mt-4 mb-2">
            <label class="form-label" for="intervention-select"><h5>Please indicate whether intervention was an alert or
              advisory:</h5></label>
            <div class="bg-info-subtle rounded p-2">
              <div><span class="fw-bold">Advisory:</span> Information is provided which does not interrupt workflow or require action.</div>
              <div><span class="fw-bold">Alert:</span> Information is provided which interrupts work flow and/or requires action (pop-up boxes or requiring password entry).</div>
            </div>
            <div class="mt-3">
              <Field v-slot="{ field, meta }" v-model="response.selected_type" name="intervention-select"
                id="intervention-select">
                <select v-bind="field" class="form-select w-25" :class="meta.dirty ? (meta.valid ? 'is-valid' : 'is-invalid') : ''">
                  <option value="" disabled>Select Type...</option>
                  <option value="alert">Alert</option>
                  <option value="advisory">Advisory</option>
                  <option value="both">Both</option>
                </select>
              </Field>
              <ErrorMessage name="intervention-select" as="div" class="mt-2 text-danger text-center" v-slot="{ message }">
                {{ message }}
              </ErrorMessage>
            </div>                    
          </div>

          <div class="my-3">
            <label class="form-label" for="patient-intervention"><h5>Please tell us about the system response:</h5></label>
            <div>
              <Field v-slot="{ field, meta }" v-model="response.qualitative_data" name="patient-intervention"
                id="patient-intervention">
                <textarea v-bind="field" class="form-control w-25" maxlength="500" rows="5" :class="meta.dirty ? (meta.valid ? 'is-valid' : 'is-invalid') : ''"></textarea>
              </Field>
              <ErrorMessage name="patient-intervention" as="div" class="mt-2 text-danger text-center" v-slot="{ message }">
                {{ message }}
              </ErrorMessage>
            </div>
          </div>
        </div>

        <h5 class="mb-2">Please discontinue the prescription order before proceeding to the next scenario.</h5>

        <input type="hidden" id="test_id" v-model="prescription.id" />
        <input type="hidden" id="risk_level" v-model="prescription.risk_level" />

      </Form>

    </div>
  </div>
</template>

<script>

import { mapState } from 'pinia'
import { appSettingsStore } from '../stores/appSettings'
import { patientStore } from '../stores/patients'
import { Form, Field, ErrorMessage } from 'vee-validate'

export default {
  name: "ScenarioPrescription",
  props: {
    prescription: {}
  },
  components: {
    Form,
    Field,
    ErrorMessage
  },
  computed: {
    ...mapState(appSettingsStore, ['debugMode'], patientStore, ['savePrescriptionData']),
    getCurrentPatientName() {
      return this.prescription['patient'].first_name + ' ' + this.prescription['patient'].surname
    },
    getCurrentPatientGender() {
      return this.prescription['patient'].gender
    },
    getCurrentPatientDOB() {
      return this.prescription['patient'].dob
    },
  },
  data() {
    return {
      response: {
        outcomes: '',
        other: '',
        time_taken: '',
        prescription: '',
        risk_level: '',
        selected_type: '',
        qualitative_data: '',
        intervention_type: []
      },
      interventionTypeOptions: [
        { id: 'drug-age', label: 'Drug and patient age', tip: 'Tip: Drug contraindication (or dose adjustment) based on patient age' },
        { id: 'drug-dose', label: 'Drug dose level', tip: 'Tip: Specified dose for prescribed drug is outside recommended dose range for any patient (includes doses that are too high or too low)' },
        { id: 'drug-formulary', label: 'Drug formulary', tip: 'Tip: Drug is not recommended for prescribing according to local guidance' },
        { id: 'drug-interaction', label: 'Drug interaction', tip: 'Tip: Interaction between prescribed drug and one or more concomitant prescribed drug(s) may result in patient harm' },
        { id: 'drug-allergies', label: 'Drug allergies', tip: 'Tip: Allergy or intolerance to prescribed drug (or another drug in the same category) documented' },
        { id: 'drug-duplication', label: 'Drug duplication', tip: 'Tip: Specified drug prescribed more than once for the same patient' },
        { id: 'drug-disease', label: 'Drug disease', tip: 'Tip: Drug contraindication (or dose adjustment) based on patient diagnosis or co-morbidities' },
        { id: 'drug-ommissions', label: 'Drug omissions', tip: 'Tip: Critical medication NOT prescribed based upon patient diagnosis or other prescribed medication' },
        { id: 'therapeutic-duplication', label: 'therapeutic-duplication', tip: 'Tip: Two different medicines prescribed simultaneously with the same or similar therapeutic aims' },
        { id: 'drug-lab', label: 'Lab results/monitoring/TDM', tip: 'Tip: Drug contraindication (or dose adjustment) based on laboratory test result (includes therapeutic drug monitoring, direct notification/ display of abnormal labs; dosing suggestions; monitoring advisory or monitoring order request)' },
        { id: 'drug-brand', label: 'Drug brand', tip: 'Tip: Drug that must be prescribed by BRAND rather than using generic name' },
        { id: 'drug-route', label: 'Incorrect route', tip: 'Tip: Specified route is contraindicated for drug and/or dose prescribed' },
        { id: 'missing-field', label: 'Missing field alert', tip: 'Tip: Unable to complete prescription as information provided incomplete (e.g. indication or duration of treatment omitted)' }
      ],
      result: null,
      result_score: '',     
      startTime: '',
      validationSchema: {
        'outcome-radios': (value) => {          
          return value ? true : 'Please select one of the outcomes'
        },
        'intervention-type': (value) => {
          return this.outcomes == 'intervention' ? ((Array.isArray(value) && value.length > 0) ? true : 'Please select an intervention type') : true
        },
        'intervention-select': (value) => {
          return this.outcomes == 'intervention' ? (value ? true : 'Please select one') : true
        },
        'patient-intervention': (value) => {
          return this.outcomes == 'intervention' ? (value ? true : 'Please give more details of system response') : true
        }
      }
    }
  },
  methods: {
    getResult(risk_level, outcome) {

      let result = ''

      // get outcome and result_score
      // if no drug is available, don't bother with the risk level, as all results are null
      if (outcome === 'not-available') {
        result = 'Null'
      }
      else if (risk_level === 'Extreme') {

        if (outcome === 'no-intervention') {
          result = 'No Mitigation/Fail'
        }
        else if (outcome === 'order-prevented') {
          result = 'Good Mitigation/Pass'
        }
        else if (outcome === 'order-set-overridden' || outcome === 'intervention') {
          result = 'Some Mitigation'
        }
      }
      else if (risk_level === 'High') {

        if (outcome === 'no-intervention') {
          result = 'No Mitigation/Fail'
        }
        else if (outcome === 'order-prevented') {
          result = 'Over Mitigation'
        }
        else if (outcome === 'order-set-overridden' || outcome === 'intervention') {
          result = 'Good Mitigation/Pass'
        }
      }
      else if (risk_level === 'Low') {

        if (outcome === 'no-intervention') {
          result = 'Good Mitigation/Pass'
        }
        else if (outcome === 'order-prevented') {
          result = 'Over Mitigation'
        }
        else if (outcome === 'order-set-overridden' || outcome === 'intervention') {
          result = 'Over Mitigation'
        }
      }

      return result
    },
    getResultScore(result) {

      let result_score = 0

      if (result === 'Over Mitigation') {
        result_score = 15
      }
      if (result === 'Good Mitigation/Pass') {
        result_score = 10
      }
      else if (result === 'Some Mitigation') {
        result_score = 5
      }
      else if (result === 'No Mitigation/Fail') {
        result_score = 1
      }
      return result_score
    }, 
    resetForm() {
      this.$refs.scenarioPrescriptionForm.reset()
    }, 
    validateForm() {
      this.$refs.scenarioPrescriptionForm.validate()
    },  
    saveData() {
      this.submitted = true
      this.$validator.validate().then(valid => {
        if (valid) {

          let endTime = new Date()
          let elapsedTime = endTime.getTime() - this.startTime.getTime()
          this.response.time_taken = elapsedTime / 1000

          const prescription = this.response.prescription
          const outcome = this.response.outcomes
          const other = this.response.other
          const intervention_type = this.response.intervention_type.toString()
          const selected_type = this.response.selected_type
          const time_taken = this.response.time_taken
          const qualitative_data = this.response.qualitative_data
          const risk_level = this.prescription.risk_level
          const result = this.getResult(risk_level, outcome)
          const result_score = this.getResultScore(result)
          const index = this.getPresTestIndex
          const completed = this.completed
          const { dispatch } = this.$store
          if (time_taken) {
            dispatch('savePrescriptionData', { prescription, outcome, other, intervention_type, selected_type, risk_level, result, result_score, time_taken, qualitative_data, index, completed })
          }
          // reset data fields
          this.resetDataFields()
          this.clearCheckBoxes()
        }
      })
    },
    // onDoneClick() {
    //   // this is now true
    //   this.completed = true
    //   let id = localStorage.getItem('assessmentId')

    //   // save the last test data
    //   this.saveData()

    //   // audit
    //   const user_id = this.user.user_id
    //   dataService.audit('Completed scenarios', '/assessmentscenarios')
    //   this.$router.push('/assessmentresults?ID=' + id)
    // },
    //   clearCheckBoxes() {
    //     for (let index in this.checkBoxList) {
    //       if (this.checkBoxList.hasOwnProperty(index)) {
    //         if (this.checkBoxList[index].selected === true) {
    //           this.checkBoxList[index].selected = false
    //         }
    //       }
    //     }
    //   },
    //   resetDataFields() {
    //     this.response.outcomes = ''
    //     this.response.other = ''
    //     this.response.risk_level = ''
    //     this.response.intervention_type = []
    //     this.response.selected_type = ''
    //     this.response.qualitative_data = ''
    //     this.test_id = ''
    //     //  this.result_score = null;
    //   }
    // },
    // created: function () {
    //   this.startTime = new Date()
    // },
    // beforeUpdate: function () {
    //   let index = this.$store.state.testIndex
    //   if (index === (this.numTests - 1) || index > (this.numTests - 1)) {
    //     this.nextEnabled = false
    //     this.doneEnabled = true
    //   }
    // }
  }
}
</script>

<style scoped>
span.patient-image>img {
  height: 50px;
}
</style>
