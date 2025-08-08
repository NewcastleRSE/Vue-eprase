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
      <ObjectElement name="scenarioDataBody">
        <div class="accordion" id="patientAccordion">
          <div class="accordion-item" v-for="(scenario, idx) in scenarioData" :key="scenario.id">
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

              <div class="tab-content">
              <!-- TODO -->
              </div>

            </div>
          </div>
        </div>
      </div>
      
      </ObjectElement>
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
    ...mapState(assessmentStore, ['dataReady', 'updateAssessmentStatus'])
  },
  data() {
    return {
      
    }
  },
  methods: {  
    
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