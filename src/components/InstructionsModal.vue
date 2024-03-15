<template>
  <GenericModal :modalName="'InstructionsModal'" :modalId="'instructionsModal'" :title="'ePRaSE Instructions'"
    :closeBtnText="'Close'">
    <p>The ePRaSE assessment involves several test patient scenarios. For each patient, you will be asked to complete a
      set of tasks. Progress is saved between patients. Each scenario is expected to take approximately 10 minutes to
      complete. Once the assessment is complete, you will be able to view your results.</p>
    <div class="instructions">
      <h4>Step 1: Enter Patient Information</h4>
      <p>You will be asked to admit the test patients into your ePrescription system.</p>
    </div>
    <div class="instructions">
      <h4>Step 2: Prescribe Medication</h4>
      <p>You will be asked to prescribe a number of medicines to the test patient. You will be asked a short series of
        questions about any feedback or intervention from the e-Prescribing System.</p>
    </div>
  </GenericModal>
</template>

<script>

import GenericModal from './GenericModal'
import { mapStores } from 'pinia'
import { rootStore } from '../stores/root'

export default {
  name: "InstructionsModal",
  components: {
    GenericModal
  },
  computed: {
    ...mapStores(rootStore)
  },
  methods: {
    close() {
      rootStore().audit('View instructions', '/assessmentintro')
    }
  }
}

</script>

<style scoped></style>
