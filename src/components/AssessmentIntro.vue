<template>
  <div id="page">

    <div id="header" class="level">
    </div>

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

      <div v-if="assessmentStatus" class="progress"> Your organisation ASSESSMENT STATUS is : {{ assessmentStatus }}</div>

      <div v-if="assessmentStatus" class="buttons">
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

    <div class="added-content" v-show="userIsAdmin === 'true'">
      <button id="reports" @click="getAllReports()"><font-awesome-icon icon="chart-bar"></font-awesome-icon> View all reports</button>
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
    import {userService} from "../services/user.service";
    import _ from "lodash";

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
                year: settings.year,
                userIsAdmin: false
            }
        },
        methods: {
            checkIsAdminUser() {
              let user_id = localStorage.getItem('userId');
              userService.checkIsAdminUser(user_id).then(data => {
                this.userIsAdmin = data;
              });
            },
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
                if(this.assessmentStatus === 'System Information Complete'){
                    this.$router.push({ path: './setpatients' });
                }
                else if(this.assessmentStatus === 'Create Patients in Progress'){
                    this.$router.push({ path: './assessmentpatientdetails' });
                }
                else if(this.assessmentStatus === 'Create Patients Complete'){
                    this.$router.push({ path: './lockoutscreen?patientscompleted=true' });
                }
                else {
                     this.$router.push({ path: './assessmentsystem' });
                }
            },
            getRequiredPatients() {

                let requiredAdultPatients = [];
                let requiredChildPatients = [];
                let allRequiredPatients = [];

                patientService.getRequiredTests().then(data => {
                    let tests = data;
                    for(let test in tests) {
                      if (tests.hasOwnProperty(test)) {
                        let requiredPatient = tests[test].patient;
                        requiredPatient = patientService.formatPatientData(requiredPatient);
                        if(requiredPatient.age >= 18){
                          requiredAdultPatients.push(requiredPatient);
                        }
                        else {
                          requiredChildPatients.push(requiredPatient);
                        }
                        allRequiredPatients.push(requiredPatient);
                      }
                    }
                    localStorage.setItem('requiredAdultPatients', JSON.stringify(requiredAdultPatients));
                    localStorage.setItem('requiredChildPatients', JSON.stringify(requiredChildPatients));
                    localStorage.setItem('allRequiredPatients', JSON.stringify(allRequiredPatients));
                });
            },
            getAllReports() {
              this.$router.push({ path: './assessmentreports' });
            }
        },
        created : function() {
            this.checkIsAdminUser();
            this.checkAssessmentComplete();
            this.getAssessmentStatus();
            this.getRequiredPatients();
            dataService.audit('View assessment intro', '/assessmentintro');
        }
    }
</script>

<style scoped>


  #header {
    background-image: url("../assets/pills-bw.png");
    background-size: 100% auto;
    background-repeat: no-repeat;
    border-top-left-radius: 25px;
    border-top-right-radius: 25px;
  }
  .level {
    height: 80px;
  }

  #reports {
    width: 170px;
  }

  button {
    height: 40px;
    width: 250px;
    margin: 10px 0;
    font-size: 1em;
    border-width: 1px;
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

  .added-content {
    padding: 0 0 30px 40px;
  }

  .btn-primary {
    background-color: #07818e;
  }

  .divcontent {
    padding: 20px 0;
  }

  .progress {
    color: #07818e;
    background-color: #fff;
    font-size: 0.9em;
    height: 30px;
    line-height: 30px;
  }

</style>
