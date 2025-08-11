<template>
  <GroupElement name="scenarioGroup" :class="'mb-4'">
    <StaticElement name="scenarioDataLoading" v-if="!dataReady">
      <div class="d-flex align-items-center">
        <strong role="status">Loading scenario data for assessment...</strong>
        <div class="spinner-border ms-auto" aria-hidden="true"></div>
      </div>
    </StaticElement>
    <GroupElement name="scenarioDataLoaded">
      <StaticElement name="scenarioHeading">
        <h2>Scenarios</h2>
        <h3>Please follow the instructions for each scenario</h3>
      </StaticElement>
      <StaticElement name="scenarioDataBody">
        <div class="accordion" id="patientAccordion">
          <div class="accordion-item" v-for="(patient, idx) in patientData" :key="patient.id">
            <h2 class="accordion-header primary">
              <button 
                class="accordion-button" 
                type="button" 
                data-bs-toggle="collapse"
                :id="'accordion-btn-' + patient.patient_code" 
                :class="currentPatient == patient.patient_code ? '' : 'collapsed'"
                :data-bs-target="'#patient-' + patient.patient_code" 
                :aria-expanded="currentPatient == patient.patient_code" 
                :aria-controls="patient.patient_code"
                @click="patientScenarios(patient.patient_code)"
              >
                <span class="fw-bold">Patient: {{ patient.full_name }}, age {{ patient.age }}</span>
              </button>
            </h2>
            <div
              class="accordion-collapse collapse"  
              data-bs-parent="#patientAccordion"
              :id="'patient-' + patient.patient_code" 
              :class="currentPatient == patient.patient_code ? 'show' : ''"               
            >
            <div v-if="!dataLoaded">
              <div class="d-flex justify-content-center">
                <div class="spinner-border" role="status">
                  <span class="visually-hidden">Loading scenario data for patient...</span>
                </div>
              </div>
            </div>
            <div v-if="dataLoaded" class="accordion-body">
            Accordion body
              <!-- Scenario navigation tabs -->              
              <!-- <ul class="nav nav-tabs" :id="'patient-' + patient.patient_code + '-scenario-tabs'" role="tablist">
                <li v-for="(pcode, scenarioData, index) in patientScenarios(patient.patient_code)" class="nav-item" role="presentation">
                  <button 
                    class="nav-link" data-bs-toggle="tab" type="button" role="tab"
                    :class="index == 0 ? 'active' : ''"                      
                    :id="'scenario-' + scenarioData.scenario_code + '-tab'" 
                    :data-bs-target="'#scenario-' + scenarioData.scenario_code">{{ 'Scenario ' + index }}
                  </button>
                </li>                  
              </ul>

              <div class="tab-content"-->
                <!-- Scenario tabs -->
                <!-- <div class="tab-pane fade active mt-2" v-for="(pcode, scenarioData, index) in patientScenarios(patient.patient_code)" 
                  :id="'scenario-' + scenarioData.scenario_code" 
                  role="tabpanel" 
                  tabindex="0"
                >                 
                  <div class="d-flex">
                    Scenario here...
                  </div>
                </div>
              </div> -->
            </div>
          </div>
        </div>
      </div>
      
      </StaticElement>
      <!-- TODO -->
    </GroupElement>      
  </GroupElement>
</template>

<script>

import { mapState } from 'pinia'
import { assessmentStore } from '../stores/assessment'

export default {
  name: 'AssessmentScenario',
  computed: {
    ...mapState(assessmentStore, ['dataReady', 'assessmentData', 'updateAssessmentStatus', 'getPatientScenarios']),
    dataLoaded() {
      return this.dataReady
    },
    patientData() {
      return this.assessmentData.patients
    }
  },
  data() {
    return {
      allScenarioData: {},
      currentPatient: null,
      allScenariosCompleted: false  // Pro-tem
    }
  },
  methods: {  
    async patientScenarios(patientCode) {
      this.currentPatient = patientCode
      if ( !(patientCode in this.allPatientData)) {      
        const details = await this.getPatientScenarios(patientCode, true)
        if (details !== false) {
          this.allScenarioData[patientCode] = details
        } else {
          throw new Error(`Failed to retrieve scenarios for patient with code ${this.currentPatient}`)
        }
      }
      return this.allScenarioData[patientCode]
    },
    openNextUnenteredPatient() {

      //TODO
      console.group('openNextUnenteredPatient()')

      const allCodes = this.patientData.map(p => p.patient_code)
      const doneCodes = this.completedPatientsArray()

      if (allCodes.length > doneCodes.length) {
        // Still some to do
        const notDoneCodes = allCodes.filter(c => !doneCodes.includes(c))
        const nextCode = notDoneCodes.shift()
        const docId = this.patientData.filter(p => p.patient_code == nextCode)[0].documentId
        this.patientRelations(docId)  
        document.getElementById('patient-' + nextCode).scrollIntoView()    
      } else {
        console.debug('No unentered patients left')
      }
      console.groupEnd()
    },
    async setPatientDataEntered(patientCode) {
      const spdeResponse = await this.setPatientEntryComplete(patientCode)
      if (spdeResponse !== true) {
        throw new Error(spdeResponse)
      }
      this.openNextUnenteredPatient()
    }
  },
  mounted() {
    console.group('AssessmentScenario mounted()')
    console.groupEnd()
  },
  beforeUnmount() {
    console.group('AssessmentScenario beforeUnmount()')
    console.groupEnd()
  }
}
</script>

<style scoped></style>