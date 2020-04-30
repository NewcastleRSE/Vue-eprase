<template>

  <div>

    <h3>Patients here..</h3>
    {{  patients }}
  </div>

</template>

<script>
    import {patientService} from "../services/patient.service";
    import {dataService} from "../services/data.service";

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

              patientService.setPatientsInStoreFromIds();
          }
          else {
            // set the patient list and test list in store
            patientService.setPatientsInStore(this.patient_type);
          }

          // audit
          dataService.audit('Create patient and test list', '/setpatients/'+ this.patient_type);
          this.$router.push('/assessmentpatients');
        }
    }
</script>

<style scoped>

</style>
