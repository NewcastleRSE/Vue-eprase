<template>

  <div id="page">
    <div id="test-scenario">

      <div class="config-error-info">
        <p>
          Are you still able to access the patient record for <strong>{{assessment.getFirstPatient().first_name}} {{assessment.getFirstPatient().surname}}</strong>?<br/><br/>
          (Click 'No' if you had to close the patient record to continue or if the system closed it for you automatically.
          Click 'Yes' if you manually closed it but were not required to do so by the system.)
        </p>
      </div>
      <div align="center">
        <div class="questionnaire">
          <h4>Questions</h4>
          <div class="question form-group" id="question-1">
            <p class="recordlabel">Was the patient record still open?</p>
            <span class="radio-buttons">
          <label for="radio-yes" class="radio-label">Yes</label>
            <input type="radio" value=1 id="radio-yes" name="patientrecord" v-model="response.result" checked>

          <label for="radio-no" class="radio-label">No </label>
            <input type="radio" value=0 id="radio-no" name="patientrecord">
        </span>
          </div>
          <div class="assessment">
            <p>Note any intervention from the system using the box below.</p>
            <div align="center">
              <div class="alert alert-warning" role="alert">
                To optimise the use of this tool please record ALL types of guidance that appears on your system screen in the comments boxes provided
              </div>
              <textarea type="text" name="input" id="patient-intervention" class="form-control" v-model="response.qualitative_data" placeholder="Enter notes here..." maxlength="250"></textarea>
            </div>
          </div>
        </div>
      </div>

    </div>

    <div class="form-group footer" align="center">
      <div class="buttons">
        <button type="button" class="btn btn-primary" @click="onExitClick()">Exit</button>
        <button type="button" class="btn btn-primary visible" id="next-button" @click="onNextClick()">Next</button>
        <button type="button" class="btn btn-primary invisible" id="done-button"@click="onDoneClick()" disabled>Done</button>
      </div>
    </div>

  </div>

</template>

<script>
    export default {
        name: "ConfigError"
    }
</script>

<style scoped>

  #page {
    text-align: left;
  }

  #test-scenario {
    border: 1px solid #c2c2c2;
    padding: 20px 0px;
  }

  .subtitle {
    text-align: center;
    color: darkgrey;
  }

  .config-error-info {
    max-width: 850px;
    margin-bottom: 40px;
  }

  .config-error-info p {
    text-align: left;
  }

  .config-error {
    margin-top: 30px;
    margin-bottom: 30px;
  }

  .radio-label {
    padding-left: 20px;
    padding-right: 5px;
  }

  .questionnaire {
    max-width: 890px;
    margin-top: 20px;
    margin-bottom: 30px;
  }

  .question p {
    margin-bottom: 20px;
    text-align: left;
  }

  button:disabled {
    background-color: dimgray;
  }

  .assessment {
    padding-top: 25px;
  }


  #patient-intervention {
    width: 600px;
    height: 100px;
  }

  .recordlabel {
    font-weight: 700;
    max-width: 400px;
    display: inline-block;
    float:left;
  }

  #radio-yes {
    width: 12px;
  }

  #radio-no {
    width: 12px;
  }

  .radio-buttons {
    margin-left: 20px;
  }

  button {
    height: 40px;
    width: 100px;
    margin: 10px 0px;
    font-size: 1.2em;
    margin: 0 50px;
  }

  .visible {
    visibility: visible;
  }
  .invisible {
    visibility: hidden;
  }

  .footer {
    margin-top: 10px;
    margin-bottom: 40px;
  }

  .footer p {
    padding-bottom: 10px;
  }

  input[type=radio] {
    margin: 0;
  }

  .alert-warning {
    background-color: #f6ecb8;
    border-color: #ffd47d;
  }




</style>
