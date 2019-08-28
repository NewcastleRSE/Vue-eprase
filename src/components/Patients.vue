<template>
  <div>
    <table id="test-patients">
      <tr>
        <td>
          <strong>Name</strong>
        </td>
        <td>
          <strong>Date of Birth</strong>
        </td>
        <td>
          <strong>Gender</strong>
        </td>
      </tr>


    <tr v-for="patient in myPatientList">
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
    </table>
  </div>

</template>

<script>

  import { patientService } from '../services/patient.service';

    export default {
        name: "Patients",
        components: {
        },
        data() {
            return {
                patients : [],
                myPatientList : []
            }
        },
        methods: {
            getPatients() {
                this.patients = patientService.getPatients();
                // format : patientList[0] etc
                for (let i = 0; i < this.patients.patientList.length; i++) {
                    this.myPatientList.push(this.patients.patientList[i])
                }
            }
        },
        created() {
            this.getPatients();

        }
    }
</script>

<style scoped>

  #test-patients {
    padding: 15px;
    margin-top: 20px;
    margin-bottom: 20px;
    width: 600px;
    border: 1px solid #6b9bc7;
  }


  #test-patients td {
    width: 150px;
    font-size: 16px;
    background-color: #cdf8ff;
    padding: 5px;
    border:  1px solid #6b9bc7;
  }


</style>
