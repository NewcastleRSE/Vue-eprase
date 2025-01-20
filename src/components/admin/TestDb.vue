<template>
  <div v-if="isDebug">
    <LoginInfo />
    <div class="w-50">
      <h4 class="pb-2">This page is for developers to generate test data</h4>
      <p>It should NOT be visible on the live system under any circumstances!</p>
      <Form ref="testDbForm">
        <div class="mb-4 row">
          <label for="nusers" class="col-sm-4 form-label">Number of test users:</label>
          <div class="col-sm-8">
            <Field v-slot="{ field }" v-model="nusers" name="nusers">
              <select v-bind="field" id="nusers" class="form-select">
                <option v-for="ntest in nuserOptions" :value="ntest">{{ ntest }}</option>
              </select>
            </Field>
          </div>
        </div>
        <div class="mb-4">
          <button type="button" class="btn btn-lg btn-primary me-3" @click="generateData">Generate test data</button>
        </div>
      </Form>
      <div v-show="generating == true" class="accordion" id="progressRecord">
        <div class="accordion-item" v-for="ntest in nusers" v-show="showProgressRecord(ntest)">
          <h2 class="accordion-header">
            <button class="accordion-button" type="button" data-bs-toggle="collapse" :data-bs-target="'#rec' + ntest">
              {{ `User : ${readProgressRecord(ntest - 1, 'userName') || 'unset'} at ${readProgressRecord(ntest - 1,
                'userInst') || 'unset'}` }}
            </button>
          </h2>
          <div :id="'rec' + ntest"
            :class="genIdx == ntest - 1 ? 'accordion-collapse collapse show' : 'accordion-collapse collapse'"
            data-bs-parent="#progressRecord">
            <div class="accordion-body">
              <ul class="list-group">
                <li class="list-group-item" :class="progressBackground(ntest - 1, 'createUser')">User creation</li>
                <li class="list-group-item" :class="progressBackground(ntest - 1, 'loggingInUser')">Logging in user</li>
                <li class="list-group-item" :class="progressBackground(ntest - 1, 'genSystem')">Fill in system info</li>
                <li class="list-group-item" :class="progressBackground(ntest - 1, 'genPatients')">Enter patients</li>
                <li class="list-group-item" :class="progressBackground(ntest - 1, 'genScenarios')">Generate scenarios
                </li>
                <li class="list-group-item" :class="progressBackground(ntest - 1, 'calcMitigations')">Calculate
                  mitigations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="!isDebug">
    404 : Not found
  </div>

</template>

<script>

import { faker } from '@faker-js/faker'
import { mitigationDataByCategory } from '../../helpers/categories'
import { prependZero, calcPercentage } from '../../helpers/utils'
import { Form, Field } from 'vee-validate'
import { mapStores } from 'pinia'
import { rootStore } from '../../stores/root'
import { authenticationStore } from '../../stores/authentication'
import { appSettingsStore } from '../../stores/appSettings'
import { patientStore } from '../../stores/patients'
import LoginInfo from '../LoginInfo'

export default {
  name: "TestDb",
  components: {
    Form,
    Field,
    LoginInfo
  },
  computed: {
    ...mapStores(rootStore, authenticationStore, appSettingsStore, patientStore),
    isDebug() {
      return process.env.DEBUG === true
    }
  },
  data() {
    return {
      genIdx: 0,
      nusers: 10,
      nuserOptions: [10, 20, 50, 100, 200],
      institutions: [],
      generating: false,
      currentGenProgress: [],
      categories: [],
      availableInstitutions: {}
    }
  },
  methods: {
    async generateData() {

      console.group('generateData()')

      const numTests = appSettingsStore().numPrescriptions

      // Some initialisation on patientStore
      const response = await patientStore().getRequiredTests()
      if (response.status >= 400) {
        console.error(response.message)
        return
      }

      let processStage = ''
      this.generating = true
      authenticationStore().setSimulationMode(true)

      // Generate the required number of random users
      this.genIdx = 0
      const nUsersToGenerate = Math.min(Object.keys(this.availableInstitutions).length, this.nusers)
      for (let i = 0; i < nUsersToGenerate; i++) {

        console.debug('Generating assessment record', i)

        try {
          this.currentGenProgress.push(this.initProgressRecord())

          // Basic user data => user signup
          console.debug('Creating user...')
          processStage = 'createUser'
          let inst = this.randomInstitition()
          this.setProgressRecord(i, 'userInst', inst.orgName)
          let email = this.randomEmail()
          let userName = email.split('@').shift()
          let password = faker.internet.password({ length: 12 })
          this.setProgressRecord(i, 'userName', userName)
          this.setProgressRecord(i, processStage, 'in progress')
          const signupRet = await authenticationStore().signup(userName, inst.id, email, password)
          if (signupRet.status != 'ok') {
            throw new Error(signupRet.message)
          }
          this.setProgressRecord(i, processStage, 'completed')
          console.debug('User', userName, 'created')

          // Log user in
          console.debug('Logging user in...')
          processStage = 'loggingInUser'
          this.setProgressRecord(i, processStage, 'in progress')
          const loginRet = await authenticationStore().login(userName, password)
          if (loginRet.status >= 400) {
            throw new Error(loginRet.message)
          }
          this.setProgressRecord(i, processStage, 'completed')
          console.debug('Login successful')

          // System information page
          console.debug('Filling out system info...')
          processStage = 'genSystem'
          this.setProgressRecord(i, processStage, 'in progress')
          const impDate = this.randomDateBetween(new Date('2020-01-01'), new Date('2023-12-31'))
          const updDate = this.randomDateBetween(impDate, new Date())
          const epSystem = this.randomEpSystem()
          const systemRet = await rootStore().saveSystemData(
            epSystem,
            `${prependZero(impDate.getMonth() + 1)}-${impDate.getFullYear()}`,
            `${prependZero(updDate.getMonth() + 1)}-${updDate.getFullYear()}`,
            '',       // other_ep_system
            '',       // local_ep_system_name
            0,        // version (not used),
            this.randomEpUsage(),
            Math.floor(Math.random() * 3) + 0.5,  // num_maintainers
            '',       // add_ep_system
            'Adults', // patient_type
            true,     // lab_results 
            true,     // man_results
            true,     // diagnosis_results
            this.randomPenicillinDescription(),
            '',       // penicillin_description_other
            true,     // penicillin_results
            '',       // penicillin_comment
            true,     // med_history
            this.randomHighRiskMeds(),
            this.randomClinicalAreas(),
            this.randomTimeTaken()
          )
          if (systemRet.status >= 400) {
            throw new Error(systemRet.message)
          }
          this.setProgressRecord(i, processStage, 'completed')
          console.debug('System info saved')

          // Patients and details
          console.debug('Filling out patient info...')
          processStage = 'genPatients'
          this.setProgressRecord(i, processStage, 'in progress')

          const cpdRet = await patientStore().getCompletePatientDetails(false, 'Adults')
          if (cpdRet.status >= 400) {
            throw new Error(cpdRet.message)
          }
          const patientIds = cpdRet.data.map(p => p.id)
          const saveIdsRet = await patientStore().savePatientList(patientIds.join(','))
          if (saveIdsRet.status >= 400) {
            throw new Error(saveIdsRet.message)
          }
          cpdRet.data.forEach(async pdata => {
            const spdRet = await patientStore().savePatientData(
              '',   // qualitative_data
              pdata.code,
              this.randomTimeTaken()
            )
            if (spdRet.status >= 400) {
              throw new Error(spdRet.message)
            }
          })
          const assessProgRet = await rootStore().updateAssessmentProgress()
          if (assessProgRet.status >= 400) {
            throw new Error(assessProgRet.message)
          }

          this.setProgressRecord(i, processStage, 'completed')
          console.debug('Patient data saved')

          // Scenarios
          console.debug('Filling out scenarios...')
          processStage = 'genScenarios'
          this.setProgressRecord(i, processStage, 'in progress')

          const catRet = await rootStore().getCategories()
          if (catRet.status >= 400) {
            throw new Error(catRet.message)
          }
          this.categories = catRet.data

          const scenRet = await patientStore().getCompletePatientDetails(true, 'Adults')
          if (scenRet.status >= 400) {
            throw new Error(scenRet.message)
          }

          const prescriptionCats = {}
          const testOutcomes = []
          const cfgOutcomes = []
          patientStore().testList.forEach(async t => {
            if (t.configErrorCode) {
              // Generate random config error response
              const outcomeObj = Object.fromEntries([
                ['test_id', t.configErrorCode],
                ['result', Math.floor(Math.random() * 3)],
                ['time_taken', this.randomTimeTaken()]
              ])
              cfgOutcomes.push(outcomeObj)
              const cfgErrRet = await patientStore().saveConfigError(...Object.values(outcomeObj))
              if (cfgErrRet.status >= 400) {
                throw new Error(cfgErrRet.message)
              }
            } else {
              // Generate random scenario response
              const outcome = this.randomOutcome()
              const checkboxValues = this.checkboxValues(outcome)
              const result = this.getResult(t.risk_level, outcome)
              const resultScore = this.getResultScore(result)
              const outcomeObj = Object.fromEntries([
                ['prescription_id', t.id],
                ['outcome', outcome],
                ['other', ''],
                ['intervention_type', checkboxValues.intervention_type],
                ['selected_type', checkboxValues.selected_type],
                ['risk_level', t.risk_level],
                ['result', result],
                ['result_score', resultScore],
                ['time_taken', this.randomTimeTaken()],
                ['qualitative_data', '']
              ])
              testOutcomes.push(outcomeObj)
              prescriptionCats[t.id] = t.indicator.category.categoryCode
              const prDataRet = await patientStore().savePrescriptionData(...Object.values(outcomeObj))
              if (prDataRet.status >= 400) {
                throw new Error(prDataRet.message)
              }
            }
          })

          this.setProgressRecord(i, processStage, 'completed')
          console.debug('Scenario data saved')

          // Mitigations
          console.debug('Calculating mitigations...')
          processStage = 'calcMitigations'
          this.setProgressRecord(i, processStage, 'in progress')

          const mitigationData = mitigationDataByCategory(this.categories, testOutcomes.map(ptd => {
            return {
              categoryCode: prescriptionCats[ptd.prescription_id],
              mitigation: ptd.result,
              outcome: ptd.outcome,
              intervention_type: ptd.intervention_type,
              selected_type: ptd.selected_type
            }
          }))

          const saveMitRet = await rootStore().saveMitigationResults(
            rootStore().assessmentId,
            epSystem,
            calcPercentage(mitigationData.totals.totalGood, numTests),
            calcPercentage(mitigationData.totals.totalSome, numTests),
            calcPercentage(mitigationData.totals.totalNot, numTests),
            calcPercentage(mitigationData.totals.totalOver, numTests),
            calcPercentage(mitigationData.totals.totalNulls, numTests)
          )
          if (saveMitRet.status >= 400) {
            throw new Error(saveMitRet.message)
          }

          this.setProgressRecord(i, processStage, 'completed')
          console.debug('Mitigation data saved')

        } catch (err) {
          this.setProgressRecord(i, processStage, 'error')
          console.error(err.message)
        }

        this.genIdx++
      }

      authenticationStore().setSimulationMode(false)

      console.groupEnd()
    },
    initProgressRecord() {
      return {
        userName: '',
        userInst: '',
        createUser: 'not started',
        loggingInUser: 'not started',
        genSystem: 'not started',
        genPatients: 'not started',
        genScenarios: 'not started'
      }
    },
    showProgressRecord(idx) {
      return this.genIdx >= idx
    },
    readProgressRecord(i, k) {
      if (this.currentGenProgress.length < i + 1) {
        return false
      } else {
        return this.currentGenProgress[i][k]
      }
    },
    setProgressRecord(i, k, value) {
      this.currentGenProgress[i][k] = value
    },
    progressBackground(i, k) {

      console.group('progressBackground()')
      console.debug('Received index', i, 'key', k)

      let ret = 'bg-light'
      const rec = this.readProgressRecord(i, k)
      console.debug('rec', rec)

      if (rec != false) {
        switch (rec) {
          case 'completed': ret = 'bg-success'; break
          case 'in progress': ret = 'bg-warning'; break
          case 'error': ret = 'bg-danger'; break
          default: ret = 'bg-light'; break
        }
      }

      console.debug('Returning', ret)
      console.groupEnd()

      return ret
    },
    checkboxValues(outcome) {
      const ret = {
        intervention_type: '',
        selected_type: ''
      }
      if (outcome == 'intervention') {
        const itypes = []
        const stypes = []
        this.categories.forEach(c => {
          if (Math.random() > 0.5) {
            itypes.push(c.id)
            stypes.push('alert')
          }
          if (Math.random() > 0.5) {
            itypes.push(c.id)
            stypes.push('advisory')
          }
        })
        if (itypes.length == 0) {
          // Vanishingly small probability of ending up here...
          itypes.push(this.categories[0])
          stypes.push('alert')
        }
        ret.intervention_type = itypes.toString()
        ret.selected_type = stypes.toString()
      }
      return ret
    },
    randomEmail() {
      return faker.internet.email({ provider: this.randomNhsDomain(), allowSpecialCharacters: false }).replace('_', '.')
    },
    randomInstitition() {
      // Will only use each institution once - too complicated to generate part assessments for 
      // multiple users in the same institution
      const availableIds = Object.keys(this.availableInstitutions)
      const instId = availableIds[Math.floor(Math.random() * availableIds.length)]
      const instName = this.availableInstitutions[instId]
      delete this.availableInstitutions[instId]
      return { id: instId, orgName: instName }
    },
    randomNhsDomain() {
      if (Math.random() < 0.5) {
        return 'nhs.net'
      }
      return 'nhs.uk'
    },
    randomEpSystem() {
      const epSystems = appSettingsStore().epSystemOptions
      return epSystems[Math.floor(Math.random() * (epSystems.length - 1))].value
    },
    randomDateBetween(start, end) {
      return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    },
    randomEpUsage() {
      const options = ['76-100', '51-75', '26-50', '0-25']
      return options[Math.floor(Math.random() * options.length)]
    },
    randomPenicillinDescription() {
      const options = ['penicillin_v', 'phenoxymethylpenicillin', 'phenoxymethylpenicillin_tablets']
      return options[Math.floor(Math.random() * options.length)]
    },
    randomHighRiskMeds() {

      console.group('randomHighRiskMeds()')

      const hrms = []
      const options = appSettingsStore().highRiskMeds.map(hrm => hrm.value)
      const nMeds = Math.floor(3 + Math.random() * (options.length - 3))  // Random number of meds, at least 3
      for (let i = 0; i < nMeds; i++) {
        // Generate a random index in the current options array
        const idx = Math.floor(Math.random() * options.length)
        hrms.push(options[idx])
        options.splice(idx, 1)  // Remove this element so not chosen again
      }

      console.debug(hrms)
      console.groupEnd()

      return hrms.toString()
    },
    randomClinicalAreas() {

      console.group('randomHighRiskMeds()')

      const cas = []
      const options = appSettingsStore().clinicalAreas.map(ca => ca.value)
      options.pop() // Remove the 'other' option from the end
      const nCa = Math.floor(3 + Math.random() * (options.length - 3))  // Random number of areas, at least 3
      for (let i = 0; i < nCa; i++) {
        // Generate a random index in the current options array
        const idx = Math.floor(Math.random() * options.length)
        cas.push(options[idx])
        options.splice(idx, 1)  // Remove this element so not chosen again
      }

      console.debug(cas)
      console.groupEnd()

      return cas.toString()
    },
    randomOutcome() {
      const outcomeValues = ['no-intervention', 'order-set-overridden', 'intervention', 'order-prevented', 'not-available']
      return outcomeValues[Math.floor(Math.random() * outcomeValues.length)]
    },
    randomTimeTaken() {
      return Math.floor(100 * Math.random()) + 30
    },
    async getInstitutions() {
      const response = await rootStore().getInstitutions()
      if (response.status < 400) {
        this.institutions = response.data
        // Get all currently defined users (only a total of 200 users, one per institution, can be generated)
        const fuResponse = await authenticationStore().findUsers()
        if (fuResponse.status < 400) {
          // Determine ids of institutions with existing assessments
          const instsWithAssessments = fuResponse.data.map(elt => elt.institution.id)
          this.availableInstitutions = Object.fromEntries(this.institutions.map(inst => [inst.id, inst.orgName]).filter(elt => elt[1] != 'ZZZTesting').filter(elt => !instsWithAssessments.includes(elt[0])))
        } else {
          console.error(fuResponse.message)
        }

      } else {
        this.institutions = [response.message]
        console.error(response.message)
      }
    },
    // Culled from ScenarioPrescription.vue, indicating these constants need to be in settings...
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
          'order-set-overridden': 'Some Mitigation',
          'intervention': 'Good Mitigation/Pass'
        },
        // alias for Low risk
        'N/A': {
          'no-intervention': 'Good Mitigation/Pass',
          'order-prevented': 'Over Mitigation',
          'order-set-overridden': 'Over Mitigation',
          'intervention': 'Over Mitigation'
        }
      }
      return resultMatrix[risk_level] ? (resultMatrix[risk_level][outcome] || 'Null') : 'Null'
    },
    // Culled from ScenarioPrescription.vue, indicating these constants need to be in settings...
    getResultScore(result) {
      const scoreMatrix = {
        'Over Mitigation': 15,
        'Good Mitigation/Pass': 10,
        'Some Mitigation': 5,
        'No Mitigation/Fail': 1
      }
      return scoreMatrix[result] || 0
    }
  },
  mounted() {
    this.getInstitutions()
  }
}
</script>

<style scoped></style>