<template>
<div id="page">

  <TabHeader system-opacity="1.0" patient-opacity="0.5" scenario-opacity="0.2" report-opacity="0.2"></TabHeader>

  <div id="content">
    <h3>Assessment Patient Preparation</h3>
    <p>In preparation for the assessment, please complete the following tasks:</p>
    <div align="center">
      <div class="patient-info">
        <h4>Patient Data</h4>
        <p>Please admit the following test patients into your hospital's patient admissions system (or a test environment).</p>
        <p>Populate any other mandatory fields with appropriate self-generated information. When you are done, click <strong>Next</strong> to continue.</p>

        <div v-if="patients">
          <table id="test-patients" class="table table-striped">
            <thead>
            <tr>
              <th>Name</th>
              <th>Date of Birth</th>
              <th>Gender</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="patient in patients.patientList">
              <td>
                {{patient.first_name}} {{patient.surname}}
              </td>
              <td>
                {{patient.dob}}
              </td>
              <td>
                {{patient.gender}}
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="form-group footer" align="center">
      <div class="buttons">
        <p>When all of the patients have been admitted to your ePrescription System, click <strong>Next</strong>.</p>
        <button type="button" class="exit-btn btn btn-primary"  id="exit-button" @click="onExitClick()">Exit</button>
        <button type="button" class="next-btn btn btn-primary"  id="next-button" @click="onNextClick()">Next</button>
      </div>
    </div>

  </div>

  <AppLogo></AppLogo>
</div>
</template>

<script>

    import { dataService } from '../services/data.service';
    import  AppPatients from './AppPatients';
    import AppLogo from "./AppLogo";
    import  TabHeader from './TabHeader';
    import {patientService} from "../services/patient.service";

    export default {
        name: "AssessmentPatients",
        components: {
            TabHeader,
            AppLogo
        },
        computed: {
            user() {
                return this.$store.state.authentication.user;
            },
            patients() {
              return this.$store.state.patientList;
            }

        },
        data() {
            return {
                submitted: false,
                assessment: {
                    time_taken: ''
                },
                startTime: '',
                myPatientList: []
            }
        },
        methods: {
            resetForm: function () {
                this.$data.assessment = {};
                this.errors.clear();
            },
            onExitClick() {
                this.$router.push('/logout');
            },
            onNextClick()  {
                this.submitted = true;

                this.$validator.validate().then(valid => {
                    if (valid) {

                        let endTime = new Date();
                        let elapsedTime = endTime.getTime() - this.startTime.getTime();
                        this.assessment.time_taken = elapsedTime/1000;
                        const time_taken = this.assessment.time_taken;
                        const { dispatch } = this.$store;
                        if (time_taken){
                            dispatch('saveCreatePatientData', { time_taken });
                        }

                        // audit
                        dataService.audit('Add patient list', '/assessmentpatients');
                    }
                });
            },
            getPatients() {
               return this.patients;
            },
            savePatientIds() {

                 // use computed value of patients
                let patients = this.patients;
                let patient_list = '';

                for(let index in patients.patientList){
                  if(patients.patientList.hasOwnProperty(index)){
                    patient_list += patients.patientList[index].id + ',';
                  }
                }
                dataService.savePatientList(patient_list);
                dataService.audit('save patient list', '/assessmentpatients');
            }
        },
        created : function() {
            this.startTime = new Date();
        },
        mounted() {
          setTimeout(() => {
              this.savePatientIds();
          }, 1000)
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

  h4 {
    font-weight: bold;
    text-align: left;
    padding-top: 25px;
  }

  .patient-info p {
    text-align: left;
  }

  .assessment {
    padding-bottom: 20px;
  }

  .assessment p {
    text-align: left;
  }

  input {
    width: 200px;
    margin-right: 35px;
    float: right;
  }

  select {
    width: 200px;
    margin-right: 35px;
    float: right;
  }


  #patient-intervention {
    width: 100%;
    height: 100px;
  }

  button {
    height: 40px;
    width: 100px;
    font-size: 1.2em;
    margin: 0 50px;
  }

  .exit-btn, .next-btn {
    background-color: #029a99;
    border: 0;
  }

  .footer {
    margin-top: 10px;
    margin-bottom: 40px;
  }

  .footer p {
    padding-bottom: 10px;
  }

  .alert-warning {
    background-color: #f6ecb8;
    border-color: #ffd47d;
  }


</style>
