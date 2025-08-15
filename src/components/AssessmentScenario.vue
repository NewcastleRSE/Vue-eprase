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
        <h3>Please follow the instructions for each scenario</h3>
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
                        <tr>
                          <td rowspan="5">
                            <RadiogroupElement name="outcome" :items="systemResponses" />
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
    ...mapState(assessmentStore, ['dataReady', 'assessmentData', 'updateAssessmentStatus', 'populatePatientScenarios']),
    ...mapState(rootStore, ['getMitigations']),
    dataLoaded() {
      return this.dataReady
    },
    patientData() {
      return this.assessmentData.patients
    },
    patientScenarios() {
      return this.assessmentData.scenarios
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
    }
  },
  data() {
    return {
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
  },
  async mounted() {
    console.group('AssessmentScenario mounted()')
    const mitResponse = await this.getMitigations()
    if (mitResponse.status < 400) {
      this.mitigationCodes = Object.fromEntries(mitResponse.data.data.map(m => [m.mitigation_code, m.mitigation]))
    } else {
      throw new Error('Failed to retrieve mitigation code information')
    }
    const loadScenariosResponse = await this.populatePatientScenarios(true)
    if (loadScenariosResponse !== true) {
      throw new Error(loadScenariosResponse)
    }
    console.groupEnd()
  },
  beforeUnmount() {
    console.group('AssessmentScenario beforeUnmount()')
    console.groupEnd()
  }
}
</script>

<style scoped></style>