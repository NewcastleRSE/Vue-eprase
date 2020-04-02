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

            }
        },
        computed: {
            patients() {
              return this.$store.state.patientList;
            }
        },
        created() {

          let patient_type = this.$route.params.type;
          // set the patient list and test list in store
         // patientService.setPrescriptionsInStore(patient_type);
          patientService.setPatientsInStore(patient_type);
          // audit
          dataService.audit('Create patient and test list', '/setpatients/'+ patient_type);
          this.$router.push('/assessmentpatients');
        }
    }
</script>

<style scoped>

</style>
