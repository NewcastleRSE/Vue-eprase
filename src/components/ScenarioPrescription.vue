<template>

  <div>

    <div class="patient-details my-3">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Patient: {{ getCurrentPatientName }}
            <span class="patient-image">
              <img v-if="getCurrentPatientGender === 'male'" src="../assets/images/anon-male.png" />
              <img v-if="getCurrentPatientGender === 'female'" src="../assets/images/anon-female.png" />
            </span>
          </h5>
          <p class="card-text">Age: {{ testPayload.patient.age }}</p>
        </div>
      </div>
    </div>

    <h5 v-if="debugMode"> {{ testPayload.id }} - Risk: {{ testPayload.risk_level }}</h5>

    <div>
      <p class="py-2">Prescribe the following medication to the specified patient using your normal prescribing
        practice, then answer the questions below.</p>

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
            <td>{{ testPayload.drug_name }}</td>
            <td>{{ testPayload.drug_dose }}</td>
            <td>{{ testPayload.route }}</td>
            <td>{{ testPayload.drug_frequency }}</td>
            <td>{{ testPayload.duration }}</td>
          </tr>
        </tbody>
      </table>

      <table class="table table-striped" v-if="testPayload.justification">
        <tr>
          <th>Indication</th>
          <td>{{ testPayload.justification }}</td>
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
              <a class="icon-link" data-bs-toggle="tooltip" data-bs-placement="right" href="javascript:void(0)"
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
            what category of intervention (e.g. dose, frequency dialogue) and the type of response i.e:
            <ul class="list-group">
              <li class="list-group-item">
                <span class="fw-bold">Alert</span> - information is provided which interrupts work flow and/or requires action 
                e.g. pop-up boxes or requiring password entry
              </li>
              <li class="list-group-item">
                <span class="fw-bold">Advisory</span> - information is provided which does not interrupt workflow or require action e.g. 
                a passive dialogue, maybe a banner message on the bottom of the screen
              </li>
            </ul>
          </p>
          <h5>You have received advice or information concerning (check all that apply):</h5>
          <table class="table table-striped w-50">
            <tbody>
              <tr v-for="intType in interventionTypeOptions">                
                <td>
                  <label class="category-label" for="intType.id">{{ intType.label }}</label>
                </td>                
                <!-- 
                Selection of either of the alert/advisory radios will do the job, the extra checkbox is redundant
                <td>
                  <Field v-slot="{ field }" v-model="response.intervention_type" type="checkbox" :id="intType.id"
                    name="intervention-type" :value="intType.id">
                    <input v-bind="field" type="checkbox" class="form-check-input" name="intervention-type"
                      :value="intType.id">
                  </Field>
                </td> 
                -->
                <td>
                  <div class="form-check form-check-inline">
                    <Field v-slot="{ field }" v-model="response.selected_type[intType.id]" type="radio" :name="'intervention-select-' + intType.id + '-alert'"
                      :id="'intervention-select-' + intType.id + '-alert'" value="alert">
                      <input v-bind="field" type="radio" :name="'intervention-select-' + intType.id + '-alert'" value="alert"
                        class="form-check-input" @change="onSelectedInterventionTypeChange()">
                    </Field>
                    <label class="form-check-label" :for="'intervention-select-' + intType.id + '-alert'">Alert</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <Field v-slot="{ field }" v-model="response.selected_type[intType.id]" type="radio" :name="'intervention-select-' + intType.id + '-alert'"
                      :id="'intervention-select-' + intType.id + '-advisory'" value="advisory">
                      <input v-bind="field" type="radio" :name="'intervention-select-' + intType.id + '-alert'" value="advisory"
                        class="form-check-input" @change="onSelectedInterventionTypeChange()">
                    </Field>
                    <label class="form-check-label" :for="'intervention-select-' + intType.id + '-advisory'">Advisory</label>
                  </div>
                </td>
                <td>
                  <a class="icon-link" data-bs-toggle="tooltip" data-bs-placement="right" :data-bs-title="intType.tip">
                    <i class="bi bi-info-circle-fill link-primary ms-2"></i>
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
          <Field v-slot="{ field }" v-model="response.intervention_types" type="hidden" name="intervention-types">
            <input v-bind="field" type="hidden" name="intervention-types" value="">
          </Field>          
          <ErrorMessage name="intervention-types" as="div" class="mt-2 text-danger text-center" v-slot="{ message }">
            {{ message }}
          </ErrorMessage>

          <!-- 
          Original code commented out 19/07/2024 David - now display the alert/advisory choice inline - apparently that's simpler...
          https://github.com/orgs/NewcastleRSE/projects/72/views/1?pane=issue&itemId=70286651
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
          -->

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

        <h5 class="my-3">Please discontinue the prescription order before proceeding to the next scenario</h5>

        <input ref="test_id" type="hidden" id="test_id" :value="testPayload.id"/>
        <input ref="risk_level" type="hidden" id="risk_level" :value="testPayload.risk_level"/>

        <div class="my-2">          
          <button type="reset" class="btn btn-primary me-3" @click="onResetClick()">
            <i class="bi bi-x pe-1"></i>Clear
          </button>
          <button type="button" class="btn btn-primary" @click="onNextClick()" :disabled="!formMeta.valid">
            <i :class="isLast ? 'bi bi-check2-circle' : 'bi bi-arrow-right-circle'"></i>
              {{ isLast ? 'Done' : 'Next' }}
          </button>           
        </div>

      </Form>

    </div>
    
  </div>

</template>

<script>

import dayjs from 'dayjs'
import { mapState } from 'pinia'
import { appSettingsStore } from '../stores/appSettings'
import { patientStore } from '../stores/patients'
import { Form, Field, ErrorMessage } from 'vee-validate'

export default {
  name: "ScenarioPrescription",
  props: {
    testPayload: {},
    categories: { 
      type: Array 
    },
    isLast: false
  },
  components: {
    Form,
    Field,
    ErrorMessage
  },
  computed: {
    ...mapState(appSettingsStore, ['debugMode']),
    ...mapState(patientStore, ['savePrescriptionData']),
    getCurrentPatientName() {
      return this.testPayload['patient'].first_name + ' ' + this.testPayload['patient'].surname
    },
    getCurrentPatientGender() {
      return this.testPayload['patient'].gender
    },
    getCurrentPatientDOB() {
      return this.testPayload['patient'].dob
    }
  },
  data() {
    const interventionTypeTips = [
      'Tip: Drug contraindication (or dose adjustment) based on patient age',
      'Tip: Specified dose for prescribed drug is outside recommended dose range for any patient (includes doses that are too high or too low)',
      'Tip: Drug is not recommended for prescribing according to local guidance',
      'Tip: Interaction between prescribed drug and one or more concomitant prescribed drug(s) may result in patient harm',
      'Tip: Allergy or intolerance to prescribed drug (or another drug in the same category) documented',
      'Tip: Specified drug prescribed more than once for the same patient',
      'Tip: Drug contraindication (or dose adjustment) based on patient diagnosis or co-morbidities',
      'Tip: Critical medication NOT prescribed based upon patient diagnosis or other prescribed medication',
      'Tip: Two different medicines prescribed simultaneously with the same or similar therapeutic aims',
      'Tip: Drug contraindication (or dose adjustment) based on laboratory test result (includes therapeutic drug monitoring, direct notification/ display of abnormal labs; dosing suggestions; monitoring advisory or monitoring order request)',
      'Tip: Drug that must be prescribed by BRAND rather than using generic name',
      'Tip: Specified route is contraindicated for drug and/or dose prescribed',
      'Tip: Unable to complete prescription as information provided incomplete (e.g. indication or duration of treatment omitted)'
    ]
    return {      
      response: {
        outcomes: '',
        other: '',        
        selected_type: Object.fromEntries(this.categories.map(c => [c.category_code, ''])),
        qualitative_data: '',        
        intervention_types: ''
      },
      result: null,
      result_score: '',     
      startTime: '',
      interventionTypeOptions: this.categories.map((c, i) => {
        return { id: c.category_code, label: c.category_name, tip: interventionTypeTips[i] }
      }),
      validationSchema: {
        'outcome-radios': (value) => {          
          return value ? true : 'Please select one of the outcomes'
        },
        'intervention-types': (value) => {
          if (this.response.outcomes == 'intervention') {
            return value != ''
          }
          return true
        },        
        'patient-intervention': (value) => {
          return this.response.outcomes == 'intervention' ? (value ? true : 'Please give more details of system response') : true
        }
      }
    }
  },
  methods: {   
    getResult(risk_level, outcome) {
      const resultMatrix = {
        'Extreme': {
          'no-intervention': 'No Mitigation/Fail',
          'order-prevented': 'Good Mitigation/Pass',
          'order-set-overridden': 'Some Mitigation',
          'intervention': 'Some Mitigation'
        },
        'High': {
          'no-intervention': 'No Mitigation/Fail',
          'order-prevented': 'Over Mitigation',
          'order-set-overridden': 'Good Mitigation/Pass',
          'intervention': 'Good Mitigation/Pass'
        },
        'Low': {
          'no-intervention': 'Good Mitigation/Pass',
          'order-prevented': 'Over Mitigation',
          'order-set-overridden': 'Over Mitigation',
          'intervention': 'Over Mitigation'
        }
      }
      return resultMatrix[risk_level] ? (resultMatrix[risk_level][outcome] || 'Null') : 'Null'
    },
    getResultScore(result) {
      const scoreMatrix = {
        'Over Mitigation': 15,
        'Good Mitigation/Pass': 10,
        'Some Mitigation': 5,
        'No Mitigation/Fail': 1
      }
      return scoreMatrix[result] || 0
    }, 
    onSelectedInterventionTypeChange() {
      
      console.group('onSelectedInterventionTypeChange()')
      console.debug('Selected type object currently', this.response.selected_type)

      let intData = []
      Object.keys(this.response.selected_type).forEach(k => {
        if (this.response.selected_type[k] != '') {
          intData.push(`${k}/${this.response.selected_type[k]}`)
        }
      })
      console.debug('Current state of play', intData)
      this.response.intervention_types = intData.toString()

      console.groupEnd()
    },
    onResetClick() {
      this.$refs.scenarioPrescriptionForm.resetForm()
    },   
    async onNextClick() {
     
      console.group('ScenarioPrescription:onNextClick()')
      console.debug(this.response)

      this.$refs.scenarioPrescriptionForm.validate().then(async (valid) => {
        if (valid) {
          const completed = this.isLast
          const time_taken = dayjs().diff(this.startTime, 'seconds')
          const prescription = this.$refs.test_id.value
          const outcome = this.response.outcomes
          const other = this.response.other

          // These are now strings of comma-separated values, reflecting alert/advisory responses from multiple categories - David 22/07/2024
          // const intervention_type = this.response.intervention_type.toString()
          // const selected_type = this.response.selected_type
          const cats = []
          const types = []
          this.response.intervention_types.split(',').forEach(idata => {
            cats.push(idata.split('/').shift())
            types.push(idata.split('/').pop())
          })
          const intervention_type = cats.toString()
          const selected_type = types.toString()

          const qualitative_data = this.response.qualitative_data
          const risk_level = this.$refs.risk_level.value
          const result = this.getResult(risk_level, outcome)
          const result_score = this.getResultScore(result)
          const saveResponse = await this.savePrescriptionData(prescription, outcome, other, intervention_type, selected_type, risk_level, result, result_score, time_taken, qualitative_data, completed)
          if (saveResponse.status < 400) {
            this.$emit('test-save-ok')
          } else {
            this.$emit('test-save-fail', saveResponse.message)
          }
        }        
      })
      
      console.groupEnd()
    }
  },
  mounted: function () {
    this.startTime = dayjs()
  }
}
</script>

<style scoped>
span.patient-image>img {
  height: 50px;
}
</style>
