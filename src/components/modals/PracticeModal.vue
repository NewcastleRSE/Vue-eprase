<template>
  <GenericModal :modalName="'PracticeModal'" :class="'modal-xl'" :modalId="'practiceModal'" :title="'Practise answering scenario questions?'"
    :showActionBtn="true" :actionBtnText="'Yes please'" :closeBtnText="'No thanks'" @modalClosed="showInFuture" @modalActioned="doPractice">
    <div>
      <p>Before beginning the assessment, you will have the opportunity to complete a short practice session.</p>
      <p>This is designed to help you:</p>
      <ul class="level1">
        <li class="all-levels">Understand the workflow</li>
        <li class="all-levels">See how scenarios work</li>
        <li class="all-levels">Learn how to record outcomes correctly</li>  
      </ul>
      <p>Key things to remember:</p>
      <ul class="level1">
        <li class="all-levels">This is a <span class="fw-bold">practice session</span>, not a formal assessment</li>
        <li class="all-levels">There is no scoring or formal report - this is purely for learning</li>
        <li class="all-levels">You can repeat it if needed</li>
        <li class="all-levels">
          Focus on:
          <ul class="level2">
            <li class="all-levels">Following instructions precisely</li>
            <li class="all-levels">Observing system behaviour</li>
            <li class="all-levels">Accurately recording outcomes</li>
          </ul>
        </li>  
      </ul>
      <p>To complete the full assessment, you must be able to:</p>
      <ul class="level1">
        <li class="all-levels">Access a patient record</li>
        <li class="all-levels">Prescribe medications within your system</li>
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
import { mapState } from 'pinia'
import { setVisible } from '../../helpers/modal'
import GenericModal from './GenericModal'
import { authenticationStore } from '../../stores/authentication'

export default {
  name: 'PracticeModal', 
  components: {
    GenericModal
  },
  computed: {
    ...mapState(authenticationStore, ['user'])
  },
  methods: {
    show() {
      setVisible('practiceModal', true)
    },
    showInFuture() {
      const cb = this.$refs.cbDontShowAgain
      if (cb.checked) {
        Cookies.set(`hidePracticeModal-${this.user}`, 'yes', { expires: 90 })
      }
    },
    doPractice() {
      this.showInFuture()
      this.$router.push('/practice')
    }
  }
}
</script>

<style scoped>

ul.level1 {
  list-style-type: disc;
  margin-left: 1em;
}

ul.level2 {
  list-style-type: circle;
  margin-left: 1em;
}

li.all-levels {
  display: list-item;  
}

</style>
