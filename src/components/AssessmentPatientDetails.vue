<template>
 <div id="page">

   <TabHeader system-opacity="1.0" patient-opacity="0.5" scenario-opacity="0.2" report-opacity="0.2"></TabHeader>

    <div id="content">
      <h3>Patient Information</h3>
      <p>Please enter the following patient information into your EP system.</p>
      <p>Prescribe any medication listed below using your usual prescribing process. Populate any other mandatory fields with appropriate self-generated information.</p>
      <p>When you are done, click <strong>Next</strong> to continue.</p>
      <br/>

      <div v-for="patient in myPatientList">

        <div align="center" class="card">
          <div class="card-header">
            <h4>{{patient[getCurrentPatient].first_name}} {{patient[getCurrentPatient].surname}}</h4>
            <span class="patient-image" v-if="patient[getCurrentPatient].gender == 'male'">
              <img src="../assets/anon-male.png" height="80px" />
            </span>

            <span class="patient-image" v-if="patient[getCurrentPatient].gender == 'female'">
              <img src="../assets/anon-female.png" height="80px" />
            </span>
            <p class="subtitle">(Patient {{getCurrentPatient+1}} of {{ numPatients }})</p>
          </div>


          <div class="card-body">

            <div class="left=col">

              <div class="patient-demographics">
                <h5 class="card-title">Demographics</h5>
                <table>
                  <tr>
                    <td><strong>Height (m):</strong> {{patient[getCurrentPatient].height}}</td>
                  </tr>
                  <tr>
                    <td><strong>Weight (kg):</strong> {{patient[getCurrentPatient].weight}}</td>
                  </tr>
                </table>
              </div>

              <div class="patient-info">

                <div align="left" v-if="patient[getCurrentPatient].allergies.length !== 0">
                  <h5 class="card-title">Allergies</h5>
                  <table>
                    <tr v-for="allergy in patient[0].allergies">
                      <td>{{allergy}}</td>
                    </tr>
                  </table>
                </div>

                <div align="left" v-if="patient[getCurrentPatient].allergies.length == 0">
                  <h5 class="card-title">Allergies</h5>
                  <table>
                    <tr>
                      <td>No Known Drug Allergies</td>
                    </tr>
                  </table>
                </div>

                <div align="left" v-if="patient[getCurrentPatient].diagnosis.length != 0">
                  <h5 class="card-title">Diagnosis</h5>
                  <table>
                    <tr v-for="diagnosis in patient[0].diagnosis">
                      <td>{{diagnosis}}</td>
                    </tr>
                  </table>
                </div>

                <div align="left"  v-if="patient[getCurrentPatient].medication_history.length != 0">
                  <h5 class="card-title">Current Medication</h5>
                  <table>
                    <tr>
                      <td><strong>Name</strong></td>
                      <td><strong>Dose</strong></td>
                      <td><strong>Route</strong></td>
                      <td><strong>Form</strong></td>
                      <td><strong>Frequency</strong></td>
                    </tr>
                    <tr v-for="history in patient[getCurrentPatient].medication_history">
                      <td>{{history.name}}</td>
                      <td>{{history.dose}} {{history.units}}</td>
                      <td>{{history.route}}</td>
                      <td>{{history.form}}</td>
                      <td>{{history.frequency}}</td>
                    </tr>
                  </table>
                </div>

            </div>
           </div>

            <div class="right-col">

              <div class="clinical-data " v-if="patient[getCurrentPatient].clinical_data.length != 0">
                <h5 class="card-title">Clinical Data</h5>
                <table>
                  <tr>
                    <td><strong>Investigation</strong></td>
                    <td><strong>Value</strong></td>
                  </tr>
                  <tr v-for="clinical in patient[getCurrentPatient].clinical_data">
                    <td>{{clinical.investigation}}</td>
                    <td>{{clinical.value}}</td>
                  </tr>
                </table>
              </div>
              <input type="hidden" id="patient_id" v-model="assessment.patient_id=patient[getCurrentPatient].id" />
            </div>


          </div>
        </div>

      <div class="assessment">
        <p>Note any intervention from the system using the box below.</p>
        <div align="center">
          <div class="alert alert-warning" role="alert">
            To optimise the use of this tool please record ALL types of guidance that appears on your system screen
          </div>
          <textarea type="text" class="form-control" name="input" id="patient-intervention" v-model="assessment.qualitative_data" placeholder="Enter notes here..." maxlength="500"></textarea>
        </div>
      </div>
      <div class="form-group footer" align="center">
        <div class="buttons">
          <p>When the patient has been admitted to the ePrescription System, click <strong>Next</strong>.</p>
          <button id="exit-button" type="button" class="exit-btn btn btn-primary" @click="onExitClick()">Exit</button>
          <button v-show='nextEnabled' id="next-button" type="button" class="pat-btn btn btn-primary" @click="onNextClick()">Next</button>
          <button v-show='doneEnabled' id="done-button" type="button" class="pat-btn btn btn-primary" @click="onDoneClick()">Done</button>
        </div>
      </div>
    </div>
    </div>

 </div>
</template>

<script>

    import { dataService } from '../services/data.service';
    import { patientService } from '../services/patient.service';
    import  TabHeader from './TabHeader';

    export default {
        name: "AssessmentPatientDetails",
        components: {
            TabHeader
        },
        computed: {
            myPatientList() {
              return this.$store.state.patientList;
            },
            getCurrentPatient() {
                return this.$store.state.patientIndex;
            },
            user() {
                return this.$store.state.authentication.user;
            }
        },
        data() {
            return {
                submitted: false,
                assessment: {
                    currentPart: dataService.getAssessmentPart(),
                    patient_id : '',
                    qualitative_data : '',
                    time_taken: ''
                },
                startTime: '',
                nextEnabled: true,
                doneEnabled: false,
                completed : false,
                numPatients: patientService.getNumPatients()
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
                this.saveData();
                this.$router.push('/assessmentpatientdetails');
            },
            onDoneClick() {
                const unlockTime = new Date();
                unlockTime.setHours(unlockTime.getHours() + 1);
                localStorage.setItem('assessmentUnlockTime', unlockTime.toISOString());

                // this is now true
                this.completed = true;

                // save the last patient data
                this.saveData();

                // audit
                dataService.audit('Completed patient details', '/assessmentpatientdetails');

                this.$router.push('/lockoutscreen');
            },
            saveData() {
                this.$validator.validate().then(valid => {
                    if (valid) {

                        let index = this.$store.state.patientIndex;
                        let endTime = new Date();
                        let elapsedTime = endTime.getTime() - this.startTime.getTime();
                        this.assessment.time_taken = elapsedTime / 1000;
                        const qualitative_data = this.assessment.qualitative_data;
                        const patient_id = this.assessment.patient_id;
                        const time_taken = this.assessment.time_taken;
                        const completed = this.completed;

                        const {dispatch} = this.$store;
                        if (time_taken) {
                            dispatch('savePart3Data', {qualitative_data, patient_id, time_taken, index, completed});
                        }
                        this.submitted = true;
                        this.assessment.qualitative_data = '';
                    }
                });
            }
        },
        created : function() {
            this.startTime = new Date();
        },
        beforeUpdate: function() {
            let index = this.$store.state.patientIndex;
            if (index === (this.numPatients - 1)) {
                this.nextEnabled = false;
                this.doneEnabled = true;
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

  h4 {
    font-weight: bold;
  }

  .patient-info {
    padding-left: 20px;
    padding-bottom: 20px;
  }

  .subtitle {
    text-align: center;
  }

  .patient-info p {
    text-align: left;
  }

  .assessment {
    padding-bottom: 20px;
  }

  table {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 1px solid #c2c2c2;
    border-collapse: collapse;
 /*   background-color: rgba(2, 255, 254, 0.09); */

    background-color: #fff;
  }

  td {
    width: auto;
    font-size: 14px;
    border: 1px solid #c2c2c2;
  }

  .patient-image {
    position: absolute;
    top: 0;
    right: 0;
    padding: 10px;
  }

  .card {
    margin-bottom: 20px;
  }

  .card-body {
    display: grid;
    grid-template-columns: auto auto;
    background-color: rgba(170, 231, 255, 0.11);
  }

  .patient-demographics {
    text-align: left;
    padding-left: 20px;
  }

  .patient-demographics table,  .clinical-data table {
    width: 200px;
    padding-left: 20px;
    padding-bottom: 0;
  }

  .patient-demographics table td{
    width: auto;
    font-size: 14px;
    padding: 10px;
  }

  .clinical-data table td,  .patient-info td  {
    width: auto;
    font-size: 14px;
    padding: 5px;
  }

  .patient-info table {
    text-align: left;
    width: auto;
  }

  .right-col {
    text-align: left;
  }

  #patient-intervention {
    width: 100%;
    height: 100px;
  }

  .card-header {
      position:relative;
  }

  button {
    height: 40px;
    width: 100px;
    font-size: 1.2em;
    margin: 0 50px;
  }

  #done-button {
    margin-left: 120px;
    background-color: #029a99;
  }

  #done-button :hover {
    background-color: #07818e;
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

  .exit-btn, .pat-btn {
    background-color: #029a99;
    border: 0;
  }


</style>
