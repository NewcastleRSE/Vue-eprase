<template>
  <GroupElement ref="patientBuildGroup" name="patientBuildGroup" class="my-4">  
    <StaticElement name="patientBuildHeading">
      <h2>Patient Entry</h2>
    </StaticElement>
    <StaticElement name="patientListInfo">
      <div class="alert alert-info" role="alert">
        TODO - need some wording here...
      </div>
    </StaticElement>
    <StaticElement name="patientBuildProgress">
      <div class="alert alert-info fw-bold" role="alert">
        {{ `You have entered ${numCompletedPatients} of ${patientData.length} patients` }}
      </div>
      <div v-show="numCompletedPatients != 0" class="progress" role="progressbar" aria-label="Basic example" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-bar" :style="'width: ' + ((numCompletedPatients / patientData.length) * 100) + '%'"></div>
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
  </GroupElement>  
</template>

<script>

import { mapState } from 'pinia'
import { patientDataTabValues } from '../../helpers/common'
import { practiceStore } from '../../stores/practice'
import PatientProfile from '../patientTabs/PatientProfile'
import PatientAllergies from '../patientTabs/PatientAllergies'
import PatientComorbidities from '../patientTabs/PatientComorbidities'
import PatientPresentingComplaints from '../patientTabs/PatientPresentingComplaints'
import PatientCurrentMedication from '../patientTabs/PatientCurrentMedication'
import PatientClinicalData from '../patientTabs/PatientClinicalData'

export default {
  name: 'PatientBuild',
  props: {
    noPatients: {
      type: Number,
      required: true,
      default: 1
    }
  },
  components: {
    PatientProfile,
    PatientAllergies,
    PatientComorbidities,
    PatientPresentingComplaints,
    PatientCurrentMedication,
    PatientClinicalData
  },
  computed: {
    ...mapState(practiceStore, ['dataReady', 'patients', 'getPatientDetails', 'patientListBuild']),
    dataLoaded() {
      return this.dataReady
    },
    patientData() {
      return this.patients
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
      return patientDataTabValues
    },
    numCompletedPatients() {
      return this.completedPatients.length
    }
  },  
  data() {
    return {
      allPatientData: {},
      currentPatient: null,
      completedPatients: []
    }    
  },
  emits: ['allPatientsEntered'],
  methods: {     
    patientAuxiliaryData(type) {
      return (this.currentPatient != null && this.currentPatient in this.allPatientData && Array.isArray(this.allPatientData[this.currentPatient][type])) 
        ? this.allPatientData[this.currentPatient][type] : []     
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
      return this.completedPatients.includes(code)
    },
    openNextUnenteredPatient() {

      console.group('openNextUnenteredPatient()')

      const allCodes = this.patientData.map(p => p.patient_code)
      const doneCodes = this.completedPatients

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
        this.$emit('allPatientsEntered')
      }
      console.groupEnd()
    },
    async setPatientDataEntered(patientCode) {
      console.group('setPatientDataEntered()')
      console.debug('Patient code', patientCode)
      this.completedPatients.push(patientCode)      
      // Time delay of 1s to allow user to see the 'Data entry complete' message on the button before moving to the next one...
      console.debug('Opening next unentered patient...')
      setTimeout(() => {
        this.openNextUnenteredPatient()
      }, 1000)   
      console.groupEnd()       
    }
  },
  async mounted() {
    console.group('PatientBuild mounted()')      
    // NOTE: choice of patient type and number of patients could be chosen by the user via a preliminary form
    const loadPatientsResponse = await this.patientListBuild(this.noPatients, [], 'Adult', true)
    const wasError = await this.errorResponder(loadPatientsResponse)
    if (!wasError) {
      // Get the details for the first (unentered) patient
      this.$nextTick(() => { this.openNextUnenteredPatient() })
    }          
    console.groupEnd()
  }
}
</script>

<style scoped></style>
