<template>

  <div>
    Containing template
  </div>

</template>

<script>

    import AssessmentPart1 from "./AssessmentPart1";
    import AssessmentPart2 from "./AssessmentPart2";
    import AssessmentPart3 from "./AssessmentPart3";
    import AssessmentPart4 from "./AssessmentPart4";

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
