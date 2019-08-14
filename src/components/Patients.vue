<template>

  <div>
    {{ patientList.id }}
  </div>

</template>

<script>
    import json from '../json/patients.json'
    import Patient from './Patient'

    export default {
        name: "Patients",
        data() {
            return {
                patients : json,
                patientList : []
            }
        },
        methods: {
            setPatients: function() {

               let i = 0;
               for(i = 0; i < this.patients.length; i++){

                  this.patientList.push(this.patients[i]);
                  console.log(this.patients[i]);
                  // break loop at first patient
                  return this.patientList;
               }
            }
        },
        created: function() {
            this.setPatients();
        }
    }
</script>

<style scoped>

</style>
