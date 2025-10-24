<template>
  <GroupElement name="scenarioGroup" :class="'mb-4'">
    <HiddenElement ref="completedScenariosHidden" name="completedScenarios" :rules="[allScenariosCompleted]" />    
    <GroupElement name="scenarioDataLoaded" ref="scenarioDataLoadedGroup">
      <StaticElement name="scenarioHeading">
        <h2>Scenarios</h2>
        <div class="alert alert-info mt-2" role="alert">
          <p>There are 45 test scenarios to complete. This should be carried out in <span
              class="fw-bold">Consultant</span> status to avoid formulary issues.</p>
          <p>
            Please select the first patient's name from those set up in the patient build phase and prescribe the
            medication exactly as detailed in the scenario 1 tab presented.
            Record any relevant advice or information received while completing the test as prompted. Check all
            responses and then click <span class="fw-bold">Save</span>.
          </p>
          <p>
            Please note once you have clicked <span class="fw-bold">Save</span> you will <span
              class="fw-bold">not</span> be able to return to this page again to change your response.
          </p>
          <p>
            You will automatically move onto scenario 2 tab then scenario 3 tab for the patient selected and you should
            complete the same process.
            On completion of the three scenario tests you will be prompted to move onto the next patient.
          </p>
          <p>Please work through all of the patients until all test scenarios are complete</p>
        </div>
      </StaticElement>       
      <StaticElement name="scenariosProgress" class="mb-4">
        <div class="alert alert-info fw-bold" role="alert">
          {{ `You have completed ${numCompletedScenarios} of ${scenarioCount} scenarios` }}
        </div>
        <div v-show="numCompletedScenarios != 0" class="progress" role="progressbar" aria-label="Basic example" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
          <div class="progress-bar" :style="'width: ' + ((numCompletedScenarios / scenarioCount) * 100) + '%'"></div>
        </div>
      </StaticElement>
      <ObjectElement name="scenarioData">                
        <div class="accordion vf-col-12" id="patientAccordion">
          <div class="accordion-item" v-for="patient in patientData" :key="patient.id">
            <ObjectElement :name="patient.patient_code">
              <h2 class="accordion-header primary vf-col-12">
                <button class="accordion-button" type="button" data-bs-toggle="collapse"
                  :id="'scenario-accordion-btn-' + patient.patient_code"
                  :class="currentPatient == patient.patient_code ? '' : 'collapsed'"
                  :data-bs-target="'#scenario-patient-' + patient.patient_code"
                  :aria-expanded="currentPatient == patient.patient_code" 
                  :aria-controls="patient.patient_code"
                  @click="openPatientScenarios(patient.patient_code)"
                >
                  <span class="fw-bold">
                    <img class="img-thumbnail" style="width: 50px; height: 50px" v-show="patient.gender === 'Male'"
                      src="../assets/images/anon-male.png" alt="male patient" />
                    <img class="img-thumbnail" style="width: 50px; height: 50px" v-show="patient.gender === 'Female'"
                      src="../assets/images/anon-female.png" alt="female-patient" />
                    Patient: {{ patient.full_name }},
                    <span v-show="patient.age_years == 0 && patient.age_days == 0 && patient.gestational_age == 0"> age: unspecified</span> 
                    <span v-show="patient.age_years != null && patient.age_years != 0"> age: {{ patient.age_years }} years</span>
                    <span v-show="patient.age_days != null && patient.age_days != 0"> age: {{ patient.age_days }} days</span>
                    <span v-show="patient.gestational_age != null && patient.gestational_age != 0"> gestational age: {{ patient.gestational_age }} weeks</span>
                  </span>
                </button>
              </h2>
              <div class="accordion-collapse collapse vf-col-12" data-bs-parent="#patientAccordion"
                :id="'scenario-patient-' + patient.patient_code" :class="currentPatient == patient.patient_code ? 'show' : ''">
                <div class="accordion-body">
                  <!-- Scenario navigation tabs -->
                  <ul class="nav nav-tabs" :id="'scenario-patient-' + patient.patient_code + '-scenario-tabs'" role="tablist">
                    <li v-for="(pscd, index) in patientScenarios[patient.patient_code]" class="nav-item"
                      role="presentation">
                      <button class="nav-link" data-bs-toggle="tab" type="button" role="tab"
                        :class="currentScenario == pscd.scenario_code ? 'active' : ''" :id="'scenario-' + pscd.scenario_code + '-tab'"
                        :data-bs-target="'#scenario-' + pscd.scenario_code">{{ 'Scenario ' + (index + 1) }}
                      </button>
                    </li>
                  </ul>

                  <!-- Scenario tabs -->
                  <div v-show="currentPatient == patient.patient_code" class="tab-content vf-col-12">
                    <div class="tab-pane fade mt-2"
                      v-for="(pscd, index) in patientScenarios[patient.patient_code]"
                      :id="'scenario-' + pscd.scenario_code"
                      :class="currentScenario == pscd.scenario_code ? 'active show' : ''" role="tabpanel" tabindex="0">
                      <!-- New response form -->
                      <p v-if="dataLoaded && !scenarioCompleted(pscd.scenario_code)" class="my-4">Prescribe the following medication to the specified patient using your normal
                        prescribing practice, then answer the questions below.</p>
                      <table class="table table-striped" style="table-layout: fixed;">
                        <tbody>
                          <tr>
                            <th style="width:200px">Drug</th>
                            <td>{{ pscd.prescriptions.name }}</td>
                          </tr>
                          <tr>
                            <th>Dose</th>
                            <td>{{ pscd.prescriptions.dose }}</td>
                          </tr>
                          <tr>
                            <th>Route</th>
                            <td>{{ pscd.prescriptions.route }}</td>
                          </tr>
                          <tr>
                            <th>Frequency</th>
                            <td>{{ pscd.prescriptions.frequency }}</td>
                          </tr>
                          <tr>
                            <th>Duration</th>
                            <td>{{ pscd.prescriptions.duration }}</td>
                          </tr>
                          <tr>
                            <th>Justification</th>
                            <td>{{ pscd.prescriptions.justification }}</td>
                          </tr>
                        </tbody>
                      </table>
                      <div v-if="dataLoaded && !scenarioCompleted(pscd.scenario_code)">
                        <!-- Radio group of potential system responses (maps onto database field 'intervention_type') -->
                        <ObjectElement :name="pscd.scenario_code" :ref="`${pscd.scenario_code}Snippet`">
                          <h4 class="vf-col-12 mb-2">Questions</h4>
                          <span class="vf-col-12"
                            v-html="embolden('Which of the following best describes the response from the system when you attempted to prescribe the specified drug?', true)"></span>
                          <table class="table table-striped vf-col-12">
                            <tbody>
                              <tr v-for="(sysResponse, srIdx) in systemResponses">
                                <td>                            
                                  <RadioElement
                                    name="interventionType" 
                                    :radioValue="sysResponse.value"
                                    @change="setIntervention">                                      
                                  </RadioElement>                                
                                </td>
                                <td v-html="sysResponse.label"></td>
                                <td>
                                  <span v-show="systemResponseTips[srIdx] != ''" data-bs-toggle="tooltip" data-bs-placement="right"
                                    :data-bs-title="systemResponseTips[srIdx]">
                                    <i class="bi bi-info-circle-fill"></i>
                                  </span>
                                </td>
                              </tr>                            
                            </tbody>
                          </table>
                          <StaticElement name="scenarioDataLoading" v-if="!dataLoaded">
                            <div class="d-flex align-items-center">
                              <strong role="status">Loading scenario responses for assessment...</strong>
                              <div class="spinner-border ms-auto" aria-hidden="true"></div>
                            </div>
                          </StaticElement>
                          <!-- 
                          Alert/advisory checkboxes (two categories maximum, mapped onto database fields 'result' and 'other_category')
                          Values are stored as <category_code>:alert[,advisory] - minimum 1 box checked, maximum 4
                          -->
                          <div v-if="dataLoaded && hasInterventionSelections(patient.patient_code, pscd.scenario_code)" class="vf-col-6">
                            <div class="alert alert-warning mt-2" role="alert">
                              If the system were to respond to the challenge, please indicate what category of intervention (e.g. dose, frequency dialogue) and the type of response i.e:
                              <ul class="list-group mt-4">
                                <li class="list-group-item">
                                  <span class="fw-bold">Alert</span> - information is provided which interrupts work flow and/or requires action e.g. pop-up boxes or requiring password entry
                                </li>
                                <li class="list-group-item">
                                  <span class="fw-bold">Advisory</span> - information is provided which does not interrupt workflow or require action e.g. a passive dialogue, maybe a banner message on the bottom of the screen
                                </li>
                              </ul>
                              <br/>
                              <p>Please select <strong>up to two</strong> clinical decision support categories from the list below:</p>
                            </div>
                            <table class="table table-striped vf-col-6">
                              <thead>
                                <tr><th>Category</th><th>Alert</th><th>Advisory</th><th></th></tr>
                              </thead>
                              <tbody>
                                <tr v-for="(mc, mcIdx) in matrixCategories">
                                  <td>{{  mc.label }}</td>
                                  <td><CheckboxElement :name="'alert' + mc.value" /></td>
                                  <td><CheckboxElement :name="'advisory' + mc.value" /></td>
                                  <td>
                                    <span v-show="mc.tip != ''" data-bs-toggle="tooltip" data-bs-placement="right"
                                      :data-bs-title="mc.tip.replace('Tip: ', '')">
                                      <i class="bi bi-info-circle-fill"></i>
                                    </span>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <TextareaElement name="qualitativeData" :rows="5" class="mb-2"
                              :attrs="{ maxlength: 500 }" 
                              :label="embolden('Please tell us about the system response', false)" 
                            />
                          </div>
                          <GroupElement :name="pscd.scenario_code + 'Discontinued'" class="alert alert-warning fw-bold mb-2" role="alert">
                            <StaticElement :name="pscd.scenario_code + 'DiscontinueInstruction'">Please discontinue the prescription order before proceeding to the next scenario</StaticElement>
                            <CheckboxElement name="haveDiscontinuedPrescription" :disabled="this.currentScenarioInterventionSelected === false"
                              @change="(newValue) => { allowCurrentScenarioSave = newValue }"
                            >
                              I have done this
                            </CheckboxElement>                           
                          </GroupElement>
                        </ObjectElement>
                      </div>
                      <div v-if="dataLoaded && scenarioCompleted(pscd.scenario_code)">
                        <!-- Recorded responses (need some guidance as to how to express this - this is only the raw data at the moment... -->
                        <h4 class="my-4">Your responses to the scenario:</h4>
                        <table class="table table-striped" style="table-layout: fixed;">
                          <tbody>
                            <tr>
                              <th style="width:200px">Intervention type</th>
                              <td>{{ mitigationDescription(pscd.scenario_code) }}</td>
                            </tr>
                            <tr v-show="Object.keys(formatRecordedInterventions(pscd.scenario_code)).length != 0">
                              <th>Interventions</th>
                              <td>
                                <ul class="list-group">
                                  <li class="list-group-item d-flex justify-content-between align-items-center" v-for="(prompts, catDesc) in formatRecordedInterventions(pscd.scenario_code)">
                                    {{  catDesc }}
                                    <span class="badge text-bg-primary rounded-pill">{{ prompts }}</span>
                                  </li>                                                         
                                </ul>
                              </td>
                            </tr>
                            <tr v-show="Object.keys(formatRecordedInterventions(pscd.scenario_code)).length == 0">
                              <th>Interventions</th>
                              <td>None</td>
                            </tr>                                                   
                            <tr>
                              <th>Your notes</th>
                              <td>{{ scenarioResponse(pscd.scenario_code)['qualitative_data'] || 'None entered' }}</td>
                            </tr>                                                    
                          </tbody>
                        </table>
                      </div>
                      <GroupElement name="scenario-response=button-bar" :columns="{ container: 8, label: 0, wrapper: 8 }">                        
                        <ButtonElement v-show="dataLoaded && !scenarioCompleted(pscd.scenario_code)" name="saveScenarioResponse" :ref="pscd.scenario_code + 'Save'"
                          :disabled="!allowCurrentScenarioSave"
                          :columns="4"
                          :add-class="'me-2'" 
                          @click="saveScenarioResponse(patient, pscd)"
                        >
                          <i class="bi bi-floppy-fill me-2"></i>Save response
                        </ButtonElement>
                        <ButtonElement v-show="dataLoaded && scenarioCompleted(pscd.scenario_code) && numCompletedScenarios != scenarioCount" name="nextIncompleteScenario" 
                          :columns="4"
                          @click="openNextUnenteredScenario"
                        >
                          <i class="bi bi-play-fill me-2"></i>Next scenario
                        </ButtonElement>
                      </GroupElement>
                      <StaticElement v-show="!savedResponseData" name="savingAlert" class="mt-4">
                        <div class="alert alert-info w-25">Saving your response...</div>
                      </StaticElement>                      
                    </div>
                  </div>
                </div>
              </div>
            </ObjectElement>
          </div>
        </div>
      </ObjectElement>
      <StaticElement v-show="numCompletedScenarios == scenarioCount" name="completedLastScenarioAlert" class="mt-4">
        <div class="alert alert-info">You have now completed all the scenarios.  Please click 'Continue to Configuration Questions' below to answer further questions about your system.</div>
      </StaticElement>
    </GroupElement>
  </GroupElement>
</template>

<script>

import { mapState } from 'pinia'
import { assessmentStore } from '../stores/assessment'
import { Validator } from '@vueform/vueform'

const allScenariosCompleted = class extends Validator {
  get msg() {
    return 'Please complete all scenario questions'
  }
  check(value) {
    console.debug('allScenariosCompleted() validator entered with', value)
    return value && value.split(',').length == assessmentStore().assessmentData.numScenarios
  }
}

export default {
  name: 'AssessmentScenario',
  computed: {
    ...mapState(assessmentStore, ['dataReady', 'assessmentData', 'mitigations', 'categories', 'updateAssessmentStatus', 'getPatientScenarioData', 'getPatientScenarioResponses', 'savePatientScenarioResponse']),
    dataLoaded() {
      return this.auxiliaryDataReady && this.dataReady
    },        
    patientData() {
      return this.assessmentData.patients
    },
    patientScenarios() {
      return this.assessmentData.patientScenarios
    },
    scenarioCount() {
      return this.assessmentData.numScenarios
    },    
    scenarioResponses() {
      return this.storedResponsesByCode
    },
    systemResponses() {
      // This undesirably hard-codes the mitigation codes in order to associate them with labels - perhaps label text better stored in the database?
      return [
        { value: 'MT2', label: 'You were able to complete the prescription (includes followed order sentence) <span class="fw-bold">without any additional user or system input</span>' },
        { value: 'MT4', label: 'You were able to complete the prescription, <span class="fw-bold">but had to override components of the order sentence</span>' },
        { value: 'MT1', label: 'You were able to complete the prescription, <span class="fw-bold">with system/user intervention</span>' },
        { value: 'MT3', label: 'Prevented from prescribing' },
        { value: 'MT99', label: 'Medicine or formulary alternative not available in the system' },
      ]
    },
    systemResponseTips() {
      return [
        'You placed the order for the new medicine using your normal processes, which may have included the selection of a provided order sentence and did not receive any advice or information from the electronic prescribing system',
        'You placed the order for the new medicine but had to ignore, modify or override a provided order sentence to complete it',
        'You prescribed the medicine and received some system advice or information in relation to allergies, abnormal lab results, dosing, route, patient age, therapeutic duplication, monitoring, contraindication or something else, which required you to make a decision to modify the prescription, like adjusting doses or monitoring parameters, to mitigate risk without outright prevention.',
        'These are prescribing actions that should never occur, where it is clear cut with no additional prescriber decision point. The EP system blocks completion of the prescriptions entirely.',
        'Where the medicine presented in the test is not available in your system, the question will be passed over. This will be classed as an invalid test. It will not affect the overall mitigation results, which are calculated on the valid tests taken.'
      ]
    },
    matrixCategories() {
      return this.displayCategories
    },
    categoryCount() {
      return this.categories.length
    },
    categoryTips() {
      return this.categories.map(c => { c.tip })
    },
    completedScenariosHidden() {
      console.log('Hidden element is', this.$refs.completedScenariosHidden)
      return this.$refs.completedScenariosHidden
    }
  },
  data() {
    return {
      auxiliaryDataReady: false,
      displayCategories: [],
      interventionSelections: {},
      currentPatient: null,
      currentScenario: null,
      currentScenarioInterventionSelected: false,
      allowCurrentScenarioSave: false,
      storedResponsesByCode: {},
      numCompletedScenarios: 0,
      scenarioPatientLink: {},
      savedResponseData: true,
      allScenariosCompleted
    }
  },
  methods: {
    mitigationDescription(scenarioCode) {
      let description = ''
      if (this.scenarioResponse(scenarioCode)) {
        const mitigationCode = this.scenarioResponse(scenarioCode)['intervention_type']
        const mitigation = this.mitigations.filter(m => m.mitigation_code == mitigationCode)
        if (mitigation.length > 0) {
          description = mitigation[0].mitigation
        }
      }                  
      return description
    },
    async saveScenarioResponse(patient, scenario) {
      
      console.group('saveScenarioResponse()')
      console.debug('Patient', patient, 'scenario', scenario, 'form part-object', this.$refs[`${scenario.scenario_code}Snippet`][0])
     
      //TODO - need to validate this data and flag any problems (at moment 03/10/2025 it just stays on the scenario and doesn't inform the user)
      this.savedResponseData = false
      const saveResponse = await this.savePatientScenarioResponse(patient, scenario, this.$refs[`${scenario.scenario_code}Snippet`][0].data[scenario.scenario_code], false)
      if (saveResponse !== true) {
        throw new Error(saveResponse)
      } else {
        this.storedResponsesByCode[scenario.scenario_code] = this.assessmentData.storedScenarioResponses[scenario.scenario_code]        
        this.numCompletedScenarios++
        this.completedScenariosHidden.update(Object.keys(this.storedResponsesByCode).join(','))
        this.completedScenariosHidden.validate()
      }
      setTimeout(() => {
        this.savedResponseData = true
      }, 200)
      
      console.groupEnd()
    },
    hasInterventionSelections(patientCode, scenarioCode) {
      return this.interventionSelections[patientCode + '.' + scenarioCode + '.interventionType'] === true
    },
    formatRecordedInterventions(scenarioCode) {
      let intObj = {}
      const interventions = this.scenarioResponse(scenarioCode)['other_category']
      if (interventions != null && interventions.length > 0) {
        // Data looks like { <category_code1>:alert[,advisory]|<category_code2:...}
        interventions.split('|').forEach(intn => {
          const catDesc = this.displayCategories.filter(c => c.value == intn.split(':').shift())[0].label
          const prompts = intn.split(':').pop().split(',')
          intObj[catDesc] = prompts.join(' + ')
        })
      }
      return intObj
    },
    showUniqueScenario() {
      // Insane hack to fix https://github.com/NewcastleRSE/Vue-eprase/issues/275 - reactivity should be sufficient but sometimes isn't...
      // So when a patient record is clicked out of order, make sure only the current scenario is activated (remove 'active' and 'active show' from elements)
      console.group('showUniqueScenario() - HACK')
      const scenarioTabs = document.getElementById('scenario-patient-' + this.currentPatient + '-scenario-tabs')
      if (scenarioTabs) {
        console.debug('Processing scenario buttons, ensure only current scenario active...')
        scenarioTabs.querySelectorAll('button').forEach(btn => {
          const scenarioCode = btn.id.replace('scenario-', '').replace('-tab', '')
          const scenarioDiv = document.getElementById('scenario-' + scenarioCode)
          console.debug('Scenario', scenarioCode)
          if (scenarioCode != this.currentScenario) {
            btn.classList.remove('active')
            if (scenarioDiv) {
              scenarioDiv.classList.remove('active', 'show')
            }          
          }
        })
      }
      console.groupEnd()
    },
    // Determine the next incomplete scenario and open it
    async openNextUnenteredScenario() {

      console.group('openNextUnenteredScenario()')

      const doneScenarios = Object.keys(this.scenarioResponses)
      this.completedScenariosHidden.update(doneScenarios.join(','))

      if (doneScenarios.length < this.scenarioCount) {
        // Still some to do, so find the next uncompleted one (won't necessarily be sequential...)
        const incompleteScenarioCodes = Object.keys(this.scenarioPatientLink).filter(sc => !doneScenarios.includes(sc))
        console.assert(incompleteScenarioCodes.length > 0, 'No non-complete scenarios found')
        await this.$nextTick(() => { 
          this.allowCurrentScenarioSave = false
          this.currentScenarioInterventionSelected = false
          this.currentScenario = incompleteScenarioCodes[0]
          this.currentPatient = this.scenarioPatientLink[this.currentScenario] 
          this.showUniqueScenario()       
          const patientElement = document.getElementById('scenario-patient-' + this.currentPatient)
          if (patientElement != null) {
            patientElement.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'nearest'
            })
          }
        console.debug('Set current patient to', this.currentPatient, 'current scenario to', this.currentScenario)
        })       
      }
      console.groupEnd()
    },
    // Allow user to simply click on any patient within the list e.g. to review responses
    async openPatientScenarios(patientCode) {

      console.group('openPatientScenarios()')

      await this.$nextTick(() => {
        this.allowCurrentScenarioSave = false
        this.currentScenarioInterventionSelected = false
        this.currentPatient = patientCode
        this.currentScenario = this.patientScenarios[patientCode][0].scenario_code
        this.showUniqueScenario()
        console.debug('openPatientScenarios - set current patient to', this.currentPatient, 'current scenario to', this.currentScenario)
      })  
      
      console.groupEnd()
    },  
    scenarioResponse(scenarioCode) {
      return this.scenarioResponses[scenarioCode]
    },
    scenarioCompleted(scenarioCode) {
      return scenarioCode in this.scenarioResponses
    },
    setIntervention(newVal, oldVal, el$) {
      console.group('setIntervention()')
      const identifier = el$.dataPath.split('.').slice(1).join('.')
      const isIntervention = newVal == 'MT1'
      // This sets the object key to <patient_code>.<scenario_code>.outcome
      if (this.interventionSelections[identifier] != isIntervention) {
        // Only set this reactive quantity if its value has *actually* changed - 'change' event is fired multiple times for radios and Vue slows down dramatically as the DOM is rewritten multiple times!
        console.debug('New value', newVal, 'old value', oldVal, 'selection value', this.interventionSelections)
        this.interventionSelections[identifier] = isIntervention
        this.currentScenarioInterventionSelected = true
      }
      console.groupEnd()
    }
  },
  async mounted() {

    console.group('AssessmentScenario mounted()')

    this.auxiliaryDataReady = false

    // Massage the category list for better use in Vueform components      
    this.displayCategories = this.categories.map(c => { return { value: c.category_code, label: c.name, tip: c.description } })        
    for (const [patientCode, scenarios] of Object.entries(this.patientScenarios)) {
      scenarios.forEach(s => {
        this.scenarioPatientLink[s.scenario_code] = patientCode
      })      
    }
    const storedResultsResponse = await this.getPatientScenarioResponses(true)
    if (storedResultsResponse !== true) {
      throw new Error(storedResultsResponse)
    } else {
      // Package the responses by scenario code for convenience - data is of form:
      // { intervention_type: MT<code>, result: <calculated_mitigation>, other_category: <category_code1>:alert[,advisory]|..., qualitative_data: <text> }
      this.assessmentData.storedScenarioResponses.forEach(asr => {
        this.storedResponsesByCode[asr.scenario.scenario_code] = asr
      })
      this.numCompletedScenarios = Object.keys(this.scenarioResponses).length
    }
    
    // Absolutely critical line which disables the 'continue to configuration questions' button when no scenarios have been completed...
    this.completedScenariosHidden.validate()

    this.auxiliaryDataReady = true
    this.openNextUnenteredScenario()
    
    console.groupEnd()
  },
  async beforeUnmount() {
    console.group('AssessmentScenario beforeUnmount()')
    console.assert(this.dataLoaded, 'AssessmentScenario beforeUnmount() hook - dataReady flag is false')
    if (this.numCompletedScenarios == this.scenarioCount) {
      // We have done all the data entry now          
      const updateResponse = await this.updateAssessmentStatus('Scenarios complete', true)
      if (updateResponse !== true) {
        throw new Error(updateResponse)
      }
    }    
    console.groupEnd()
  }
}
</script>

<style scoped></style>