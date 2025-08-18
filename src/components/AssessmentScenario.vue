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
          <p>There are 45 test scenarios to complete. This should be carried out in <span class="fw-bold">Consultant</span> status to avoid formulary issues.</p>
          <p>
            Please select the first patient's name from those set up in the patient build phase and prescribe the medication exactly as detailed in the scenario 1 tab presented. 
            Record any relevant advice or information received while completing the test as prompted. Check all responses and then click <span class="fw-bold">Save</span>.
          </p>
          <p>
            Please note once you have clicked <span class="fw-bold">Save</span> you will <span class="fw-bold">not</span> be able to return to this page again to change your response.
          </p>
          <p>
            You will automatically move onto scenario 2 tab then scenario 3 tab for the patient selected and you should complete the same process. 
            On completion of the three scenario tests you will be prompted to move onto the next patient.
          </p>
          <p>Please work through all of the patients until all test scenarios are complete</p>
        </div>
      </StaticElement>
      <ObjectElement ref="scenariosObject" name="scenarios">
        <StaticElement name="scenarioDataBody">
          <div class="accordion" id="patientAccordion">
            <div class="accordion-item" v-for="(patient, idx) in patientData" :key="patient.id">
              <h2 class="accordion-header primary">
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
                    Patient: {{ patient.full_name }}, age {{ patient.age }}
                  </span>
                </button>
              </h2>
              <div class="accordion-collapse collapse" data-bs-parent="#patientAccordion"
                :id="'patient-' + patient.patient_code" :class="currentPatient == patient.patient_code ? 'show' : ''">
                <div class="accordion-body">
                  <!-- Scenario navigation tabs -->
                  <ul class="nav nav-tabs" :id="'patient-' + patient.patient_code + '-scenario-tabs'" role="tablist">
                    <li v-for="(scenarioData, index) in patientScenarios[patient.patient_code]" class="nav-item"
                      role="presentation">
                      <button class="nav-link" data-bs-toggle="tab" type="button" role="tab"
                        :class="index == 0 ? 'active' : ''" :id="'scenario-' + scenarioData.scenario_code + '-tab'"
                        :data-bs-target="'#scenario-' + scenarioData.scenario_code">{{ 'Scenario ' + (index + 1) }}
                      </button>
                    </li>
                  </ul>

                  <!-- Scenario tabs -->
                  <div class="tab-content">
                    <div class="tab-pane fade mt-2"
                      v-for="(scenarioData, index) in patientScenarios[patient.patient_code]"
                      :id="'scenario-' + scenarioData.scenario_code"
                      :class="currentScenario == index + 1 ? 'active show' : ''" role="tabpanel" tabindex="0">
                      <p class="my-4">Prescribe the following medication to the specified patient using your normal
                        prescribing practice, then answer the questions below.</p>
                      <table class="table table-striped" style="table-layout: fixed;">
                        <tbody>
                          <tr>
                            <th style="width:200px">Drug</th>
                            <td>{{ scenarioData.prescriptions.name }}</td>
                          </tr>
                          <tr>
                            <th>Dose</th>
                            <td>{{ scenarioData.prescriptions.dose }}</td>
                          </tr>
                          <tr>
                            <th>Route</th>
                            <td>{{ scenarioData.prescriptions.route }}</td>
                          </tr>
                          <tr>
                            <th>Frequency</th>
                            <td>{{ scenarioData.prescriptions.frequency }}</td>
                          </tr>
                          <tr>
                            <th>Duration</th>
                            <td>{{ scenarioData.prescriptions.duration }}</td>
                          </tr>
                          <tr>
                            <th>Justification</th>
                            <td>{{ scenarioData.prescriptions.justification }}</td>
                          </tr>
                        </tbody>
                      </table>
                      <!-- Radio group of potential system responses -->
                      <h4 class="mb-2">Questions</h4>
                      <span
                        v-html="embolden('Which of the following best describes the response from the system when you attempted to prescribe the specified drug?', true)"></span>
                      <table class="table">
                        <tbody>
                          <tr>
                            <td rowspan="5">
                              <RadiogroupElement 
                                name="outcomes[]" 
                                :items="systemResponses" 
                                @change="(newVal, oldVal, el$) => console.log('Changed radio to', newVal, 'from', oldVal, 'element', el$)"
                              />
                            </td>
                            <td>
                              <span data-bs-toggle="tooltip" data-bs-placement="right"
                                :data-bs-title="systemResponseTips[0]">
                                <i class="bi bi-info-circle-fill"></i>
                              </span>
                            </td>
                          </tr>
                          <tr v-for="tip in systemResponseTips.slice(1)">
                            <td>
                              <span :data-bs-toggle="tip != '' ? 'tooltip' : ''" data-bs-placement="right"
                                :data-bs-title="tip">
                                <i class="bi bi-info-circle-fill" :class="tip == '' ? 'invisible' : 'visible'"></i>
                              </span>
                            </td>
                          </tr>
                        </tbody>                        
                      </table>
                      <!-- Alert/advisory checkboxes -->
                      <table class="table">
                        <tbody>
                          <tr>
                            <td :rowspan="categoryCount + 1">
                              <MatrixElement name="scenarioResponseCategories[]"
                                :presets="['matrix-table']" 
                                :rows="matrixCategories" 
                                :cols="[ { value: 'alert', label: embolden('Alert') }, { value: 'advisory', label: embolden('Advisory') } ]"
                              />
                            </td>
                            <td>&nbsp;</td>                            
                          </tr>
                          <tr v-for="tip in categoryTips">
                            <td>
                              <span :data-bs-toggle="tip != '' ? 'tooltip' : ''" data-bs-placement="right"
                                :data-bs-title="tip">
                                <i class="bi bi-info-circle-fill" :class="tip == '' ? 'invisible' : 'visible'"></i>
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </StaticElement>
      </ObjectElement>

      <!-- TODO -->
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
    ...mapState(assessmentStore, ['setDataReady', 'dataReady', 'assessmentData', 'updateAssessmentStatus', 'populatePatientScenarios']),
    ...mapState(rootStore, ['getMitigations', 'getCategories']),
    dataLoaded() {
      return this.dataReady && this.auxiliaryDataReady
    },
    patientData() {
      return this.assessmentData.patients
    },
    patientScenarios() {
      return this.assessmentData.scenarios.patientScenarios
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
        'You placed the order and received some system advice or information in relation to  allergies, abnormal lab results, dosing, route, age of patient, therapeutic duplication, monitoring , contraindication or something other , that required you to take some action in order to continue. Please tell us more about what happened,  using the tick box option descriptions  provided and / or the freehand comments box that will appear when you select this response option',
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
      currentPatient: null,
      currentScenario: 1,
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
      this.categories = catResponse.data.data.map(c => { return {value: c.category_code, label: c.name, tip: c.description} })
    } else {
      this.raiseDataError('Failed to retrieve category information')
    }
    const loadScenariosResponse = await this.populatePatientScenarios(true)
    if (loadScenariosResponse !== true) {
      this.raiseDataError(loadScenariosResponse)
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