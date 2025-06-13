<template>
  <GenericModal :modalName="'ContactModal'" :modalId="'contactModal'" :title="'Contact email for ePRaSE'"
    :closeBtnText="'Close'">
    <p> Contact for the ePRaSE project is via email only. ePRaSE is a research project, please allow up to 2 working days for a response.</p>
    <ul class="list-group">      
      <li class="list-group-item">
        <i class="bi bi-envelope pe-2"></i>
        <a href="mailto:nuth.eprase@nhs.net">nuth.eprase@nhs.net</a>
      </li>     
    </ul>
  </GenericModal>
</template>

<script>

import GenericModal from './GenericModal'
import { mapState } from 'pinia'
import { rootStore } from '../stores/root'

export default {
  name: "ContactModal",
  components: {
    GenericModal
  },
  computed: {
    ...mapState(rootStore, ['audit'])
  },
  methods: {
    close() {
      this.audit('View contact', '/assessmentintro')
    }
  }
}
</script>

<style scoped></style>
