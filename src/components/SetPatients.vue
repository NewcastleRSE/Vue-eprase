<template>

  <div>

    <h3>Patients here..</h3>
    {{  patients }}
  </div>

</template>

<script>
    import {patientService} from "../services/patient.service";
    import {dataService} from "../services/data.service";
    import {settings} from "../settings";
    import axios from "axios";

    export default {
        name: "SetPatients",
        data() {
            return {
              patient_type : ''
            }
        },
        computed: {
            patients() {
              return this.$store.state.patientList;
            }
        },
        created() {

          this.patient_type = this.$route.params.type;

          // if we've jumped over the system stage, look for db values
          if(this.patient_type === undefined){

            let baseURL = settings.baseUrl;
            let token = localStorage.getItem('token');
            this.institution_id = localStorage.getItem('institutionId');

            const requestOptions = {
              method: 'GET',
              headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
            };
            axios.get(baseURL + 'getPatientIds?INSTITUTION_ID=' + this.institution_id, requestOptions)
              .then(response => {

                let data = response.data;
                // empty array if assessment not started
                if(data !== undefined){

                  console.log(data);
                }
              })
              .catch(function (error) {
                console.log('error ' + error);
              });

          }

          // set the patient list and test list in store
         // patientService.setPrescriptionsInStore(patient_type);
          patientService.setPatientsInStore(this.patient_type);
          // audit
          dataService.audit('Create patient and test list', '/setpatients/'+ this.patient_type);
          this.$router.push('/assessmentpatients');
        }
    }
</script>

<style scoped>

</style>
