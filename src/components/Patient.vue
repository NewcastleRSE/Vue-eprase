<template>

</template>

<script>

  export default {
      name: "Patient",
      data() {
          return {
              patient: {
                  id: '',
                  first_name: '',
                  surname: '',
                  age: 0,
                  is_adult: true,
                  dob: '',
                  gender: '',
                  height: 0,
                  weight: 0,
                  allergies: '',
                  diagnosis: '',
              },
              medication_history: {
                  name: '',
                  dose: 0,
                  units: '',
                  route: '',
                  form: '',
                  frequency: ''
              },
              clinical_data: {
                  investigation: '',
                  value: 0
              }
          }
      }
  }
</script>

<style scoped>

</style>
