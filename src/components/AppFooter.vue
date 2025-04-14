<template>
  <Vueform ref="footerButtonBar">
    <GroupElement name="buttonBar" :columns="10" :add-class="'mt-2'">
      <ButtonElement name="about" full
        data-bs-toggle="modal" data-bs-target="#aboutModal"
        :columns="2" 
        :add-class="'me-2'">
        <i class="bi bi-info-circle me-2"></i>About
      </ButtonElement>
      <ButtonElement name="instructions" full 
        data-bs-toggle="modal" data-bs-target="#instructionsModal"
        :columns="2" 
        :add-class="'mx-2'">
        <i class="bi bi-clipboard me-2"></i>Instructions
      </ButtonElement>
      <ButtonElement name="reports" full 
        :columns="2" 
        :add-class="'mx-2'">
        <i class="bi bi bi-bar-chart me-2"></i>Reports
      </ButtonElement>
      <ButtonElement name="userGuide" full 
        button-type="anchor"
        href="https://eprasedocs.blob.core.windows.net/web/Eprase2024UserGuide.pdf"
        target="_blank"
        title="PDF - opens in a new tab"
        :columns="2" 
        :add-class="'mx-2'">
        <i class="bi bi-question-circle me-2"></i>User guide
      </ButtonElement>
      <ButtonElement name="contact" full 
        data-bs-toggle="modal" data-bs-target="#contactModal"
        :columns="2" 
        :add-class="'ms-2'">
        <i class="bi bi-person-circle me-2"></i>Contact
      </ButtonElement>
    </GroupElement>
  </Vueform>  
  <AboutModal />
  <InstructionsModal />
  <ContactModal />
</template>

<script>

import InstructionsModal from './InstructionsModal'
import AboutModal from './AboutModal'
import ContactModal from './ContactModal'

export default {
  name: "AppFooter",
  props: {
    allowReports: false
  },
  components: {
    InstructionsModal,
    AboutModal,
    ContactModal
  },
  methods: {
    reports() {
      if (this.allowReports) {
        this.$router.push('/assessmentresults')
      }     
    }
  }
}

</script>

<style scoped></style>
