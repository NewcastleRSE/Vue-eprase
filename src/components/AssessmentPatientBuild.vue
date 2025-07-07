<template>
  <GroupElement name="patientBuildGroup" :class="'mb-4'">
    <StaticElement name="patientListLoading" v-if="!patientListReady">
      <div class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading patients...</span>
        </div>
      </div>
    </StaticElement>
    <GroupElement name="patientListLoaded" v-if="patientListReady">
      <StaticElement name="patientBuildHeading">
        <h2>Patient build</h2>
      </StaticElement>
      <StaticElement name="patientBuildBody">
        <div class="accordion" id="patientAccordion">
          <div class="accordion-item" v-for="(patient, idx) in patientData" :key="patient.id">
            <h2 class="accordion-header fw-bold primary">
              <button 
                class="accordion-button" 
                type="button" 
                data-bs-toggle="collapse" 
                :data-bs-target="'#patient-' + patient.documentId" 
                aria-expanded="true" 
                :aria-controls="patient.documentId"
              >
                {{ patient.full_name }}
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
                  <div class="tab-pane active" :id="'patient-' + patient.documentId + '-profile'" role="tabpanel" tabindex="0">
                    <img class="img-thumbnail rounded float-start" v-if="patient.gender === 'Male'" src="../assets/images/anon-male.png" alt="male patient" />
                    <img class="img-thumbnail rounded float-start" v-if="patient.gender === 'Female'" src="../assets/images/anon-female.png" alt="female-patient" />
                  </div>
                  <div class="tab-pane" :id="'patient-' + patient.documentId + '-allergy'" role="tabpanel" tabindex="0">
                  Allergy tab
                  </div>
                  <div class="tab-pane" :id="'patient-' + patient.documentId + '-comorbidity'" role="tabpanel" tabindex="0">
                  Comorbidity tab
                  </div>
                  <div class="tab-pane" :id="'patient-' + patient.documentId + '-diagnosis'" role="tabpanel" tabindex="0">
                  Diagnosis tab
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

import { mapState } from 'pinia'
import { assessmentStore } from '../stores/assessment'

export default {
  name: 'AssessmentPatientBuild',  
  computed: {
    ...mapState(assessmentStore, ['patientListBuild', 'assessmentData', 'dataReady', 'updateAssessmentStatus']),
    dataLoaded() {
      return this.dataReady
    },
    patientData() {
      return this.assessmentData.patients
    }  
  },
  watch: {
    async dataLoaded(newVal) {
      if (newVal === true) {
        console.debug('AssessmentPatientBuild - dataLoaded watcher called on completion of previous data operation')        
        const loadPatientsResponse = await this.patientListBuild()
        if (loadPatientsResponse !== true) {
          this.$emit('save-data-fail', loadPatientsResponse)
        }
        this.patientListReady = true
        //document.querySelectorAll('div.') YOU ARE HERE
        console.debug('AssessmentPatientBuild - dataLoaded watcher complete')
      }
    }
  },
  emits: ['get-data-fail', 'save-data-fail'],
  data() {
    return {     
      patientListReady: false 
    }
  },
  methods: {  
    
  },
  async mounted() {
    console.group('AssessmentPatientBuild mounted()')        
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