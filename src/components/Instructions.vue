<template>
  <div id="page">
    <Header />
    <div id="content">
      <h1>ePRaSE Assessment Instructions</h1>
      <div class="section"> <p>The ePRaSE assessment involves 10 test patient scenarios. For each patient, you will be asked to complete two sets of tasks.</p>
        <h3>Step 1: Enter Patient Information</h3>
        <p>You will be asked to admit the test patients into your ePrescription system.</p>
      </div>
      <div class="section">
        <h3>Step 2: Prescribe Medication</h3>
        <p>You will be asked to prescribe a number of medicines to the test patient. You will be asked a short series of questions about any feedback or intervention from the e-Prescribing System.</p>
      </div>
      <div class="section">
        <h3>Additional Information</h3>
        <p>Progress is saved between patients. Each scenario is expected to take approximately 10 minutes to complete.</p>
        <p>Once the assessment is complete, you will be able to view your results.</p>
      </div>
    </div>
  </div>

</template>

<script>
    import Header from "./Header";
    export default {
        name: "Instructions",
        components: {Header}
    }
</script>

<style scoped>

  #page {
    text-align: left;
  }

  #content {
    padding: 40px;
  }

  .section {
    padding: 5px 0;
  }

</style>
