<template>
  <GenericModal :modalName="'SurveyLinkModal'" :modalId="'surveyLinkModal'" :title="'Before you leave'"
    :actionBtnText="'Log out'" :closeBtnText="'Close'">
    Please take a few moments to <a href="https://forms.cloud.microsoft/e/4Z8dRDzv4e" target="_blank">complete the ePRaSE user experience survey</a>.
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
