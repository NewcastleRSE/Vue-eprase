<template>
  <GenericModal :modalName="'AboutModal'" :modalId="'aboutModal'" :title="'About ePRaSE'" :closeBtnText="'Close'">
    <p>The ePrescribing Risk and Safety Evaluation tool (ePRaSE) is designed to evaluate ePrescription services,
      in order to determine their usefulness and to encourage the correct use of these systems
      and deliver improved patient outcomes.</p>
    <p>ePRaSE has been developed by the Pharmacy Department at the The Newcastle Hospitals NHS Foundation Trust and
      Newcastle University</p>
    <h4>Credits</h4>
    <p>The assessments were developed by Stephanie Klein and Jude Heed.</p>
    <p>The ePRaSE tool was developed by Mike Simpson and Rebecca Osselton from the Research Software Engineering Team at
      Newcastle University.</p>
  </GenericModal>
</template>

<script>

import { mapStores } from 'pinia'
import { rootStore } from '../stores/root'
import GenericModal from './GenericModal'

export default {
  name: "AboutModal",
  components: {
    GenericModal
  },
  computed: {
    ...mapStores(rootStore)
  },
  methods: {
    close() {
      rootStore().audit('View about', '/assessmentintro')
    }
  }
}
</script>

<style scoped></style>
