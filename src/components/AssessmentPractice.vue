<template>
  <main class="leftalign">

    <div class="pills-banner"><img src="../assets/images/EPrase banner-01.jpg" alt="ePRaSE banner"></div>

    <div class="content p-4">

      <LoginInfo />

      <h1 class="assessment-head p-4">ePRaSE {{ year }} - Practice Mode</h1>

      <Vueform ref="assessmentPracticeForm">
        <template #empty>
          
        </template>
      </Vueform>
      <div class="px-4 my-4">
        <AppFooter />
      </div>    
    </div>
    <AppLogo cls="bottomright" />
  </main>  
</template>

<script>

import LoginInfo from './LoginInfo'
import AppFooter from './AppFooter'
import AppLogo from './AppLogo'

export default {
  name: 'AssessmentPractice', 
  computed: {
  }, 
  components: {
    LoginInfo,
    AppFooter,
    AppLogo
  },
  async mounted() {
    console.group('AssessmentPractice mounted hook')
    
    console.groupEnd()
  }
}
</script>

<style scoped>
.assessment-head {
  text-align: center;
}
</style>
