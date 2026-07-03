<template>
  <GroupElement ref="intro" name="introGroup" :class="'mb-4'">    
    <GroupElement v-if="!requirementsConfirmed" name="introChecklist">
      <StaticElement name="preStartChecklistPreamble">
        <h2 class="mb-4">ePRaSE Assessment - Pre-Start Checklist</h2>
        <div class="accordion" id="checklistAccordion">
          <div class="accordion-item">
            <h2 class="accordion-header bg-warning-subtle">
              <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#checklist-itemOne" aria-expanded="true" aria-controls="checklist-itemOne">
                <span class="fw-medium fs-4">1. Understand the Purpose</span>
              </button>
            </h2>
            <div id="checklist-itemOne" class="accordion-collapse collapse show" data-bs-parent="#checklistAccordion">
              <div class="accordion-body">
                <p class="fw-bolder"><i class="bi bi-check-lg me-2"></i>You understand that the assessment:</p>
                <ul class="list-group mb-4">
                  <li class="list-group-item">Tests <strong>system behaviour</strong>, not clinical judgement</li>
                  <li class="list-group-item">Requires you to<strong> follow instructions exactly</strong></li>
                  <li class="list-group-item">Measures <strong>safety features and mitigations</strong> within your EP system</li>
                </ul>
                <p class="fw-bolder"><i class="bi bi-check-lg me-2"></i>You recognise:</p>
                <ul class="list-group mb-4">
                  <li class="list-group-item">Some scenarios may appear clinically incorrect — this is <strong>intentional</strong></li>                  
                </ul>
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header bg-warning-subtle">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#checklist-itemTwo" aria-expanded="false" aria-controls="checklist-itemTwo">
                <span class="fw-medium fs-4">2. Complete (or Plan to Complete) the Practice Session</span>
              </button>
            </h2>
            <div id="checklist-itemTwo" class="accordion-collapse collapse" data-bs-parent="#checklistAccordion">
              <div class="accordion-body">
                <p class="fw-bolder"><i class="bi bi-check-lg me-2"></i>You have:</p>
                <ul class="list-group mb-4">
                  <li class="list-group-item">Completed the tool before OR</li>
                  <li class="list-group-item">Completed the practice session OR</li>
                  <li class="list-group-item">Reviewed how it works and feel confident</li>
                </ul>
                <p class="fw-bolder"><i class="bi bi-check-lg me-2"></i>You understand:</p>
                <ul class="list-group mb-4">
                  <li class="list-group-item">How to build a patient</li>
                  <li class="list-group-item">How to complete a scenario</li>
                  <li class="list-group-item">How to record outcomes correctly</li>
                  <li class="list-group-item">How outcomes map to mitigation scoring</li>
                </ul>   
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header bg-warning-subtle">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#checklist-itemThree" aria-expanded="false" aria-controls="checklist-itemThree">
                <span class="fw-medium fs-4">3. System Access &amp; Capability</span>
              </button>
            </h2>
            <div id="checklist-itemThree" class="accordion-collapse collapse" data-bs-parent="#checklistAccordion">
              <div class="accordion-body">
                <p class="fw-bolder"><i class="bi bi-check-lg me-2"></i>You have full access to your electronic prescribing system</p>
                <p class="fw-bolder"><i class="bi bi-check-lg me-2"></i>You (or your team) can:</p>
                <ul class="list-group mb-4">
                  <li class="list-group-item">Register/create a patient</li>
                  <li class="list-group-item">Prescribe medications</li>
                  <li class="list-group-item">Navigate prescribing workflows</li>
                </ul>
                <p class="fw-bolder"><i class="bi bi-check-lg me-2"></i>You have appropriate:</p>
                <ul class="list-group mb-4">
                  <li class="list-group-item">System permissions</li>
                  <li class="list-group-item">Access to required modules/screens</li>
                </ul>
                <p class="fw-bolder"><i class="bi bi-exclamation-triangle me-2"></i>Minimum essential capabilities:</p>                
                <ul class="list-group mb-4">
                  <li class="list-group-item">Patient registration (or access to a created patient)</li>
                  <li class="list-group-item">Prescribing functionality</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header bg-warning-subtle">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#checklist-itemFour" aria-expanded="false" aria-controls="checklist-itemFour">
                <span class="fw-medium fs-4">4. Right People Involved</span> 
              </button>
            </h2>
            <div id="checklist-itemFour" class="accordion-collapse collapse" data-bs-parent="#checklistAccordion">
              <div class="accordion-body">
                <p class="fw-bolder"><i class="bi bi-check-lg me-2"></i>The person(s) completing the assessment:</p>
                <ul class="list-group mb-4">
                  <li class="list-group-item">Understand your prescribing system</li>
                  <li class="list-group-item">Know how to carry out prescribing tasks</li>
                </ul>
                <p class="fw-bolder"><i class="bi bi-check-lg me-2"></i>Where needed:</p>
                <ul class="list-group mb-4">
                  <li class="list-group-item">Appropriate staff are involved (e.g. prescribers, informatics, pharmacy, admin support)</li>
                </ul>
                <p class="fw-bolder"><i class="bi bi-exclamation-triangle me-2"></i>You may involve multiple users if required</p>                                
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header bg-warning-subtle">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#checklist-itemFive" aria-expanded="false" aria-controls="checklist-itemFive">
                <span class="fw-medium fs-4">5. Decide Where to Run the Assessment</span>
              </button>
            </h2>
            <div id="checklist-itemFive" class="accordion-collapse collapse" data-bs-parent="#checklistAccordion">
              <div class="accordion-body">
                <p class="fw-bolder"><i class="bi bi-check-lg me-2"></i>You know whether you are using:</p>
                <ul class="list-group mb-4">
                  <li class="list-group-item">Live environment OR</li>
                  <li class="list-group-item">Test/development environment</li>
                </ul>
                <p class="fw-bolder"><i class="bi bi-check-lg me-2"></i>If using live system:</p>
                <ul class="list-group mb-4">
                  <li class="list-group-item">You are allowed to create test patients</li>
                </ul>
                <p class="fw-bolder"><i class="bi bi-check-lg me-2"></i>If using test system:</p>
                <ul class="list-group mb-4">
                  <li class="list-group-item">You understand it may differ from live</li>
                </ul>
                <p class="fw-bolder"><i class="bi bi-exclamation-triangle me-2"></i>You understand this choice may affect results and interpretation</p>                                
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header bg-warning-subtle">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#checklist-itemSix" aria-expanded="false" aria-controls="checklist-itemSix">
                <span class="fw-medium fs-4">6. Prepare to Build Test Patients</span>
              </button>
            </h2>
            <div id="checklist-itemSix" class="accordion-collapse collapse" data-bs-parent="#checklistAccordion">
              <div class="accordion-body">
                <p class="fw-bolder"><i class="bi bi-check-lg me-2"></i>You can:</p>
                <ul class="list-group mb-4">
                  <li class="list-group-item">Enter patient demographics</li>
                  <li class="list-group-item">Add clinical information</li>
                  <li class="list-group-item">Add current medications</li>
                </ul>
                <p class="fw-bolder"><i class="bi bi-check-lg me-2"></i>You are ready to:</p>
                <ul class="list-group mb-4">
                  <li class="list-group-item">Enter all details exactly as provided</li>
                  <li class="list-group-item">Use test patient identifiers (e.g. &quot;zzz&quot;) appropriately</li>
                </ul>
                <p class="fw-bolder"><i class="bi bi-check-lg me-2"></i>You understand:</p>
                <ul class="list-group mb-4">
                  <li class="list-group-item">Missing or inaccurate data may affect scenario behaviour and results</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header bg-warning-subtle">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#checklist-itemSeven" aria-expanded="false" aria-controls="checklist-itemSeven">
                <span class="fw-medium fs-4">7. Understand Scenario Approach</span>
              </button>
            </h2>
            <div id="checklist-itemSeven" class="accordion-collapse collapse" data-bs-parent="#checklistAccordion">
              <div class="accordion-body">
                <p class="fw-bolder"><i class="bi bi-check-lg me-2"></i>You will:</p>
                <ul class="list-group mb-4">
                  <li class="list-group-item">Prescribe exactly as instructed</li>
                  <li class="list-group-item">Not correct doses or orders</li>
                </ul>
                <p class="fw-bolder"><i class="bi bi-check-lg me-2"></i>You understand:</p>
                <ul class="list-group mb-4">
                  <li class="list-group-item">Scenarios are designed to trigger system responses</li>
                  <li class="list-group-item">Accuracy of entry is critical</li>
                </ul>               
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header bg-warning-subtle">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#checklist-itemEight" aria-expanded="false" aria-controls="checklist-itemEight">
                <span class="fw-medium fs-4">8. Understand Outcome Recording</span>
              </button>
            </h2>
            <div id="checklist-itemEight" class="accordion-collapse collapse" data-bs-parent="#checklistAccordion">
              <div class="accordion-body">
                <p class="fw-bolder"><i class="bi bi-check-lg me-2"></i>You know how to select outcomes:</p>
                <ul class="list-group mb-4">
                  <li class="list-group-item">Prescribing completed with no system/user intervention</li>
                  <li class="list-group-item">Prescribing completed but had to override components of the order sentence</li>
                  <li class="list-group-item">Prescribing completed with system/user intervention</li>
                  <li class="list-group-item">Prescribing prevented</li>
                  <li class="list-group-item">Unable to perform test</li>
                </ul>
                <p class="fw-bolder"><i class="bi bi-check-lg me-2"></i>If &quot;Unable to perform test&quot;:</p>
                <ul class="list-group mb-4">
                  <li class="list-group-item">You will select a valid reason or provide free text</li>
                </ul>
                 <p class="fw-bolder"><i class="bi bi-check-lg me-2"></i>You understand:</p>
                <ul class="list-group mb-4">
                  <li class="list-group-item">Your selection directly affects scoring and analysis</li>
                </ul>               
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header bg-warning-subtle">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#checklist-itemNine" aria-expanded="false" aria-controls="checklist-itemNine">
                <span class="fw-medium fs-4">9. Be Aware of Key Resources</span>
              </button>
            </h2>
            <div id="checklist-itemNine" class="accordion-collapse collapse" data-bs-parent="#checklistAccordion">
              <div class="accordion-body">
                <p class="fw-bolder"><i class="bi bi-check-lg me-2"></i>You know where to access:</p>
                <ul class="list-group mb-4">
                  <li class="list-group-item">User guide available on the 'using eprase' page  eprase.info and within the tool tabs</li>
                  <li class="list-group-item">Explainer videos/support materials available on the 'using eprase' page on <a href="https://eprase.info" title="ePRaSE info site (opens in new tab)">eprase.info</a></li>
                  <li class="list-group-item">Practice session</li>
                </ul>
                <p class="fw-bolder"><i class="bi bi-check-lg me-2"></i>You understand:</p>
                <ul class="list-group mb-4">
                  <li class="list-group-item">These resources support correct completion and interpretation</li>
                </ul>                        
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header bg-warning-subtle">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#checklist-itemTen" aria-expanded="false" aria-controls="checklist-itemTen">
                <span class="fw-medium fs-4">10. Allow Sufficient Time</span>
              </button>
            </h2>
            <div id="checklist-itemTen" class="accordion-collapse collapse" data-bs-parent="#checklistAccordion">
              <div class="accordion-body">
                <p class="fw-bolder"><i class="bi bi-check-lg me-2"></i>You have planned sufficient time for:</p>
                <ul class="list-group mb-4">
                  <li class="list-group-item">Patient setup and scenario completion (approx. 4-6 hours)</li>
                </ul>
                <p class="fw-bolder"><i class="bi bi-exclamation-triangle me-2"></i>Avoid rushing - accuracy is more important than speed</p>                                       
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header bg-warning-subtle">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#checklist-itemEleven" aria-expanded="false" aria-controls="checklist-itemEleven">
                <span class="fw-medium fs-4">11. Data Awareness &amp; Expectations</span>
              </button>
            </h2>
            <div id="checklist-itemEleven" class="accordion-collapse collapse" data-bs-parent="#checklistAccordion">
              <div class="accordion-body">
                <p class="fw-bolder"><i class="bi bi-check-lg me-2"></i>You understand:</p>
                <ul class="list-group mb-4">
                  <li class="list-group-item">Your data is used for learning and improvement</li>
                  <li class="list-group-item">This assessment is designed to review system functionality and safety responses</li>
                  <li class="list-group-item">Results reflect system performance within the test scenarios</li>
                </ul>
                <p class="fw-bolder"><i class="bi bi-check-lg me-2"></i>You are aware:</p>
                <ul class="list-group mb-4">
                  <li class="list-group-item">Results should be interpreted in context (e.g. your system, resources, configuration)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </StaticElement>
      <StaticElement name="finalReadinessHeader">
        <h3>Final Readiness Check</h3>
        <p name="finalReadinessPreamble">Before starting, confirm:</p>
      </StaticElement>
      <CheckboxgroupElement
        ref="checklist"
        name="preparedChecklist"
        @change="updateTicklist"
        :items="[
          'I understand the purpose of the assessment',
          'I know how to complete scenarios correctly',
          'I can build and use test patients',
          'I can prescribe within the system',
          'I know how to record outcomes',
          'I have access to guidance if needed',
          'I have enough time to complete the assessment properly'
        ]"
        :messages="{required: 'Please tick all 7 boxes to confirm', 'size': 'Please tick all 7 boxes to confirm'}"
        :rules="['required', 'size:7']"
      />      
      <StaticElement name="checklistPostamble">
        <p class="fw-bolder">If all boxes are checked, you are ready to begin the ePRaSE assessment.</p>
      </StaticElement>
      <ButtonElement name="confirmPrepared" class="mt-2" 
        :columns="4" 
        :disabled="!itemsTicked || itemsTicked.length != 7"
        @click="setConfirmation"
      >Ready to Start
      </ButtonElement>
    </GroupElement>
    <StaticElement v-if="requirementsConfirmed" name="introBody">
      <h2 class="mb-4">Introduction</h2>
      <p class="fw-bolder">
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
        <span class="fw-medium">Disclaimer:</span> These patients have been designed to support the test
        tool and may not necessarily resemble real life. <span class="fw-medium fst-italic">Please enter all information exactly as presented.</span>
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
    ...mapState(assessmentStore, ['assessmentData', 'getAssessmentsForInstitution', 'reset', 'getCategoryDetails', 'getMitigationDetails']), 
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
      Cookies.set('hideCompetencyChecklist', 'yes', { expires: 90 })
    }
  },
  async mounted() {
    console.group('AssessmentIntro mounted hook')
    this.reset()
    this.resetPracticeData()

    // See if user has already checked all the competency requirements
    this.requirementsConfirmed = Cookies.get('hideCompetencyChecklist') == 'yes'
   
    // Get mitigation and category base data
    let wasError = false
    const mitResponse = await this.getMitigationDetails()
    wasError = await this.errorResponder(mitResponse)
    if (!wasError) {
      const catResponse = await this.getCategoryDetails()
      wasError = await this.errorResponder(catResponse)
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
