<template>
  <div>
    <button type="button" class="btn btn-outline-primary m-1" data-bs-toggle="modal" data-bs-target="#aboutModal"><i
        class="bi bi-info-circle pe-1"></i>About</button>
    <button type="button" class="btn btn-outline-primary m-1" data-bs-toggle="modal" data-bs-target="#instructionsModal"><i
        class="bi bi-clipboard pe-1"></i>Instructions</button>
    <button type="button" class="btn btn-outline-primary m-1" @click="reports()"><i
        class="bi bi-bar-chart pe-1"></i>Reports</button>
    <a href="https://eprasedocs.blob.core.windows.net/web/Eprase2022UserGuide.pdf" target="_blank" type="button"
      class="btn btn-outline-primary m-1"><i class="bi bi-question-circle pe-1"></i>User Guide</a>
    <button type="button" class="btn btn-outline-primary m-1" data-bs-toggle="modal" data-bs-target="#contactModal"><i
        class="bi bi-person-circle pe-1"></i>Contact</button>
    <button class="btn btn-outline-primary m-1" @click="signout()"><i class="bi bi-box-arrow-right pe-1"></i>Logout</button>
  </div>
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
  },
  methods: {
    reports() {
      this.$router.push('/resultshome')
    },
    signout() {
      this.$router.push('/logout')
    }
  }
}

</script>

<style scoped></style>
