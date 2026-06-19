<template>
  <GenericModal :modalName="'PracticeModal'" :class="'modal-lg'" :modalId="'practiceModal'" :title="'Practise answering scenario questions?'"
    :showActionBtn="true" :actionBtnText="'Yes please'" :closeBtnText="'No thanks'" @modalClosed="showInFuture" @modalActioned="doPractice">
    <div>
      <p>Before beginning the assessment, you will have the opportunity to complete a short practice session.</p>
      <p>This is designed to help you:</p>
      <ul class="list-group mb-4">
        <li class="list-group-item">Understand the workflow</li>
        <li class="list-group-item">See how scenarios work</li>
        <li class="list-group-item">Learn how to record outcomes correctly</li>  
      </ul>
      <p>Key things to remember:</p>
      <ul class="list-group mb-4">
        <li class="list-group-item">This is a <span class="fw-bold">practice session</span>, not a formal assessment</li>
        <li class="list-group-item">There is no scoring or formal report - this is purely for learning</li>
        <li class="list-group-item">You can repeat it if needed</li>
        <li class="list-group-item">
          Focus on:
          <ul class="list-group">
            <li class="list-group-item">Following instructions precisely</li>
            <li class="list-group-item">Observing system behaviour</li>
            <li class="list-group-item">Accurately recording outcomes</li>
          </ul>
        </li>  
      </ul>
      <p>To complete the full assessment, you must be able to:</p>
      <ul class="list-group mb-4">
        <li class="list-group-item">Access a patient record</li>
        <li class="list-group-item">Prescribe medications within your system</li>
      </ul>
      <p class="fw-bold">Would you like to carry out a practice test before beginning the assessment?</p>
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
