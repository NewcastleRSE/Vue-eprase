<template>
  <div id="page">
    <div id="content">
      <h1>Welcome to the ePRaSE Assessment</h1>
      <p></p>
      <h4>Instructions</h4>
      <p>The assessment comprises 4 parts. You will be asked to admit a series of test patients to hospital's admissions system and then
        to prescribe a series medications to those patients. You will then be asked to provide feedback about any advice or intervention from the system.</p>
    </div>
  </div>
</template>

<script>

    import { settings } from '../settings';
    import { dataService } from '../services/data.service';
    import { patientService } from '../services/patient.service';

    export default {
        name: "AssessmentHome",
        components: {
        },
        computed : {
            getServiceData() {
                return this.$store.state.part1complete;
            },
            getPatientData() {
                return this.$store.state.part2complete;
            }
        },
        data() {
            return {
                assessmentComplete : false,
                assessment : {
                    currentPart : dataService.getAssessmentPart(),
                    currentPatientIndex : patientService.getPatientIndex(),
                    currentTestIndex: patientService.getTestIndex(),
                    numPatients: patientService.getNumPatients(),
                    numTests : settings.numPrescriptions + settings.numConfigError
                }
            }
        },
        methods: {
            onContinueClick() {
                let location = './assessmentpart' + this.assessment.currentPart;
                this.$router.push({ path: location });
            }
        }
    }
</script>

<style scoped>

  #page {
    text-align: left;
  }

  #content {
    padding: 40px;
  }

  #progress-bar {
    padding-top: 10px;
    padding-bottom: 20px;
    margin: 20px 200px;
    background-color: #cdf8ff;
    border: 1px solid #6b9bc7;
    border-radius: 25px;
    width: 600px;
  }

  #progress-bar p {
    text-align: center;
  }

  .td-right {
    text-align: right;
  }

  td {
    padding:  10px;
    font-size: 14px;
  }

  button {
    height: 40px;
    width: 250px;
    margin: 10px 0px;
    font-size: 1.2em;
  }


</style>
