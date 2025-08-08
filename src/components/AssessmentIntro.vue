<template>
  <GroupElement ref="intro" name="introGroup" :class="'mb-4'">
    <StaticElement name="introHeading">
      <h2>Introduction</h2>
    </StaticElement>
    <StaticElement name="introBody">
      <p>
        The following annual assessment evaluates ePrescribing system performance against a range of indicators.
        You will be asked to admit a series of test patients to your hospital's admissions system, and then 
        prescribe a series of medications to those patients. You will then be asked to record any feedback about 
        how your EP system responds to the prescription, for example, you were able to complete the prescription 
        without any additional user or system input or you were able to complete the prescription with system/user 
        intervention.
      </p>
      <h3>User Instructions</h3>
      <p class="fw-bold">
        The assessment consists of 4 parts: 
      </p>
      <ol class="list-group list-group-numbered">
        <li class="list-group-item d-flex justify-content-between align-items-start">
          <div class="ms-2 me-auto">
            <div class="fw-bold">System Information</div>
            Provide details of the ePrescribing system in use in your hospital.
          </div>
        </li>
        <li class="list-group-item d-flex justify-content-between align-items-start">
          <div class="ms-2 me-auto">
            <div class="fw-bold">Patient Build</div>
            Create test patients with name, date of birth, gender and clinical information.
          </div>
        </li>    
        <li class="list-group-item d-flex justify-content-between align-items-start">
          <div class="ms-2 me-auto">
            <div class="fw-bold">Scenarios</div>
            Prescribe a series of medication to each test patient and provide details about ePrescribing system responses.
          </div>
        </li>
        <li class="list-group-item d-flex justify-content-between align-items-start">
          <div class="ms-2 me-auto">
            <div class="fw-bold">Configuration Questions</div>
            Answer additional questions about your ePrescribing system.
          </div>
        </li>
      </ol>    
      <div class="alert alert-warning mt-4" role="alert">
        <span class="fw-bold">Disclaimer:</span> These patients have been designed to support the test
        tool and may not necessarily resemble real life. <span class="fw-bold fst-italic">Please enter all information exactly as presented.</span>
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
    ...mapState(assessmentStore, ['assessmentData', 'getAssessmentsForInstitution', 'reset']),
  }, 
  async mounted() {
    console.group('AssessmentIntro mounted hook')
    this.reset()
    const instResponse = await this.getAssessmentsForInstitution()
    if (instResponse !== true) {      
      throw new Error(instResponse)
    }
    console.groupEnd()
  }
}
</script>

<style scoped></style>
