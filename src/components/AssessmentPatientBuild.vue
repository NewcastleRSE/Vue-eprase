<template>
  <GroupElement ref="patientBuildGroup" name="patientBuildGroup" :class="'mb-4'">  
    <StaticElement name="patientBuildHeading">
      <h2>Patient Build</h2>
    </StaticElement>
    <StaticElement name="patientListInfo">
      <div class="alert alert-info mt-2" role="alert">
        Please admit the following test patients into your hospital's patient admissions system (or a test environment). 
        When registering new test patients you can use any dummy information required to complete the process e.g. fictional GP details. 
        You will need to enter additional clinical information for each test patient, these are presented in the other named tabs. 
        Please work carefully through these in order for the subsequent scenarios to work correctly. When you have finished entering all 
        the information for a patient, click the <span class="fw-bold">Data entry in progress</span> button which will change to 
        <span class="fw-bold">Data entry complete</span> and move you to the next patient. If you need to go back to a previous patient 
        you can navigate back and forth between all patients within the patient build section.
      </div>
    </StaticElement>
    <HiddenElement name="completedPatients" :rules="[allPatientsCompleted]" />    
    <StaticElement name="patientBuildProgress" class="mb-4">
      <div class="alert alert-info fw-bold" role="alert">
        {{ `You have entered ${completedPatientsArray().length} of ${patientData.length} patients` }}
      </div>
      <div v-show="completedPatientsArray().length != 0" class="progress" role="progressbar" aria-label="Basic example" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-bar" :style="'width: ' + ((completedPatientsArray().length / patientData.length) * 100) + '%'"></div>
      </div>
    </StaticElement>
    <StaticElement name="patientBuildBody">
      <div class="accordion" id="patientAccordion">
        <div class="accordion-item" v-for="(patient, idx) in patientData" :key="patient.id">
          <h2 class="accordion-header primary">
            <button 
              class="accordion-button" 
              type="button" 
              data-bs-toggle="collapse"
              :id="'accordion-btn-' + patient.patient_code" 
              :class="currentPatient == patient.documentId ? '' : 'collapsed'"
              :data-bs-target="'#patient-' + patient.patient_code" 
              :aria-expanded="currentPatient == patient.documentId" 
              :aria-controls="patient.patient_code"
              @click="patientRelations(patient.documentId)"
            >
              <span class="fw-bold">{{ patient.full_name }}</span>
            </button>
          </h2>
          <div
            class="accordion-collapse collapse"  
            data-bs-parent="#patientAccordion"
            :id="'patient-' + patient.patient_code" 
            :class="currentPatient == patient.documentId ? 'show' : ''"               
          >
            <div class="accordion-body">
              <!-- Nav tabs -->
              <ul class="nav nav-tabs" :id="'patient-' + patient.patient_code + '-tabs'" role="tablist">
                <li v-for="(value, key, index) in patientDataTabs" class="nav-item" role="presentation">
                  <button 
                    class="nav-link" data-bs-toggle="tab" type="button" role="tab"
                    :class="index == 0 ? 'active' : ''"                      
                    :id="'patient-' + patient.patient_code + '-' + key + '-tab'" 
                    :data-bs-target="'#patient-' + patient.patient_code + '-' + key">{{ value }}
                  </button>
                </li>                  
              </ul>

              <!-- Tab panes -->
              <div class="tab-content">
                <!-- Profile tab -->
                <div class="tab-pane fade active show mt-2" :id="'patient-' + patient.patient_code + '-profile'" role="tabpanel" tabindex="0">
                  <div v-if="!dataLoaded" class="d-flex justify-content-center">
                    <div class="spinner-border" role="status">
                      <span class="visually-hidden">Loading Profile...</span>
                    </div>
                  </div>
                  <div v-if="dataLoaded">
                    <div class="d-flex">
                      <div class="p-2">
                        <img style="width: 150px; height: 150px" v-if="patient.gender === 'Male'" src="../assets/images/anon-male.png" alt="male patient" />
                        <img style="width: 150px; height: 150px" v-if="patient.gender === 'Female'" src="../assets/images/anon-female.png" alt="female-patient" />                          
                      </div>
                      <div class="p-2 flex-grow-1">
                        <table class="table table-striped">
                          <tbody>
                            <tr><th>First name</th><td>{{  patient.first_name }}</td></tr>
                            <tr><th>Surname</th><td>{{  patient.surname }}</td></tr>
                            <tr><th>DOB</th><td>{{ formatDOB(patient) }}</td></tr>
                            <tr v-if="patient.age_years != 0"><th>Age</th><td>{{ patient.age_years }} years</td></tr>
                            <tr v-if="patient.age_days != 0"><th>Age</th><td>{{ patient.age_days }} days</td></tr>
                            <tr v-if="patient.gestational_age != 0"><th>Gestational age</th><td>{{ patient.gestational_age }} weeks</td></tr>
                            <tr><th>Gender</th><td>{{ patient.gender }}</td></tr>
                            <tr><th>Height (m)</th><td>{{ patient.height }}</td></tr>
                            <tr><th>Weight (kg)</th><td>{{ patient.weight }}</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>                    
                </div>
                <!-- Allergy tab -->
                <div class="tab-pane fade mt-2 " :id="'patient-' + patient.patient_code + '-allergy'" role="tabpanel" tabindex="0">
                  <div v-if="!dataLoaded" class="d-flex justify-content-center">
                    <div class="spinner-border" role="status">
                      <span class="visually-hidden">Loading Allergies...</span>
                    </div>
                  </div>
                  <div v-if="dataLoaded">
                    <p v-if="patientAllergies.length == 0">No allergies</p>
                    <table class="table table-striped" v-if="patientAllergies.length != 0">
                      <tbody>
                        <tr v-for="allergy in patientAllergies">
                          <td>{{  allergy.allergy }}</td>
                        </tr>                         
                      </tbody>
                    </table>
                  </div>
                </div>
                <!-- Comorbidity tab -->
                <div class="tab-pane fade mt-2" :id="'patient-' + patient.patient_code + '-comorbidity'" role="tabpanel" tabindex="0">
                  <div v-if="!dataLoaded" class="d-flex justify-content-center">
                    <div class="spinner-border" role="status">
                      <span class="visually-hidden">Loading Comorbidities...</span>
                    </div>
                  </div>
                  <div v-if="dataLoaded">
                    <p v-if="patientComorbidities.length == 0">No comorbidities</p>
                    <table class="table table-striped" v-if="patientComorbidities.length != 0">
                      <tbody>
                        <tr v-for="comorbidity in patientComorbidities">
                          <td>{{  comorbidity.comorbidity }}</td>
                        </tr>  
                      </tbody>
                    </table>
                  </div>
                </div>
                <!-- Presenting complaints tab -->
                <div class="tab-pane fade mt-2" :id="'patient-' + patient.patient_code + '-diagnosis'" role="tabpanel" tabindex="0">
                  <div v-if="!dataLoaded" class="d-flex justify-content-center">
                    <div class="spinner-border" role="status">
                      <span class="visually-hidden">Loading Presenting Complaints...</span>
                    </div>
                  </div>
                  <div v-if="dataLoaded">
                    <p v-if="patientPresentingComplaints.length == 0">No presenting complaints</p>
                    <table class="table table-striped" v-if="patientPresentingComplaints.length != 0">
                      <tbody>
                        <tr v-for="complaint in patientPresentingComplaints">
                          <td>{{ complaint.diagnosis }}</td>
                        </tr>  
                      </tbody>
                    </table>
                  </div>
                </div>
                <!-- Current medication tab -->
                <div class="tab-pane fade mt-2" :id="'patient-' + patient.patient_code + '-prescription'" role="tabpanel" tabindex="0">
                  <div v-if="!dataLoaded" class="d-flex justify-content-center">
                    <div class="spinner-border" role="status">
                      <span class="visually-hidden">Loading Current Medication...</span>
                    </div>
                  </div>
                  <div v-if="dataLoaded">
                    <p v-if="patientMedicationHistory.length == 0">No current medication</p>
                    <table class="table table-striped" v-if="patientMedicationHistory.length != 0">
                      <tbody>
                        <tr>
                          <th>Name</th>
                          <th>Dose</th>
                          <th>Route</th>
                          <th>Frequency</th>
                          <th>Duration</th>
                          <th>Indication</th>
                        </tr>
                        <tr v-for="prescription in patientMedicationHistory">
                          <td>{{ prescription.name }}</td>
                          <td>{{ prescription.dose }}</td>
                          <td>{{ prescription.route }}</td>
                          <td>{{ prescription.frequency }}</td>
                          <td>{{ prescription.duration }}</td>
                          <td>{{ prescription.justification }}</td>
                        </tr>  
                      </tbody>
                    </table>
                  </div>
                </div>
                <!-- Clinical data tab -->
                <div class="tab-pane fade mt-2" :id="'patient-' + patient.patient_code + '-clinical_data'" role="tabpanel" tabindex="0">
                  <div v-if="!dataLoaded" class="d-flex justify-content-center">
                    <div class="spinner-border" role="status">
                      <span class="visually-hidden">Loading Clinical Data...</span>
                    </div>
                  </div>
                  <div v-if="dataLoaded">
                    <p v-if="patientClinicalData.length == 0">No clinical data</p>
                    <table class="table table-striped" v-if="patientClinicalData.length != 0">
                      <tbody>                         
                        <tr v-for="clinicalData in patientClinicalData">
                          <td>{{ clinicalData.clinical_datum }}</td>
                        </tr>  
                      </tbody>
                    </table>
                  </div>
                </div>
                <ButtonElement 
                  :name="'done-patient-' + patient.patient_code" 
                  :columns="6" 
                  :title="patientDataEntered(patient.patient_code) ? 'You have entered all the data for this patient' : 'Click when you have finished entering patient data, and move on to the next one'"
                  @click="setPatientDataEntered(patient.patient_code)"
                >                    
                  {{ patientDataEntered(patient.patient_code) ? 'Data entry complete' : 'Data entry in progress' }}
                  <i class="bi ms-2" :class="patientDataEntered(patient.patient_code) ? 'bi-check-circle-fill' : 'bi-three-dots'"></i>
                </ButtonElement>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StaticElement>
    <StaticElement v-show="this.completedPatientsArray().length == patientData.length" name="patientListEntryComplete">
      <div class="alert alert-info" role="alert">
        You have now completed all the patient entries, please click 'Continue to Scenarios' below to begin entering the prescription scenarios
      </div>
    </StaticElement>    
  </GroupElement>  
</template>

<script>

import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { mapState } from 'pinia'
import { assessmentStore } from '../stores/assessment'
import { Validator } from '@vueform/vueform'
import { appSettingsStore } from '../stores/appSettings'

const allPatientsCompleted = class extends Validator {
  get msg() {
    return 'Please enter all patients into your system'
  }
  check(value) {
    console.debug('allPatientsCompleted() validator entered with', value)
    return value && value.split(',').length == appSettingsStore().assessmentNumPatients
  }
}

export default {
  name: 'AssessmentPatientBuild',
  computed: {
    ...mapState(assessmentStore, ['patientListBuild', 'getPatientDetails', 'assessmentData', 'dataReady', 'updateAssessmentStatus', 'setPatientEntryComplete']),
    dataLoaded() {
      return this.dataReady
    },
    patientData() {
      return this.assessmentData.patients
    },    
    patientAllergies() {
      return this.patientAuxiliaryData('allergies')
    },
    patientComorbidities() {
      return this.patientAuxiliaryData('comorbidities')
    },
    patientPresentingComplaints() {
      return this.patientAuxiliaryData('diagnoses')
    },
    patientMedicationHistory() {
      return this.patientAuxiliaryData('prescriptions')
    },
    patientClinicalData() {
      return this.patientAuxiliaryData('clinical_data')
    },
    patientDataTabs() {
      return {
        'profile': 'Profile',
        'allergy': 'Allergies',
        'comorbidity': 'Comorbidities',
        'diagnosis': 'Presenting Complaints',
        'prescription': 'Current Medication',
        'clinical_data': 'Clinical Data'
      }
    },
    completedPatientsHidden() {
      console.log('Hidden element is', this.$refs.patientBuildGroup)
      return this.$refs.patientBuildGroup
    }
  },  
  data() {
    return {
      allPatientData: {},
      currentPatient: null,
      allPatientsCompleted
    }    
  },
  methods: {    
    patientAuxiliaryData(type) {
      return (this.currentPatient != null && this.currentPatient in this.allPatientData && Array.isArray(this.allPatientData[this.currentPatient][type])) 
        ? this.allPatientData[this.currentPatient][type] : []     
    },      
    // Patient DOB is random date within last 12 months, adjusted by their stored age (modified to account for the 3 possible age fields)
    formatDOB(patient) {
      dayjs.extend(customParseFormat)
      if (patient.age_years >0) {
        return dayjs().subtract(Math.random() * 365, 'day').subtract(patient.age_years, 'year').format('DD/MM/YYYY')
      } else if (patient.age_days > 0) {
        return dayjs().subtract(patient.age_days, 'day').format('DD/MM/YYYY')
      } else if (patient.gestational_age > 0) {
        return dayjs().subtract(patient.gestational_age, 'week').format('DD/MM/YYYY')
      }      
    },    
    docIdFromTabBtnId(tabId) {
      return tabId.replace(/^accordion-btn-([a-z0-9]+)$/, '\$1')
    },
    completedPatientsArray() {
      return this.assessmentData.completedPatients == '' ? [] : this.assessmentData.completedPatients.split(',')
    },
    async patientRelations(docId) {
      this.currentPatient = docId
      if ( !(docId in this.allPatientData)) {      
        const details = await this.getPatientDetails(docId, true)
        if (details !== false) {
          this.allPatientData[docId] = details
        } else {
          throw new Error(`Failed to retrieve relations for patient with document id ${this.currentPatient}`)
        }
      }
      return this.allPatientData[docId]
    },
    patientDataEntered(code) {
      return this.completedPatientsArray().includes(code)
    },
    openNextUnenteredPatient() {

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
      // Time delay to allow user to see the 'Data entry complete' message on the button before moving to the next one...
      setTimeout(() => {
        this.openNextUnenteredPatient()
      }, 1000)      
    }
  },
  async mounted() {
    console.group('AssessmentPatientBuild mounted()')  
    // Absolutely critical line which disables the 'continue to scenarios' button when no patients have been entered...
    this.completedPatientsHidden.validate()
    const loadPatientsResponse = await this.patientListBuild(true)
    if (loadPatientsResponse !== true) {
      throw new Error(loadPatientsResponse)
    }       
    // Get the details for the first (unentered) patient
    this.openNextUnenteredPatient()      
    console.groupEnd()
  }, 
  async beforeUnmount() {
    console.group('AssessmentPatientBuild beforeUnmount()')
    console.assert(this.dataLoaded, 'AssessmentPatientBuild beforeUnmount() hook - dataReady flag is false')
    if (this.completedPatientsArray().length == this.patientData.length) {
      // We have done all the data entry now
      const updateResponse = await this.updateAssessmentStatus('Patient build complete', true)
      if (updateResponse !== true) {
        throw new Error(updateResponse)
      }
    }    
    console.groupEnd()
  }
}
</script>

<style scoped>

div#patientAccordion {
  margin-bottom: 4rem;
}

</style>