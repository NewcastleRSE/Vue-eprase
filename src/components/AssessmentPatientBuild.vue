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
                :data-bs-target="'#patient-' + patient.documentId" 
                aria-expanded="true" 
                :aria-controls="patient.documentId"
              >
                <span class="fw-bold">{{ patient.full_name }}</span>
              </button>
            </h2>
            <div :id="'patient-' + patient.documentId" class="accordion-collapse collapse" :class="idx == 0 ? 'show' : ''" data-bs-parent="#patientAccordion">
              <div class="accordion-body">
                <!-- Nav tabs -->
                <ul class="nav nav-tabs" :id="'patient-' + patient.documentId + '-tabs'" role="tablist">
                  <li class="nav-item" role="presentation">
                    <button 
                      class="nav-link active"                       
                      data-bs-toggle="tab"
                      type="button" 
                      role="tab"
                      :id="'patient-' + patient.documentId + '-profile-tab'" 
                      :data-bs-target="'#patient-' + patient.documentId + '-profile'" >Patient profile
                    </button>
                  </li>
                  <li class="nav-item" role="presentation">
                    <button 
                      class="nav-link"                       
                      data-bs-toggle="tab"
                      type="button" 
                      role="tab"
                      :id="'patient-' + patient.documentId + '-allergy-tab'" 
                      :data-bs-target="'#patient-' + patient.documentId + '-allergy'" >Allergies
                    </button>
                  </li>
                  <li class="nav-item" role="presentation">
                    <button 
                      class="nav-link"                       
                      data-bs-toggle="tab"
                      type="button" 
                      role="tab"
                      :id="'patient-' + patient.documentId + '-comorbidity-tab'" 
                      :data-bs-target="'#patient-' + patient.documentId + '-comorbidity'" >Comorbidities
                    </button>
                  </li>
                  <li class="nav-item" role="presentation">
                    <button 
                      class="nav-link"                       
                      data-bs-toggle="tab"
                      type="button" 
                      role="tab"
                      :id="'patient-' + patient.documentId + '-comorbidity-tab'" 
                      :data-bs-target="'#patient-' + patient.documentId + '-diagnosis'" >Diagnoses
                    </button>
                  </li>
                </ul>

                <!-- Tab panes -->
                <div class="tab-content">
                  <!-- Profile tab -->
                  <div class="tab-pane active mt-2 d-flex" :id="'patient-' + patient.documentId + '-profile'" role="tabpanel" tabindex="0">
                    <div>
                      <img style="width: 150px; height: 150px" v-if="patient.gender === 'Male'" src="../assets/images/anon-male.png" alt="male patient" />
                      <img style="width: 150px; height: 150px" v-if="patient.gender === 'Female'" src="../assets/images/anon-female.png" alt="female-patient" />
                    </div>
                    <div class="flex-grow-1">
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
                  <div class="tab-pane" :id="'patient-' + patient.documentId + '-allergy'" role="tabpanel" tabindex="0">
                    <div v-if="!dataLoaded" class="d-flex justify-content-center">
                      <div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading Allergies...</span>
                      </div>
                    </div>
                    <div v-if="dataLoaded">
                    </div>
                  </div>
                  <div class="tab-pane" :id="'patient-' + patient.documentId + '-comorbidity'" role="tabpanel" tabindex="0">
                    <div v-if="!dataLoaded" class="d-flex justify-content-center">
                      <div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading Comorbidities...</span>
                      </div>
                    </div>
                    <div v-if="dataLoaded">
                    </div>
                  </div>
                  <div class="tab-pane" :id="'patient-' + patient.documentId + '-diagnosis'" role="tabpanel" tabindex="0">
                    <div v-if="!dataLoaded" class="d-flex justify-content-center">
                      <div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading Diagnoses...</span>
                      </div>
                    </div>
                    <div v-if="dataLoaded">
                    </div>
                  </div>
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
    ...mapState(assessmentStore, ['patientListBuild', 'getPatientDetails', 'assessmentData', 'dataReady', 'updateAssessmentStatus']),
    dataLoaded() {
      return this.dataReady
    },
    patientData() {
      return this.assessmentData.patients
    }  
  },  
  emits: ['get-data-fail', 'save-data-fail'],
  data() {
    return {
      allPatientData: {}
    }    
  },
  methods: {      
    // Patient DOB is random date within last 12 months, adjusted by their stored age
    formatDOB(patient) {
      dayjs.extend(customParseFormat)
      return dayjs().subtract(Math.random() * 365, 'day').subtract(patient.age, 'year').format('DD/MM/YYYY')
    },
    async patientRelations(docId) {      
      const ret = await this.getPatientDetails(docId, true)
      if (ret !== false) {
        this.allPatientData[docId] = ret
      } else {
        this.$emit('get-data-fail', 'Failed to retrieve relations for patient with document id', docId)
      }
    }
  },
  async mounted() {
    console.group('AssessmentPatientBuild mounted()')      
    const loadPatientsResponse = await this.patientListBuild(true)
    if (loadPatientsResponse !== true) {
      this.$emit('save-data-fail', loadPatientsResponse)
    }
    if (this.dataReady) {
      const accordionDiv = document.querySelector('div.accordion')
      accordionDiv.addEventListener('shown.bs.collapse', (evt) => {
        const docId = evt.target.id.replace('patient-', '')
        this.patientRelations(docId)
      })
      // Get the details for the first (open) patient
      this.patientRelations(this.patientData[0].documentId)
    }
    console.groupEnd()
  },
  async beforeUnmount() {
    console.group('AssessmentPatientBuild beforeUnmount()')
    console.assert(this.dataLoaded, 'AssessmentPatientBuild beforeUnmount() hook - dataReady flag is false')
    const updateResponse = await this.updateAssessmentStatus('Patient build complete', true)
    if (updateResponse !== true) {
      this.$emit('save-data-fail', updateResponse)
    }
    console.groupEnd()
  }
}
</script>

<style scoped></style>