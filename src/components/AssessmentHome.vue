<template>
  <div id="page">
    <AppHeader />
    <div id="content">
      <h1>Assessment Home</h1>
      <p>Welcome to the ePRaSE assessment.</p>
      <h3>Instructions</h3>
      <p>The assessment comprises 4 parts. You will be asked to admit a series of test patients to hospital's admissions system and then
        to prescribe a series medications to those patients. You will then be asked to provide feedback about any advice or intervention from the system.</p>
      <p><router-link to="/instructions">Click here</router-link> for more detailed instructions.</p>

      <div align="center">
        <div id="progress-bar">
          <p><strong>Progress:</strong></p>
          <table>
            <tr>
              <td>
                Part 1 - Initial Questions
              </td>
              <td v-if="getServiceData === null" class="td-right">
                Incomplete
              </td>
              <td v-if="getServiceData === 'completed'" class="td-right">
                Complete
              </td>
            </tr>
            <tr>
              <td>
                Part 2 - Admit Patients
              </td>
              <td v-if="getPatientData === null" class="td-right">
                Incomplete
              </td>
              <td v-if="getPatientData === 'completed'" class="td-right">
                Complete
              </td>
            </tr>
            <tr>
              <td>
                Part 3 - Patient Information
              </td>
              <td class="td-right">
                {{assessment.currentPatientIndex}}/{{assessment.numPatients}} Patients Complete
              </td>
            </tr>
            <tr>
              <td>
                Part 4 - Assessment Prescriptions
              </td>
              <td class="td-right">
                {{assessment.currentTestIndex}}/{{assessment.numTests}} Prescriptions Complete
              </td>
            </tr>
          </table>
        </div>
        <table>
          <tr>
            <td v-if="assessment.currentPart===1">
              <div align="center">
                <p>To begin the assessment, click the button below.</p>
                <button type="button" class="btn btn-primary" @click="onContinueClick()">Begin Assessment</button>
              </div>
            </td>
            <td v-if="assessment.currentPart>1">
              <div align="center">
                <p>To continue the assessment, click the button below.</p>
                <button type="button" class="btn btn-primary" @click="onContinueClick()">Continue Assessment</button>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>

    import { settings } from '../settings';
    import { dataService } from '../services/data.service';
    import { patientService } from '../services/patient.service';
    import AppHeader from './AppHeader';

    export default {
        name: "AssessmentHome",
        components: {
           AppHeader
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
