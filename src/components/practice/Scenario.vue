<template>
  <GroupElement name="scenarioGroup" class="my-4">
    <GroupElement name="scenarioDataLoaded" ref="scenarioDataLoadedGroup">
      <StaticElement name="scenarioHeading">
        <h2>Scenarios</h2>
        <div class="alert alert-info mt-4" role="alert">
          <p>There are {{ scenarioCount }} test scenarios to complete. TODO - need wording here...</p>
        </div>
      </StaticElement>       
      <StaticElement name="scenariosProgress">
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
                    <img v-show="patient.is_adult && patient.gender == 'Male'" class="img-thumbnail" style="width: 50px; height: 50px" src="../../assets/images/anon-male.png" alt="Adult male patient" />
                    <img v-show="patient.is_adult && patient.gender == 'Female'" class="img-thumbnail" style="width: 50px; height: 50px" src="../../assets/images/anon-female.png" alt="Adult female patient" />
                    <img v-show="isBaby(patient)" class="img-thumbnail" style="width: 50px; height: 50px" src="../../assets/images/baby.png" alt="Baby patient" />
                    <img v-show="!isBaby(patient) && !patient.is_adult && patient.gender == 'Male'" class="img-thumbnail" style="width: 50px; height: 50px" src="../../assets/images/anon-child-boy.png" alt="Male paediatric patient" />
                    <img v-show="!isBaby(patient) && !patient.is_adult && patient.gender == 'Female'" class="img-thumbnail" style="width: 50px; height: 50px" src="../../assets/images/anon-child-girl.png" alt="Female paediatric patient" />                         
                    Patient: {{ patient.full_name }}, {{ formatAgeCaption(patient) }}: {{ formatAge(patient) }}
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
                      <button class="nav-link scenario" data-bs-toggle="tab" type="button" role="tab"
                        :class="currentScenario == pscd.scenario_code ? 'active' : ''" 
                        :id="'scenario-' + pscd.scenario_code + '-tab'"
                        @click="currentScenario = pscd.scenario_code"
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
                          <!-- New implementation 29/05/2026 in response to https://github.com/NewcastleRSE/Vue-eprase/issues/401 -->
                          <TagsElement name="dsCategory" ref="dsCategory" placeholder="Select at most two categories"
                            v-if="dataLoaded && prescribingHasIntervention"
                            :label="embolden('If the system were to respond to the challenge, please select below which category(s) of intervention (e.g. dose, frequency dialogue) occurred, up to a maximum of two:', true)"                              
                            :items="matrixCategories"
                            :break-tags="true"
                            :rules="['min:1', 'max:2']"                              
                            :messages="{'min': 'Please enter at least one category', 'max': 'Please enter a maximum of two categories'}"
                            @mounted="initCategoryTooltips"
                            @change="updateCategorySelector"
                          />
                          <!-- End of response to https://github.com/NewcastleRSE/Vue-eprase/issues/401 -->
                          <!-- Extra dropdown for identifying different cases where prescribing was not possible - https://github.com/NewcastleRSE/Vue-eprase/issues/418 -->
                          <SelectElement name="reasonImpossible"
                            v-if="dataLoaded && prescribingImpossible"
                            :label="embolden('Please enter the reason prescribing was not possible', true)"
                            :native="false"
                            :track-by="['label', 'value']"
                            :items="[
                              { value: '', label: 'Please select...', disabled: true },
                              { value: 'medicine unavailable', label: 'Medicine or formulary alternative not available in the system' },
                              { value: 'route unavailable', label: 'Medicine administration route not available in the system' },
                              { value: 'other', label: 'Other - please specify' }
                            ]"
                            :messages="{required: 'Reason is required if prescribing was not possible'}" 
                            :rules="['required', `fieldIsOther:scenarioData.${patient.patient_code}.${pscd.scenario_code}.interventionType,MT99`]" 
                          />
                           <TextElement name="otherReasonImpossible" placeholder="Please give details"
                            v-if="dataLoaded && prescribingImpossible && reasonImpossible == 'other'"
                            :label="embolden('Describe why prescribing was not possible', true)" 
                            :rules="['required', `fieldIsOther:scenarioData.${patient.patient_code}.${pscd.scenario_code}.reasonImpossible,other`]"
                            :messages="{required: 'Additional description is required'}" 
                            :debounce="200" 
                          />
                          <!-- End of response to https://github.com/NewcastleRSE/Vue-eprase/issues/418 -->                     
                          <TextareaElement name="qualitativeData" :rows="5" class="mb-2"
                            :attrs="{ maxlength: 500 }" 
                            :label="embolden('Additional comments', false)" 
                          />
                          <GroupElement :name="pscd.scenario_code + 'Discontinued'" class="alert alert-warning fw-bold mb-4" role="alert">
                            <StaticElement :name="pscd.scenario_code + 'DiscontinueInstruction'">Please discontinue the prescription order before proceeding to the next scenario</StaticElement>
                            <CheckboxElement name="haveDiscontinuedPrescription"
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
                              <th style="width:200px">Response</th>
                              <td>{{ mitigationDescription(pscd.scenario_code) }}</td>
                            </tr>
                            <tr v-if="scenarioResponse(pscd.scenario_code)['intervention_type'] == 'MT99'">
                              <th>Category/intervention type</th>
                              <td>
                                <ul class="list-group">
                                  <li class="list-group-item d-flex justify-content-between align-items-center" v-for="catDesc in humanFriendlyCategories(scenarioResponse(pscd.scenario_code)['other_category'])">
                                    <span class="badge text-bg-primary rounded-pill">{{ catDesc }}</span>
                                  </li>                                                         
                                </ul>
                              </td>
                            </tr>
                            <tr v-if="scenarioResponse(pscd.scenario_code)['intervention_type'] == 'MT99'">
                              <th>Intervention details</th>
                              <td>{{ scenarioResponse(pscd.scenario_code)['other_reason_impossible'] || scenarioResponse(pscd.scenario_code)['reason_impossible'] }}</td>
                            </tr>                                                                       
                            <tr>
                              <th>Your notes</th>
                              <td>{{ scenarioResponse(pscd.scenario_code)['qualitative_data'] || 'None entered' }}</td>
                            </tr>                                                    
                          </tbody>
                        </table>                        
                      </div>
                      <GroupElement name="scenario-response-button-bar" :columns="{ container: 8, label: 0, wrapper: 8 }">                        
                        <ButtonElement v-show="dataLoaded && !scenarioCompleted(pscd.scenario_code)" name="saveScenarioResponse" :ref="pscd.scenario_code + 'Save'"
                          :disabled="!allowCurrentScenarioSave || tooManyCategories || tooFewCategories"
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
    </GroupElement>
  </GroupElement>
</template>

<script>

import { mapState } from 'pinia'
import { Tooltip } from 'bootstrap/dist/js/bootstrap.bundle.min'
import { appSettingsStore } from '../../stores/appSettings';
import { practiceStore } from '../../stores/practice'
import { systemMitigationResponses, systemResponseTooltips, patientIsBaby, patientAgeString, patientAgeCaption } from '../../helpers/common'

export default {
  name: 'Scenario',  
  computed: {
    ...mapState(appSettingsStore, ['maxSelectableDsCategories']),
    ...mapState(practiceStore, [
      'dataReady', 'patients', 'patientScenarios', 'scenarioPatientLink', 
      'scenarioUserResponses', 'savePatientScenarioResponse', 'numScenarios', 
      'getCategoryDetails', 'getMitigationDetails', 'categories', 'mitigations'
    ]),
    dataLoaded() {
      return this.dataReady
    },        
    patientData() {
      return this.patients
    },    
    scenarioCount() {
      return this.numScenarios
    },    
    scenarioResponses() {
      return this.storedResponsesByCode
    },
    systemResponses() {
      return systemMitigationResponses
    },
    systemResponseTips() {
      return systemResponseTooltips
    },
    matrixCategories() {
      return this.displayCategories
    },
    reasonImpossible() {
      return this.scenarioForm.data[this.currentScenario].reasonImpossible
    },
    scenarioForm() {
      return this.$refs[`${this.currentScenario}Snippet`][0]
    },
    prescribingHasIntervention() {
      return this.interventionSelections[`${this.currentPatient}.${this.currentScenario}.interventionType`] === 'MT1'
    },
    prescribingImpossible() {
      return this.interventionSelections[`${this.currentPatient}.${this.currentScenario}.interventionType`] === 'MT99'
    },
    tooManyCategories() {
      return this.prescribingHasIntervention && this.dsCategoriesSelected.length > this.maxSelectableDsCategories
    },
    tooFewCategories() {
      return this.prescribingHasIntervention && this.dsCategoriesSelected.length == 0
    }
  },
  data() {
    return {
      displayCategories: [],
      categoryTooltips: {},
      interventionSelections: {},
      currentPatient: null,
      currentScenario: null,
      allowCurrentScenarioSave: false,
      storedResponsesByCode: {},
      numCompletedScenarios: 0,
      savedResponseData: true,
      dsCategoriesSelected: [] // Limiter for the category selection in the case of system/user intervention (https://github.com/NewcastleRSE/Vue-eprase/issues/169)
    }
  },
  emits: ['allScenariosCompleted'],
  methods: {
    isBaby(patient) {
      return patientIsBaby(patient)
    },    
    formatAge(patient) {
      return patientAgeString(patient)
    },
    formatAgeCaption(patient) {
      return patientAgeCaption(patient, false)
    },
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
    initCategoryTooltips(tagsEl, firstTime = true) {
      const containerDiv = document.getElementById(tagsEl.fieldId)
      this.$nextTick(() => { 
        // Rejig tooltips on remaining entries in multiselect list
        containerDiv.querySelectorAll('li').forEach(optEl => {
          const catCode = optEl.id.match(/(CAT\d+)/)
          const catTip = this.categoryTooltips[catCode[1]]
          console.debug('Setting', catCode, 'tip to', catTip)
          if (firstTime) {
            optEl.setAttribute('data-bs-toggle', 'tooltip')
            optEl.setAttribute('data-bs-title', catTip)
          } else {
            const tooltip = Tooltip.getOrCreateInstance(optEl)
            tooltip.setContent({ '.tooltip-inner': catTip })
          }                           
        })
        // Add tooltips to selected entries
        containerDiv.querySelectorAll('span.vf-multiselect-tag-wrapper').forEach(selTag => {
          // The content of the tag wrapper is the category label
          const catLabel = selTag.innerText
          const catArr = this.displayCategories.filter(c => c.label == catLabel)
          if (catArr.length > 0) {
            selTag.setAttribute('data-bs-toggle', 'tooltip')
            selTag.setAttribute('data-bs-title', this.categoryTooltips[catArr[0].value])      
          }
        })
      })       
    },
    updateCategorySelector(newVal, oldVal, tagsEl) {

      console.group()
      console.debug('Category selector updated', newVal, oldVal, tagsEl)

      // Update the tooltips on list entries and selected tags
      this.initCategoryTooltips(tagsEl, false)

      this.dsCategoriesSelected = tagsEl.value

      console.groupEnd()
    },
    storeResponse(patient, scenario) {
      if (!( scenario.scenario_code in this.storedResponsesByCode )) {
        // All good to go
        this.savePatientScenarioResponse(patient, scenario, this.scenarioForm.data[scenario.scenario_code])
        this.storedResponsesByCode[scenario.scenario_code] = this.scenarioUserResponses[scenario.scenario_code]        
        this.numCompletedScenarios++          
        setTimeout(() => {
          this.savedResponseData = true
          if (this.numCompletedScenarios == this.scenarioCount) {
            this.$emit('allScenariosCompleted')
          }
        }, 200)
      }   
    },
    async saveScenarioResponse(patient, scenario) {
      
      console.group('saveScenarioResponse()')
      console.debug('Patient', patient, 'scenario', scenario, 'form part-object', this.scenarioForm)      
     
      // Validate the patient/scenario form snippet
      this.scenarioForm.validateChildren().then(async () => {
        if (!this.scenarioForm.invalid) {
          this.savedResponseData = false
          this.storeResponse(patient, scenario)
        }
      })
                     
      console.groupEnd()
    },     
    showUniqueScenario() {
      // Insane hack to fix https://github.com/NewcastleRSE/Vue-eprase/issues/275 - reactivity should be sufficient but sometimes isn't...
      // So when a patient record is clicked out of order, make sure only the current scenario is activated (remove 'active' and 'active show' from elements)
      // Probably not needed in this context, but left in just in case - David 01/06/2026
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

      this.dsCategoriesSelected = []
      const doneScenarios = Object.keys(this.scenarioResponses)
      console.debug('Done', doneScenarios.length, 'of', this.scenarioCount, 'scenarios')
      if (doneScenarios.length < this.scenarioCount) {
        // Still some to do, so find the next uncompleted one (won't necessarily be sequential...)
        console.debug('Still scenarios to complete')
        const incompleteScenarioCodes = Object.keys(this.scenarioPatientLink).filter(sc => !doneScenarios.includes(sc))
        console.assert(incompleteScenarioCodes.length > 0, 'No non-complete scenarios found')
        await this.$nextTick(() => { 
          this.allowCurrentScenarioSave = false
          this.currentScenario = incompleteScenarioCodes[0]
          this.currentPatient = this.scenarioPatientLink[this.currentScenario] 
          this.showUniqueScenario()       
          const patientElement = document.getElementById('scenario-patient-' + this.currentPatient)
          if (patientElement != null) {
            this.$nextTick(() => { 
                patientElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest'
              })
            })            
          }
        console.debug('Set current patient to', this.currentPatient, 'current scenario to', this.currentScenario)
        })       
      } else {
        console.debug('All scenarios completed')
        this.$emit('allScenariosCompleted')
      }
      console.groupEnd()
    },
    // Allow user to simply click on any patient within the list e.g. to review responses
    // Not needed if practice session limited to one patient, but left here in case...
    async openPatientScenarios(patientCode) {

      console.group('openPatientScenarios()')

      await this.$nextTick(() => {
        this.allowCurrentScenarioSave = false
        this.currentPatient = patientCode
        this.currentScenario = this.patientScenarios[patientCode][0].scenario_code
        this.showUniqueScenario()
        console.debug('openPatientScenarios - set current patient to', this.currentPatient, 'current scenario to', this.currentScenario)
      })  
      
      console.groupEnd()
    },    
    scenarioResponse(scenarioCode) {
      return this.scenarioResponses[scenarioCode] || {}
    },
    scenarioCompleted(scenarioCode) {
      return scenarioCode in this.scenarioResponses
    },
    humanFriendlyCategories(categories) {
      // Expects category codes CAT001,CAT002...
      if (categories) {
        let catLabels = categories.split(',').map(c => this.displayCategories.filter(dc => c == dc.value)[0].label)
        return catLabels.map(cl => cl.substring(0, 1).toUpperCase() + cl.substring(1).toLowerCase())
      } else {
        return []
      }
    },
    setIntervention(newVal, oldVal, el$) {
      console.group('setIntervention()')
      const identifier = el$.dataPath.split('.').slice(1).join('.')
      // This sets the object key to <patient_code>.<scenario_code>.outcome
      if (this.interventionSelections[identifier] != newVal) {
        // Only set this reactive quantity if its value has *actually* changed - 'change' event is fired multiple times for radios and Vue slows down dramatically as the DOM is rewritten multiple times!
        console.debug('New value', newVal, 'old value', oldVal, 'selection value', this.interventionSelections)
        this.interventionSelections[identifier] = newVal
      } 
      console.debug('Identifier', identifier, 'current patient', this.currentPatient, 'current scenario', this.currentScenario)
      console.debug('Intervention selections', this.interventionSelections)
      console.groupEnd()
    }
  },
  async mounted() {
    console.group('Scenario mounted()')
    new Tooltip(document.body, {
      selector: '[data-bs-toggle="tooltip"]',
      trigger: 'hover'
    })
    // Get mitigation and category base data
    let wasError = false
    const mitResponse = await this.getMitigationDetails()
    wasError = await this.errorResponder(mitResponse)
    if (!wasError) {
      const catResponse = await this.getCategoryDetails()
      wasError = await this.errorResponder(catResponse)
    } if (!wasError) {
      // Massage the category list for better use in Vueform components      
      this.displayCategories = this.categories.map(c => { return { value: c.category_code, label: c.name } })
      this.categoryTooltips = {}
      this.categories.forEach(c => this.categoryTooltips[c.category_code] = c.description)      
      this.$nextTick(() => { this.openNextUnenteredScenario() })
    }       
    console.groupEnd()
  }
}
</script>

<style scoped></style>