<template>
  <GroupElement name="scenarioGroup" :class="'mb-4'">
    <StaticElement name="scenarioDataLoading" v-if="!dataLoaded">
      <div class="d-flex align-items-center">
        <strong role="status">Loading scenario data for assessment...</strong>
        <div class="spinner-border ms-auto" aria-hidden="true"></div>
      </div>
    </StaticElement>
    <GroupElement name="scenarioDataLoaded" v-if="dataLoaded">
      <StaticElement name="scenarioHeading">
        <h2>Scenarios</h2>
        <div class="alert alert-info mt-2" role="alert">
          <p>There are 45 test scenarios to complete. This should be carried out in <span
              class="fw-bold">Consultant</span> status to avoid formulary issues.</p>
          <p>
            Please select the first patient's name from those set up in the patient build phase and prescribe the
            medication exactly as detailed in the scenario 1 tab presented.
            Record any relevant advice or information received while completing the test as prompted. Check all
            responses and then click <span class="fw-bold">Save</span>.
          </p>
          <p>
            Please note once you have clicked <span class="fw-bold">Save</span> you will <span
              class="fw-bold">not</span> be able to return to this page again to change your response.
          </p>
          <p>
            You will automatically move onto scenario 2 tab then scenario 3 tab for the patient selected and you should
            complete the same process.
            On completion of the three scenario tests you will be prompted to move onto the next patient.
          </p>
          <p>Please work through all of the patients until all test scenarios are complete</p>
        </div>
      </StaticElement>  
      <ObjectElement name="scenarioData">    
        <div class="accordion vf-col-12" id="patientAccordion">
          <div class="accordion-item" v-for="patient in patientData" :key="patient.id">
            <ObjectElement :name="patient.patient_code">
              <h2 class="accordion-header primary vf-col-12">
                <button class="accordion-button" type="button" data-bs-toggle="collapse"
                  :id="'accordion-btn-' + patient.patient_code"
                  :class="currentPatient == patient.patient_code ? '' : 'collapsed'"
                  :data-bs-target="'#patient-' + patient.patient_code"
                  :aria-expanded="currentPatient == patient.patient_code" :aria-controls="patient.patient_code">
                  <span class="fw-bold">
                    <img class="img-thumbnail" style="width: 50px; height: 50px" v-if="patient.gender === 'Male'"
                      src="../assets/images/anon-male.png" alt="male patient" />
                    <img class="img-thumbnail" style="width: 50px; height: 50px" v-if="patient.gender === 'Female'"
                      src="../assets/images/anon-female.png" alt="female-patient" />
                    Patient: {{ patient.full_name }}, 
                     <span v-if="patient.age_years != 0"> age: {{ patient.age_years }} years</span>
                     <span v-if="patient.age_days != 0"> age: {{ patient.age_days }} days</span>
                     <span v-if="patient.gestational_age != 0"> gestational age: {{ patient.gestational_age }} weeks</span>
                  </span>
                </button>
              </h2>
              <div class="accordion-collapse collapse vf-col-12" data-bs-parent="#patientAccordion"
                :id="'patient-' + patient.patient_code" :class="currentPatient == patient.patient_code ? 'show' : ''">
                <div class="accordion-body">
                  <!-- Scenario navigation tabs -->
                  <ul class="nav nav-tabs" :id="'patient-' + patient.patient_code + '-scenario-tabs'" role="tablist">
                    <li v-for="(pscd, index) in patientScenarios[patient.patient_code]" class="nav-item"
                      role="presentation">
                      <button class="nav-link" data-bs-toggle="tab" type="button" role="tab"
                        :class="index == 0 ? 'active' : ''" :id="'scenario-' + pscd.scenario_code + '-tab'"
                        :data-bs-target="'#scenario-' + pscd.scenario_code">{{ 'Scenario ' + (index + 1) }}
                      </button>
                    </li>
                  </ul>

                  <!-- Scenario tabs -->
                  <div v-if="currentPatient == patient.patient_code" class="tab-content vf-col-12">
                    <div class="tab-pane fade mt-2"
                      v-for="(pscd, index) in patientScenarios[patient.patient_code]"
                      :id="'scenario-' + pscd.scenario_code"
                      :class="currentScenario == index + 1 ? 'active show' : ''" role="tabpanel" tabindex="0">
                      <p class="my-4">Prescribe the following medication to the specified patient using your normal
                        prescribing practice, then answer the questions below.</p>
                      <table class="table table-striped" style="table-layout: fixed;">
                        <tbody>
                          <tr>
                            <th style="width:200px">Drug</th>
                            <td>{{ pscd.prescriptions.name }}</td>
                          </tr>
                          <tr>
                            <th>Dose</th>
                            <td>{{ pscd.prescriptions.dose }}</td>
                          </tr>
                          <tr>
                            <th>Route</th>
                            <td>{{ pscd.prescriptions.route }}</td>
                          </tr>
                          <tr>
                            <th>Frequency</th>
                            <td>{{ pscd.prescriptions.frequency }}</td>
                          </tr>
                          <tr>
                            <th>Duration</th>
                            <td>{{ pscd.prescriptions.duration }}</td>
                          </tr>
                          <tr>
                            <th>Justification</th>
                            <td>{{ pscd.prescriptions.justification }}</td>
                          </tr>
                        </tbody>
                      </table>
                      <!-- Radio group of potential system responses -->
                      <ObjectElement :name="pscd.scenario_code">
                        <h4 class="vf-col-12 mb-2">Questions</h4>
                        <span class="vf-col-12"
                          v-html="embolden('Which of the following best describes the response from the system when you attempted to prescribe the specified drug?', true)"></span>
                        <table class="table table-striped vf-col-12">
                          <tbody>
                            <tr v-for="(sysResponse, srIdx) in systemResponses">
                              <td>                            
                                <RadioElement
                                  name="outcome" 
                                  :radioValue="sysResponse.value"
                                  :columns="{ container: 12, label: 8, wrapper: 12 }"
                                  @change="setIntervention">
                                    <template #label>
                                      <span v-html="sysResponse.label"></span>
                                    </template>
                                </RadioElement>                                
                              </td>
                              <td>
                                <span v-if="systemResponseTips[srIdx] != ''" data-bs-toggle="tooltip" data-bs-placement="right"
                                  :data-bs-title="systemResponseTips[srIdx]">
                                  <i class="bi bi-info-circle-fill"></i>
                                </span>
                              </td>
                            </tr>                            
                          </tbody>
                        </table>
                        <!-- Alert/advisory checkboxes -->
                        <div v-if="interventionSelections[patient.patient_code + '.' + pscd.scenario_code + '.outcome'] === true" class="vf-col-6">
                          <div class="alert alert-info mt-2" role="alert">
                            Please tell us about the system response by selecting <span class="fw-bold">up to two</span> clinical decision support categories from the list below:
                          </div>
                          <table class="table table-striped vf-col-6">
                            <thead>
                              <tr><th>Category</th><th>Alert</th><th>Advisory</th><th></th></tr>
                            </thead>
                            <tbody>
                              <tr v-for="(mc, mcIdx) in matrixCategories">
                                <td>{{  mc.label }}</td>
                                <td><CheckboxElement :name="'alert-' + mc.value" /></td>
                                <td><CheckboxElement :name="'advisory-' + mc.value" /></td>
                                <td>
                                  <span v-if="mc.tip != ''" data-bs-toggle="tooltip" data-bs-placement="right"
                                    :data-bs-title="mc.tip">
                                    <i class="bi bi-info-circle-fill"></i>
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>                                          
                      </ObjectElement>
                    </div>
                  </div>
                </div>
              </div>
            </ObjectElement>
          </div>
        </div>
      </ObjectElement>
    </GroupElement>
  </GroupElement>
</template>

<script>

import { mapState } from 'pinia'
import { assessmentStore } from '../stores/assessment'
import { rootStore } from '../stores/root'

export default {
  name: 'AssessmentScenario',
  computed: {
    ...mapState(assessmentStore, ['dataReady', 'assessmentData', 'updateAssessmentStatus', 'getPatientScenarioData', 'getPatientScenarioResponses']),
    ...mapState(rootStore, ['getMitigations', 'getCategories']),
    dataLoaded() {
      return this.dataReady && this.auxiliaryDataReady
    },
    patientData() {
      console.log('Patients', this.assessmentData.patients)
      return this.assessmentData.patients
    },
    patientScenarios() {
      console.log('Scenarios', this.assessmentData.patientScenarios)
      return this.assessmentData.patientScenarios
    },
    systemResponses() {
      return [
        { value: 'MT2', label: 'You were able to complete the prescription (includes followed order sentence) <span class="fw-bold">without any additional user or system input</span>' },
        { value: 'MT4', label: 'You were able to complete the prescription, <span class="fw-bold">but had to override components of the order sentence</span>' },
        { value: 'MT1', label: 'You were able to complete the prescription, <span class="fw-bold">with system/user intervention</span>' },
        { value: 'MT3', label: 'Prevented from prescribing' },
        { value: 'MT99', label: 'Medicine or formulary alternative not available in the system' },
      ]
    },
    systemResponseTips() {
      return [
        'You placed the order for the new medicine using your normal processes, which may have included the selection of a provided order sentence and did not receive any advice or information from the electronic prescribing system',
        'You placed the order for the new medicine but had to ignore, modify or override a provided order sentence to complete it',
        'You placed the order and received some system advice or information in relation to allergies, abnormal lab results, dosing, route, age of patient, therapeutic duplication, monitoring, contraindication or something other, that required you to take some action in order to continue. Please tell us more about what happened using the tick box option descriptions provided and / or the freehand comments box that will appear when you select this response option',
        '',
        ''
      ]
    },
    matrixCategories() {
      return this.categories
    },
    categoryCount() {
      return this.categories.length
    },
    categoryTips() {
      return this.categories.map(c => { c.tip })
    }
  },
  data() {
    return {
      auxiliaryDataReady: false,
      categories: [],
      mitigationCodes: {},
      interventionSelections: {},
      currentPatient: null,
      currentScenario: 1,
      allPatientScenarios: {},
      allScenariosCompleted: false  // Pro-tem
    }
  },
  methods: {
    // openNextUnenteredPatient() {

    //   //TODO
    //   console.group('openNextUnenteredPatient()')

    //   const allCodes = this.patientData.map(p => p.patient_code)
    //   const doneCodes = this.completedPatientsArray()

    //   if (allCodes.length > doneCodes.length) {
    //     // Still some to do
    //     const notDoneCodes = allCodes.filter(c => !doneCodes.includes(c))
    //     const nextCode = notDoneCodes.shift()
    //     const docId = this.patientData.filter(p => p.patient_code == nextCode)[0].documentId
    //     this.patientRelations(docId)  
    //     document.getElementById('patient-' + nextCode).scrollIntoView()    
    //   } else {
    //     console.debug('No unentered patients left')
    //   }
    //   console.groupEnd()
    // },
    // async setPatientDataEntered(patientCode) {
    //   const spdeResponse = await this.setPatientEntryComplete(patientCode)
    //   if (spdeResponse !== true) {
    //     throw new Error(spdeResponse)
    //   }
    //   this.openNextUnenteredPatient()
    // }
    setIntervention(newVal, oldVal, el$) {
      console.group('setIntervention()')
      console.debug('New value', newVal, 'old value', oldVal, 'element', el$)
      // This sets the object key to <patient_code>.<scenario_code>.outcome
      this.interventionSelections[el$.dataPath.split('.').slice(1).join('.')] = newVal == 'MT1'
      console.groupEnd()
    },
    raiseDataError(msg) {
      this.auxiliaryDataReady = true
      throw new Error(msg)
    }
  },
  async mounted() {
    console.group('AssessmentScenario mounted()')
    this.auxiliaryDataReady = false
    const mitResponse = await this.getMitigations()
    if (mitResponse.status < 400) {
      this.mitigationCodes = Object.fromEntries(mitResponse.data.data.map(m => [m.mitigation_code, m.mitigation]))
    } else {
      this.raiseDataError('Failed to retrieve mitigation code information')
    }
    const catResponse = await this.getCategories()
    if (catResponse.status < 400) {
      this.categories = catResponse.data.data.map(c => { return { value: c.category_code, label: c.name, tip: c.description } })
    } else {
      this.raiseDataError('Failed to retrieve category information')
    }    
    const loadScenariosResponse = await this.getPatientScenarioData(true)
    if (loadScenariosResponse !== true) {
      this.raiseDataError(loadScenariosResponse)
    }
    const storedResultsResponse = await this.getPatientScenarioResponses(true)
    if (storedResultsResponse !== true) {
      this.raiseDataError(storedResultsResponse)
    }
    this.auxiliaryDataReady = true
    console.groupEnd()
  },
  beforeUnmount() {
    console.group('AssessmentScenario beforeUnmount()')
    console.groupEnd()
  }
}
</script>

<style scoped></style>