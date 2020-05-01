<template>
  <div id="page">

    <TabHeader system-opacity="0.2" patient-opacity="0.2" scenario-opacity="0.2" report-opacity="0.2"></TabHeader>
    <div class="content" v-if="assessmentComplete !== true">
      <h1>Welcome to the ePRaSE Assessment</h1>

      <p>The following assessment is designed to evaluate the performance of an e-prescription system against a range of indicators.</p>
      <p>The ePRaSE assessment will be repeated annually.</p>

      <p></p>
      <h4>Instructions</h4>
      <p>The assessment comprises 4 parts. You will be asked to admit a series of test patients to hospital's admissions system and then
        to prescribe a series of medications to those patients. You will then be asked to provide feedback about any advice or intervention from the system.</p>

      <h3>{{ year }} ePRaSE Assessment</h3>
      <p>The original ePRaSE assessment was released in July 2019. <br/>To take part in the current ePRaSE assessment, click the button below.</p>

      <div class="progress"> Your organisation progress is : {{ assessmentStatus }}</div>

      <div class="buttons">
        <button class="start-btn btn btn-primary" v-if="assessmentStatus === 'Not Started'" @click="onStartAssessmentClick()">Begin {{ year }} Assessment</button>
        <button class="btn btn-primary" v-if="assessmentStatus !== 'Not Started' && assessmentStatus !== 'Fully Complete'" @click="onStartAssessmentClick()">Continue {{ year }}  Assessment</button>
      </div>
      <p></p>
    </div>



    <div class="content" v-if="assessmentComplete === true">

      <h2>Assessment Complete</h2>
      <div class="divcontent">
        <p>Thank you for taking part in the {{ year }} ePRaSE Assessment.</p>
        <p>To view the results of this assessment, click the 'Reports' button below.</p>
        <p>This assessment will be repeated annually, you will be informed by email when the next assessment is available.</p>
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
                assessmentStatus : '',
                assessmentId : '',
                year: settings.year
            }
        },
        methods: {
            checkAssessmentComplete() {
                dataService.getAssessmentStatus().then(data => {
                   this.assessmentComplete = data.status;
                   this.assessmentId = data.id;
                   localStorage.setItem('assessmentId', this.assessmentId);
                });
            },
            getAssessmentStatus() {
              dataService.getAssessmentLatestCompletedPart().then(data => {
                  this.assessmentStatus = data.status;
                });
            },
            onResultsClick() {
                this.$router.push({ path: './resultshome' });
            },
            onStartAssessmentClick() {
                if(this.assessmentStatus === 'System Complete'){
                    this.$router.push({ path: './setpatients' });
                }
                else if(this.assessmentStatus === 'Create Patients in Progress'){
                    this.$router.push({ path: './assessmentpatientdetails' });
                }
                else if(this.assessmentStatus === 'Create Patients Complete'){
                    this.$router.push({ path: './lockoutscreen/' + true });
                }
                else {
                     this.$router.push({ path: './assessmentsystem' });
                }
            }
        },
        created : function() {
            this.checkAssessmentComplete();
            this.getAssessmentStatus();
            dataService.audit('View assessment intro', '/assessmentintro');
        }

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

  .divcontent {
    padding: 20px 0;
  }

  .progress {
    color: #cd0a2a;
    background-color: #fff;
    font-size: 0.8em;
  }

</style>
