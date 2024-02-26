<template>
  <GenericModal :modalName="'ContactModal'" :modalId="'contactModal'" :title="'Contacts for ePRaSE'"
    :closeBtnText="'Close'">
    <p> Contacts for the ePrase project are:</p>
    <ul class="list-group">
      <li class="list-group-item">
        <i class="bi bi-envelope pe-2"></i>
        rseteam@newcastle.ac.uk
      </li>
      <li class="list-group-item">
        <i class="bi bi-envelope pe-2"></i>
        stephanie.klein@nhs.net
      </li>
      <li class="list-group-item">
        <i class="bi bi-envelope pe-2"></i>
        jude.heed@newcastle.ac.uk
      </li>
    </ul>
  </GenericModal>
</template>

<script>

import GenericModal from './GenericModal'
import { dataService } from '../services/data.service'

export default {
  name: "ContactModal",
  components: {
    GenericModal
  },
  methods: {
    // close (){
    //     dataService.audit('View contact', '/assessmentintro');
    //     this.$emit('close')
    // }
  }
}
</script>

<style scoped></style>
