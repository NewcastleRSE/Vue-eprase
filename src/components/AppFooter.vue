<template>
  <Vueform ref="footerButtonBar">
    <GroupElement name="buttonBar" :columns="12" :add-class="'mt-2'">
      <ButtonElement name="about" title="About" full
        data-bs-toggle="modal" data-bs-target="#aboutModal"
        :columns="3" 
        :add-class="'me-2'">
        <i class="bi bi-info-circle me-lg-2"></i><span class="d-lg-block d-sm-none d-none">About</span>
      </ButtonElement>
      <ButtonElement name="instructions" full 
        data-bs-toggle="modal" data-bs-target="#instructionsModal"
        :columns="3" 
        :add-class="'mx-2'">
        <i class="bi bi-file-earmark-text me-lg-2"></i><span class="d-lg-block d-sm-none d-none">Instructions</span>
      </ButtonElement>      
      <ButtonElement name="userGuide" full 
        button-type="anchor"
        href="https://eprasedocs.blob.core.windows.net/web/Eprase2024UserGuide.pdf"
        target="_blank"
        title="PDF - opens in a new tab"
        :columns="3" 
        :add-class="'mx-2'">
        <i class="bi bi-question-circle me-lg-2"></i><span class="d-lg-block d-sm-none d-none">User guide</span>
      </ButtonElement>
      <ButtonElement name="contact" full 
        data-bs-toggle="modal" data-bs-target="#contactModal"
        :columns="3"
        :add-class="'ms-2'">
        <i class="bi bi-person-circle me-lg-2"></i><span class="d-lg-block d-sm-none d-none">Contact</span>
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
  components: {
    InstructionsModal,
    AboutModal,
    ContactModal
  }
}

</script>

<style scoped></style>
