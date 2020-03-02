<template>
  <div id="page">

    <TabHeader system-opacity="0.2" patient-opacity="0.2" scenario-opacity="0.2" report-opacity="0.2"></TabHeader>
    <div class="content" v-if="assessmentComplete === false">
      <h1>Welcome to the ePRaSE Assessment</h1>

      <p>The following assessment is designed to evaluate the performance of an e-prescription system against a range of indicators.</p>
      <p>The ePRaSE assessment will be repeated annually.</p>

      <p></p>
      <h4>Instructions</h4>
      <p>The assessment comprises 4 parts. You will be asked to admit a series of test patients to hospital's admissions system and then
        to prescribe a series of medications to those patients. You will then be asked to provide feedback about any advice or intervention from the system.</p>

      <h3>{{ year }} ePRaSE Assessment</h3>
      <p>The original ePRaSE assessment was released in July 2019. <br/>To take part in the current ePRaSE assessment, click the button below.</p>

      <div class="buttons">
        <button class="start-btn btn btn-primary" v-if="assessment.currentPart===1" @click="onStartAssessmentClick()">Begin {{ year }} Assessment</button>
        <button class="btn btn-primary" v-if="assessment.currentPart>1" @click="onStartAssessmentClick()">Continue {{ year }}  Assessment</button>
      </div>
    </div>

    <div class="content" v-if="assessmentComplete === true">
      <h1>Assessment Complete</h1>
      <p>Thank you for taking part in the {{ year }} ePRaSE Assessment.</p>
      <p>To view the results of this assessment, click the 'View Results' button below.</p>
      <br/>
      <p>This assessment will be repeated annually, you will be informed by email when the next assessment is available.</p>
      <div class="buttons">
        <button class="btn btn-primary" @click="onResultsClick()">View Results</button>
      </div>
    </div>

    <AppFooter />
    <AppLogo></AppLogo>


  </div>

</template>

<script>

    import { settings } from '../settings';
    import { dataService } from '../services/data.service';
    import { patientService } from '../services/patient.service';
    import TabHeader from './TabHeader';
    import AppFooter from "./AppFooter";
    import AppLogo from "./AppLogo";

    export default {
        name: "AssessmentIntro",
        components: {
            AppFooter,
            TabHeader,
            AppLogo
        },
        data() {
            return {
                assessmentComplete : false,
                assessment : {
                    currentPart : dataService.getAssessmentPart()
                },
                year: settings.year
            }
        },
        methods: {
            checkAssessmentComplete() {
                this.assessmentComplete = localStorage.getItem('assessmentComplete');
                if(this.assessmentComplete == null){
                    this.assessmentComplete = false;
                }
               return this.assessmentComplete;
            },
            onResultsClick() {
                this.$router.push({ path: './resultshome' });
            },
            onStartAssessmentClick() {
                patientService.setPatientsInStore();
                this.$router.push({ path: './assessmentsystem' });
            }
        },
        created : function() {
            this.checkAssessmentComplete();
            dataService.audit('View assessment intro', '/assessmentintro');
        },
        computed: {
            user() {
                return this.$store.state.authentication.user;
            }
        },
    }
</script>

<style scoped>

  button {
    height: 40px;
    width: 250px;
    margin: 10px 0;
    font-size: 1em;
    /*border-radius: 5px; */
  }

  .start-btn {
    font-size: 1.2em;
    width: 280px;
  }

  button a {
    padding: 3px;
  }

  #page {
    text-align: left;
  }

  .content {
    padding: 40px;
  }

  .btn-primary {
    background-color: #07818e;
  }

</style>
