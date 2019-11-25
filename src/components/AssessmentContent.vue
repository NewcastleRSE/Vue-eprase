<template>

  <div>
    Containing template
  </div>

</template>

<script>

    import AssessmentPart1 from "./AssessmentSystem";
    import AssessmentPart2 from "./AssessmentPatients";
    import AssessmentPart3 from "./AssessmentPatientDetails";
    import AssessmentPart4 from "./AssessmentScenarios";

    export default {
        name: "AssessmentContent",
        components: {
            AssessmentPart1,
            AssessmentPart2,
            AssessmentPart3,
            AssessmentPart4
        }
    }
</script>

<style scoped>

  .wizard-icon {
    height: 40px;
    width: 40px;
  }

</style>
