<template>
  <GroupElement name="patientBuildGroup" :class="'mb-4'">
    <StaticElement name="patientListLoading" v-if="!dataLoaded">
      <div class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading patients...</span>
        </div>
      </div>
    </StaticElement>
    <GroupElement name="patientListLoaded" v-if="dataLoaded">
      <StaticElement name="patientBuildHeading">
        <h2>Patient build</h2>
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
            <div :id="'patient-' + patient.patient_code" class="accordion-collapse collapse" :class="currentPatient == patient.documentId ? 'show' : ''" data-bs-parent="#patientAccordion">
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
                              <tr><th>Age</th><td>{{ patient.age }}</td></tr>
                              <tr><th>Gender</th><td>{{ patient.gender }}</td></tr>
                              <tr><th>Height (m)</th><td>{{ patient.height }}</td></tr>
                              <tr><th>Weight (kg)</th><td>{{ patient.weight }}</td></tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>                    
                  </div>
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
                  <div class="tab-pane fade mt-2" :id="'patient-' + patient.patient_code + '-prescription'" role="tabpanel" tabindex="0">
                    <div v-if="!dataLoaded" class="d-flex justify-content-center">
                      <div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading Medication History...</span>
                      </div>
                    </div>
                    <div v-if="dataLoaded">
                      <p v-if="patientMedicationHistory.length == 0">No medication history</p>
                      <table class="table table-striped" v-if="patientMedicationHistory.length != 0">
                        <tbody>
                          <tr>
                            <th>Name</th>
                            <th>Dose</th>
                            <th>Route</th>
                            <th>Frequency</th>
                            <th>Duration</th>
                            <th>Justification</th>
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
    </GroupElement>    
  </GroupElement>  
</template>

<script>

import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { mapState } from 'pinia'
import { assessmentStore } from '../stores/assessment'

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
        'diagnosis': 'Presenting complaints',
        'prescription': 'Medication history',
        'clinical_data': 'Clinical data'
      }
    }
  },  
  data() {
    return {
      allPatientData: {},
      currentPatient: null
    }    
  },
  methods: {    
    patientAuxiliaryData(type) {
      return (this.currentPatient != null && this.currentPatient in this.allPatientData && Array.isArray(this.allPatientData[this.currentPatient][type])) 
        ? this.allPatientData[this.currentPatient][type] : []     
    },      
    // Patient DOB is random date within last 12 months, adjusted by their stored age
    formatDOB(patient) {
      dayjs.extend(customParseFormat)
      return dayjs().subtract(Math.random() * 365, 'day').subtract(patient.age, 'year').format('DD/MM/YYYY')
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
  async mounted() {
    console.group('AssessmentPatientBuild mounted()')  
    // This rather convoluted code ensures that the patient data being entered ends up on the screen, 
    // rather than the user having to scroll down to see it...
    const accordionItems = document.querySelectorAll('.accordion-collapse')
    const acc = document.getElementById('patientAccordion')
    console.debug('Accordion items', accordionItems, 'accordion', acc)
    accordionItems.forEach((el) => {
      el.addEventListener('shown.bs.collapse', (e) => {
        console.debug('shown.bs.collapse handler()')
        var scrollOffset = acc.scrollTop + el.parentNode.offsetTop
        acc.scroll({
          top: scrollOffset,
          left: 0, 
          behavior: 'smooth'
        })
      })
    })   
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

<style scoped></style>