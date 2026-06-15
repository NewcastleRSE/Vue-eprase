<template>
  <GroupElement ref="intro" name="introGroup" :class="'mb-4'">
    <StaticElement name="introHeading">
      <h2>Introduction</h2>
    </StaticElement>
    <GroupElement v-if="!requirementsConfirmed" name="introChecklist" class="alert alert-warning">
      <StaticElement name="checklistPreamble"><h3>Before you start the assessment, please complete the checklist below to ensure:</h3></StaticElement>
      <CheckboxgroupElement
        ref="checklist"
        name="preparedChecklist"
        @change="updateTicklist"
        :items="[
          'You have allocated 4-6 hours for patient setup and scenario testing (split sessions)',
          'You can register patients with specific demographics',
          'You have good operational understanding of the ePrescribing system',
          'You can prescribe without restrictions'
        ]"
        :messages="{required: 'Please tick all 4 boxes to confirm', 'size': 'Please tick all 4 boxes to confirm'}"
        :rules="['required', 'size:4']"
      />
      <ButtonElement name="confirmPrepared" class="mt-2" 
        :columns="4" 
        :disabled="!itemsTicked || itemsTicked.length != 4"
        @click="setConfirmation"
      >I confirm all the above are the case
      </ButtonElement>
      <StaticElement name="checklistPostamble">
        <p>
          It is recommended that users new to the ePRaSE tool try the <a href="/practice" target="_blank" title="Try practice mode in a new tab">practice mode (opens in new tab)</a> 
          and watch the <a href="Javascript:alert('Need URL for video here')" title="Watch video in a new tab">instruction video (opens in new tab)</a> before proceedoing further.
        </p>
      </StaticElement>
    </GroupElement>
    <StaticElement v-if="requirementsConfirmed" name="introBody">
      <p>
        The following annual assessment evaluates ePrescribing system performance against a range of indicators.
        You will be asked to admit a series of test patients to your hospital's admissions system, and then 
        prescribe a series of medications to those patients. You will then be asked to record any feedback about 
        how your ePrescribing system responds to the prescription, for example, you were able to complete the prescription 
        without any additional user or system input or you were able to complete the prescription with system/user 
        intervention.
      </p>
      <h3>User Instructions</h3>
      <p class="fw-bold">
        The assessment comprises 3 parts: 
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
        <!-- <li class="list-group-item d-flex justify-content-between align-items-start">
          <div class="ms-2 me-auto">
            <div class="fw-bold">Configuration Questions</div>
            Answer additional questions about your ePrescribing system.
          </div>
        </li> -->
      </ol>    
      <div class="alert alert-warning mt-4" role="alert">
        <span class="fw-bold">Disclaimer:</span> These patients have been designed to support the test
        tool and may not necessarily resemble real life. <span class="fw-bold fst-italic">Please enter all information exactly as presented.</span>
      </div>
    </StaticElement>
  </GroupElement>    
</template>

<script>

import Cookies from 'js-cookie'
import { mapState } from 'pinia'
import { assessmentStore } from '../stores/assessment'
import { practiceStore } from '../stores/practice';

export default {
  name: 'AssessmentIntro',   
  computed: {
    ...mapState(assessmentStore, ['assessmentData', 'getAssessmentsForInstitution', 'reset', 'getCategoryDetails', 'getMitigationDetails', 'getConfigQuestionDetails']), 
    ...mapState(practiceStore, ['resetPracticeData']),
    checklistBoxes() {
      return this.$refs['checklist']
    }
  }, 
  data() {
    return {
      itemsTicked: [],
      requirementsConfirmed: false
    }
  },
  methods: {
    updateTicklist(newValue) {
      this.itemsTicked = newValue
    },
    setConfirmation() {
      this.requirementsConfirmed = true
      Cookies.set('showCompetencyChecklist', 'yes', { expires: 90 })
    }
  },
  async mounted() {
    console.group('AssessmentIntro mounted hook')
    this.reset()
    this.resetPracticeData()

    // See if user has already checked all the competency requirements
    this.requirementsConfirmed = Cookies.get('showCompetencyChecklist') == 'yes'
   
    // Get mitigation and category base data
    let wasError = false
    const mitResponse = await this.getMitigationDetails()
    wasError = await this.errorResponder(mitResponse)
    if (!wasError) {
      const catResponse = await this.getCategoryDetails()
      wasError = await this.errorResponder(catResponse)
    }
    if (!wasError) {
      const configResponse = await this.getConfigQuestionDetails()
      wasError = await this.errorResponder(configResponse) 
    }
    if (!wasError) {
      const instResponse = await this.getAssessmentsForInstitution()
      wasError = await this.errorResponder(instResponse)
    }    
    console.debug(this.$refs['checklist'])
    console.groupEnd()
  }
}
</script>

<style scoped></style>
