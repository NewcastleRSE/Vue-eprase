<template>
  <GenericModal :modalName="'PracticeModal'" :modalId="'practiceModal'" :title="'Practice answering scenario questions?'"
    :showActionBtn="true" :actionBtnText="'Yes please'" :closeBtnText="'No thanks'" @modalClosed="showInFuture" @modalActioned="doPractice">
    <div>
      For those new with ePRaSE, there is a guided opportunity to get familiar with the way the scenario questions work,
      and to understand more about how your responses are evaluated by the ePRaSE tool.  
      <div class="form-check mt-2">
        <input ref="cbDontShowAgain" class="form-check-input" type="checkbox" value="" :id="'practiceModal-dont-show-again'">
        <label class="form-check-label" :for="'practiceModal-dont-show-again'">Don't show this again</label>
      </div>
    </div>
  </GenericModal>
</template>

<script>

import Cookies from 'js-cookie'
import { setVisible } from '../../helpers/modal'
import GenericModal from './GenericModal'

export default {
  name: 'PracticeModal', 
  components: {
    GenericModal
  },
  methods: {
    show() {
      setVisible('practiceModal', true)
    },
    showInFuture() {
      const cb = this.$refs.cbDontShowAgain
      if (cb.checked) {
        Cookies.set('hidePracticeModal', 'yes', { expires: 90 })
      }
    },
    doPractice() {
      this.showInFuture()
      this.$router.push('/practice')
    }
  }
}
</script>

<style scoped></style>
