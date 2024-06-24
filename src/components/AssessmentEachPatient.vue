<template>

  <div> {{ patientData }} {{ quote }}</div>

<!--- <div class="mx-auto card" v-if="myPatient">
  <div class="card-header">
    <h4>{{patient.first_name}} {{patient.surname}}</h4>
    <span class="patient-image" v-if="patient.gender === 'male' && patient.is_adult === true">
      <img src="../assets/images/anon-male.png" height="80px" />
    </span>

    <span class="patient-image" v-if="patient.gender === 'female' && patient.is_adult === true">
      <img src="../assets/images/anon-female.png" height="80px" />
    </span>

    <span class="patient-image" v-if="!patient.is_adult">
      <img src="../assets/images/child.png" height="80px" />
    </span>
    <p class="subtitle">(Patient 0 +1 of {{ myNumPatients }})</p>
  </div>

  <div class="card-body">

    <div class="left-col">

      <div class="patient-demographics">
        <h5 class="card-title">Demographics</h5>
        <table>
          <tr v-if="patient.height === 0">
            <td><span class="fw-bold">Height (m):</span> unavailable</td>
          </tr>
          <tr v-if="patient.height !== 0">
            <td><span class="fw-bold">Height (m):</span> {{patient.height}}</td>
          </tr>
          <tr v-if="patient.weight === 0">
            <td><span class="fw-bold">Weight (kg):</span> unavailable</td>
          </tr>
          <tr v-if="patient.weight !== 0">
            <td><span class="fw-bold">Weight (kg):</span> {{patient.weight}}</td>
          </tr>
        </table>
      </div>

      <div class="patient-info">

       <div align="left" v-if="patient.allergy.length !== 0">
          <h5 class="card-title">Allergies</h5>
          <table>
            <tr v-for="allergy in patient.allergy" v-bind:key="allergy">
              <td>{{allergy}}</td>
            </tr>
          </table>
        </div>

        <div align="left" v-if="patient.allergy.length == 0">
          <h5 class="card-title">Allergies</h5>
          <table>
            <tr>
              <td>No Known Drug Allergies</td>
            </tr>
          </table>
        </div>


        <div align="left"  v-if="patient.medication_histories.length != 0">
          <h5 class="card-title">Current Medication</h5>
          <table>
            <tr>
              <td><span class="fw-bold">Name</span></td>
              <td><span class="fw-bold">Dose</span></td>
              <td><span class="fw-bold">Route</span></td>
              <td><span class="fw-bold">Form</span></td>
              <td><span class="fw-bold">Frequency</span></td>
            </tr>
            <tr v-for="history in patient.medication_histories" v-bind:key="history">
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

      <div class="clinical-data" v-if="patient.clinical_data.length != 0">
        <h5 class="card-title">Clinical Data</h5>
        <table>
          <tr>
            <td><span class="fw-bold">Investigation</span></td>
            <td><span class="fw-bold">Value</span></td>
            <td><span class="fw-bold">Unit</span></td>
          </tr>
          <tr v-for="clinical in patient.clinical_data" v-bind:key="clinical">
            <td>{{clinical.investigation}}</td>
            <td>{{clinical.value}}</td>
            <td>{{ clinical.unit }}</td>
          </tr>
        </table>
      </div>

      <div class="clinical-data" align="left" v-if="patient.diagnosis.length != 0">
        <h5 class="card-title">Presenting Complaint</h5>
        <table>
          <tr v-for="diagnosis in patient.diagnosis" v-bind:key="diagnosis">
            <td>{{diagnosis}}</td>
          </tr>
        </table>
      </div>

      <div class="clinical-data" align="left" v-if="patient.comorbidity.length != 0">
        <h5 class="card-title">Comorbidities</h5>
        <table>
          <tr v-for="comorbidity in patient.comorbidity" v-bind:key="comorbidity">
            <td>{{comorbidity}}</td>
          </tr>
        </table>
      </div>

      <input type="hidden" id="patient_id" :value="patient.code" />
    </div>

  </div>
 </div> -->

</template>
<script>
import { stringify } from 'querystring';


export default {
  name: "AssessmentEachPatient",
  props: {    
    patientData: { type: Object, default: () => {} }, 
    index: { type: Number, default: 0 },
    numPatients: { type: Number, default: 0 } ,
    quote: { type: String, default: "I don't have parent data" },              
  },
  computed: {
   
  },
  methods: {
  
  },
  mounted() {
     console.log(this.patientData);
     console.log(this.index); 
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
