<template>
  <div>
    <table id="test-patients" class="table table-striped">
      <thead>
        <tr>
          <th>Name</th>
          <th>Date of Birth</th>
          <th>Gender</th>
        </tr>
      </thead>
      <tbody>
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
      </tbody>
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

  .table th, .table td {
    padding: 0.40rem;
  }

  .table {
    margin-bottom: 50px;
  }


</style>
