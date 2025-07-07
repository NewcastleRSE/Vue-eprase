<template>
  <GroupElement ref="intro" name="introGroup" :class="'mb-4'">
    <StaticElement name="introHeading">
      <h2>Introduction</h2>
    </StaticElement>
    <StaticElement name="introBody">
      <p>
        The following annual assessment evaluates ePrescribing system performance against a range of indicators.
        You will be asked to admit a series of test patients to your hospital's admissions system, and then 
        prescribe a series of medications to those patients. You will then be asked to provide feedback about any 
        advice or intervention from the system
      </p>
      <h3>User instructions</h3>
      <p class="fw-bold">
        The assessment comprises 4 parts: 
      </p>
      <ol class="list-group list-group-numbered">
        <li class="list-group-item d-flex justify-content-between align-items-start">
          <div class="ms-2 me-auto">
            <div class="fw-bold">System information</div>
            Give details of the ePrescribing system in use in your hospital
          </div>
        </li>
        <li class="list-group-item d-flex justify-content-between align-items-start">
          <div class="ms-2 me-auto">
            <div class="fw-bold">Patient build</div>
            Create test patients with name, date of birth and gender, and add clinical information for each patient
          </div>
        </li>    
        <li class="list-group-item d-flex justify-content-between align-items-start">
          <div class="ms-2 me-auto">
            <div class="fw-bold">Scenarios</div>
            Attempt to prescribe a series of medications to each test patient, and give details about ePrescribing system responses
          </div>
        </li>
        <li class="list-group-item d-flex justify-content-between align-items-start">
          <div class="ms-2 me-auto">
            <div class="fw-bold">Configuration questions</div>
            Answer additional questions about your ePrescribing system
          </div>
        </li>
      </ol>    
      <div class="alert alert-warning mt-4" role="alert">
        <span class="fw-bold">Disclaimer:</span> these patients have been designed to support the test
        tool and may not necessarily resemble real life. <span class="fw-bold fst-italic">Please enter all information exactly as presented</span>
      </div>
    </StaticElement>
  </GroupElement>  
</template>

<script>

import { mapState } from 'pinia'
import { assessmentStore } from '../stores/assessment'

export default {
  name: "AssessmentIntro", 
  computed: {
    ...mapState(assessmentStore, ['assessmentData', 'getAssessmentsForInstitution']),
  }, 
  emits: ['get-data-fail'],
  async mounted() {
    console.group('AssessmentIntro mounted hook')
    const instResponse = await this.getAssessmentsForInstitution()
    if (instResponse !== true) {      
      this.$emit('get-data-fail', instResponse)
    }
    console.groupEnd()
  }
}
</script>

<style scoped></style>
