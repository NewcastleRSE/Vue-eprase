<template >
  <form-wizard shape="tab" color="#005EB8" title="" subtitle="">
    <tab-content title="System">
      <assessment-part1></assessment-part1>
    </tab-content>
    <tab-content title="Patients" >
      <assessment-part2></assessment-part2>
    </tab-content>
    <tab-content title="Scenarios">
      <assessment-part3></assessment-part3>
    </tab-content>

    <tab-content title="Report">
      <assessment-part4></assessment-part4>
    </tab-content>
  </form-wizard>

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
