<template>
  <GenericModal :modalName="'SurveyLinkModal'" :modalId="'surveyLinkModal'" :title="'Before you leave'"
    :actionBtnText="'Log out'" :closeBtnText="'Close'">
    Please take a few moments to <a href="JavaScript:alert('Need URL for the survey here')">complete the ePRaSE user experience survey</a>.
  </GenericModal>
</template>

<script>

import { setVisible } from '../helpers/modal'
import GenericModal from './GenericModal'

export default {
  name: "SurveyLinkModal", 
  components: {
    GenericModal
  },
  methods: {
    show() {
      setVisible('surveyLinkModal', true)
    }
  }
}
</script>

<style scoped></style>
