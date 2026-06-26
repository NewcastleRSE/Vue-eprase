<template>
  <GroupElement ref="practiceReportGroup" name="practiceReportGroup" :class="'my-4'">  
    <StaticElement name="practiceReportHeading">
      <h2>End of Practice Session</h2>
    </StaticElement>
    <StaticElement name="practiceReportInfo">
      <div class="alert alert-info" role="alert">
        Once you are comfortable with the process, please complete the pre-start checklist and then proceed to the full assessment.
      </div>
    </StaticElement>    
  </GroupElement>  
</template>

<script>

export default {
  name: 'PracticeReport'
}
</script>

<style scoped></style>
