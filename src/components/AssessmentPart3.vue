<template>
 <div id="page">
   <Header />
    <div id="content">
      <h1>ePRaSE Assessment</h1>
      <h3>Part 3 - Patient Information</h3>
      <p>Please enter the following patient information into your EP system.</p>
      <p>Prescribe any medication listed below using your usual prescribing process. Populate any other mandatory fields with appropriate self-generated information.</p>
      <p>When you are done, click <strong>Next</strong> to continue.</p>
      <br/>

      <div v-for="patient in myPatientList">

        <div align="center">
          <h4>{{patient[getCurrentPatient].first_name}} {{patient[getCurrentPatient].surname}}</h4>
          <p class="subtitle">(Patient {{getCurrentPatient+1}} of {{ numPatients }})</p>

          <div id="patient-card">
            <div class="patient-image" v-if="patient[getCurrentPatient].gender == 'male'">
              <img src="../assets/anon-male.png" height="160px" />
            </div>

            <div class="patient-image" v-if="patient[getCurrentPatient].gender == 'female'">
              <img src="../assets/anon-female.png" height="160px" />
            </div>
            <div class="patient-demographics">
              <p><strong>Demographics:</strong></p>
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
                <p><strong>Allergies:</strong></p>
                <table>
                  <tr v-for="allergy in patient[0].allergies">
                    <td>{{allergy}}</td>
                  </tr>
                </table>
              </div>

              <div align="left" v-if="patient[getCurrentPatient].allergies.length == 0">
                <p><strong>Allergies:</strong></p>
                <table>
                  <tr>
                    <td>No Known Drug Allergies</td>
                  </tr>
                </table>
              </div>

              <div align="left" v-if="patient[getCurrentPatient].diagnosis.length != 0">
                <p><strong>Diagnosis:</strong></p>
                <table>
                  <tr v-for="diagnosis in patient[0].diagnosis">
                    <td>{{diagnosis}}</td>
                  </tr>
                </table>
              </div>

              <div align="left"  v-if="patient[getCurrentPatient].medication_history.length != 0">
                <p><strong>Current Medication:</strong></p>
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

              <div align="left"  v-if="patient[getCurrentPatient].clinical_data.length != 0">
                <p><strong>Clinical Data:</strong></p>
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
            To optimise the use of this tool please record ALL types of guidance that appears on your system screen in the comments boxes provided
          </div>
          <textarea type="text" class="form-control" name="input" id="patient-intervention" v-model="assessment.qualitative_data" placeholder="Enter notes here..." maxlength="250"></textarea>
        </div>
      </div>
      <div class="form-group footer" align="center">
        <div class="buttons">
          <p>When the patient has been admitted to the ePrescription System, click <strong>Next</strong>.</p>
          <button id="exit-button" type="button" class="btn btn-primary" @click="onExitClick()">Exit</button>
          <button v-show='nextEnabled' id="next-button" type="button" class="btn btn-primary" @click="onNextClick()">Next</button>
          <button v-show='doneEnabled' id="done-button" type="button" class="btn btn-primary" @click="onDoneClick()">Done</button>
        </div>
      </div>
    </div>
    </div>

 </div>
</template>

<script>

    import Header from './Header';
    import { dataService } from '../services/data.service';
    import { patientService } from '../services/patient.service';

    export default {
        name: "AssessmentPart3",
        components: {
            Header
        },
        computed: {
            myPatientList() {
              return this.$store.state.patientList;
            },
            getCurrentPatient() {
                return this.$store.state.patientIndex;
            },
            getCurrentTest() {
                return this.$store.state.testIndex;
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
                numPatients: patientService.getNumPatients()
            }
        },
        methods: {
            resetForm: function () {
                this.$data.assessment = {};
                this.errors.clear();
            },
            onExitClick() {
                window.location.href = './logout'
            },
            onNextClick()  {
                this.submitted = true;

                let index = this.$store.state.patientIndex;

                this.$validator.validate().then(valid => {
                    if (valid) {

                        let endTime = new Date();
                        let elapsedTime = endTime.getTime() - this.startTime.getTime();
                        this.assessment.time_taken = elapsedTime/1000;
                        const qualitative_data = this.assessment.qualitative_data;
                        const patient_id = this.assessment.patient_id;
                        const time_taken = this.assessment.time_taken;
;
                        const { dispatch } = this.$store;
                        if (time_taken){
                            dispatch('authentication/savePart3Data', { qualitative_data, patient_id, time_taken, index });
                        }
                        this.assessment.qualitative_data = '';
                    }
                });

                // if last patient, change button from 'next' to 'done'
                if (index === (this.numPatients - 1)) {
                    this.nextEnabled = false;
                    this.doneEnabled = true;
                }
            },
            onDoneClick() {

                const unlockTime = new Date();
                unlockTime.setHours(unlockTime.getHours() + 1);
                localStorage.setItem('assessmentUnlockTime', unlockTime.toISOString());
                this.$router.push('/lockoutscreen');
            }
        },
        created : function() {
            this.startTime = new Date();
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

  .subtitle-grey {
    text-align: center;
    color: darkgrey;
  }

  .patient-demographics {
    padding-left: 20px;
    padding-bottom: 0px;
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
    width: 900px;
    background-color: #ffffff;
  }


  td {
    width: auto;
    font-size: 14px;
  }

  .patient-image {
    float: right;
    padding: 40px;
  }

  .patient-image img {
    border: 1px solid grey;
  }

  .patient-demographics {
    text-align: left;
  }

  .patient-demographics table
  {
    margin-left: 30px;
    width: 200px;
    border: solid grey 1px;
  }

  .patient-demographics table td {
    width: auto;
    font-size: 14px;
    padding: 10px;
    border: solid grey 1px;
  }

  .patient-info table
  {
    text-align: left;
    width: auto;
    margin-left: 30px;
  }

  .patient-info td
  {
    width: auto;
    border: solid grey 1px;
    padding: 2px 10px;
    font-size: 14px;
  }


  #patient-intervention {
    width: 600px;
    height: 100px;
  }

  #patient-card {
    width: 900px;
    background-color: #cdf8ff;
    padding: 5px;
    border:  1px solid #6b9bc7;
    border-radius: 25px;
    margin-bottom: 20px;
    -webkit-box-shadow: 1px 3px 8px -1px #000000;
    box-shadow: 1px 3px 8px -1px #000000;
  }

  button {
    height: 40px;
    width: 100px;
    margin: 10px 0px;
    font-size: 1.2em;
    margin: 0 50px;
  }

  #done-button {
    margin-left: 120px;
    background-color: #07abb8;
    border-color: #07818e;
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



</style>
