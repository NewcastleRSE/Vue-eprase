<template>
  <div>
    <table id="test-patients">
      <tr>
        <th>Name</th>
        <th>Date of Birth</th>
        <th>Gender</th>
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
        name: "AppPatients",
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
    width: 100%;
    border: 1px solid #6b9bc7;
  }

  #test-patients th {
    border:  1px solid #7f7d81;
    background-color: #e9e9e9;
    padding: 5px;
  }

  #test-patients td {
    width: 150px;
    font-size: 16px;
    background-color: #f5f5f5;
    padding: 5px;
    border:  1px solid #7f7d81;
  }


</style>
