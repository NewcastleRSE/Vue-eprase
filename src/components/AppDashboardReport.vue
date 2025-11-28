<template>
  <main class="leftalign">

    <div class="content p-4">

      <Vueform>        
        <AssessmentFinalReport />
      </Vueform>

    </div>

  </main>
</template>

<script>

import AssessmentFinalReport from './AssessmentFinalReport'

export default {
  name: 'AppDashboardReport',
  computed: {
  },
  components: {
    AssessmentFinalReport
  }
}

</script>

<style scoped></style>
