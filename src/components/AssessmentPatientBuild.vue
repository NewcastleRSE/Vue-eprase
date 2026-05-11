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
                <PatientProfile :patient="patient" :dataLoaded="dataLoaded" />
                <PatientAllergies :patient="patient" :patientAllergies="patientAllergies" :dataLoaded="dataLoaded" />
                <PatientComorbidities :patient="patient" :patientComorbidities="patientComorbidities" :dataLoaded="dataLoaded" />
                <PatientPresentingComplaints :patient="patient" :patientPresentingComplaints="patientPresentingComplaints" :dataLoaded="dataLoaded" />                                                
                <PatientCurrentMedication :patient="patient" :patientCurrentMedication="patientMedicationHistory" :dataLoaded="dataLoaded" />
                <PatientClinicalData :patient="patient" :patientClinicalData="patientClinicalData" :dataLoaded="dataLoaded" />                
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

import { mapState } from 'pinia'
import { assessmentStore } from '../stores/assessment'
import { Validator } from '@vueform/vueform'
import { appSettingsStore } from '../stores/appSettings'
import PatientProfile from './patientTabs/PatientProfile'
import PatientAllergies from './patientTabs/PatientAllergies'
import PatientComorbidities from './patientTabs/PatientComorbidities'
import PatientPresentingComplaints from './patientTabs/PatientPresentingComplaints'
import PatientCurrentMedication from './patientTabs/PatientCurrentMedication'
import PatientClinicalData from './patientTabs/PatientClinicalData'

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
  components: {
    PatientProfile,
    PatientAllergies,
    PatientComorbidities,
    PatientPresentingComplaints,
    PatientCurrentMedication,
    PatientClinicalData
  },
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
    docIdFromTabBtnId(tabId) {
      return tabId.replace(/^accordion-btn-([a-z0-9]+)$/, '\$1')
    },
    completedPatientsArray() {
      return !this.assessmentData.completedPatients ? [] : this.assessmentData.completedPatients.split(',')
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
        const patientElement = document.getElementById('patient-' + nextCode)
        if (patientElement != null) {
          this.$nextTick(() => { 
            console.debug('Scroll patient', nextCode, 'into view')
            document.getElementById('patient-' + nextCode).scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'nearest'
            })
          })            
        }            
      } else {
        console.debug('No unentered patients left')
      }
      console.groupEnd()
    },
    async setPatientDataEntered(patientCode) {
      console.group('setPatientDataEntered()')
      console.debug('Patient code', patientCode)
      const spdeResponse = await this.setPatientEntryComplete(patientCode)
      console.debug('Response', spdeResponse)
      const wasError = await this.errorResponder(spdeResponse)
      if (!wasError) {
        // Time delay of 1s to allow user to see the 'Data entry complete' message on the button before moving to the next one...
        console.debug('Opening next unentered patient...')
        setTimeout(() => {
          this.openNextUnenteredPatient()
        }, 1000)   
      }  
      console.groupEnd()       
    }
  },
  async mounted() {
    console.group('AssessmentPatientBuild mounted()')  
    // Absolutely critical line which disables the 'continue to scenarios' button when no patients have been entered...
    this.completedPatientsHidden.validate()
    const loadPatientsResponse = await this.patientListBuild(true)
    const wasError = await this.errorResponder(loadPatientsResponse)
    if (!wasError) {
      // Get the details for the first (unentered) patient
      this.$nextTick(() => { this.openNextUnenteredPatient() })
    }          
    console.groupEnd()
  }, 
  async beforeUnmount() {
    console.group('AssessmentPatientBuild beforeUnmount()')
    console.assert(this.dataLoaded, 'AssessmentPatientBuild beforeUnmount() hook - dataReady flag is false')
    if (this.completedPatientsArray().length == this.patientData.length) {
      // We have done all the data entry now
      const updateResponse = await this.updateAssessmentStatus('Patient build complete', true)
      await this.errorResponder(updateResponse)
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