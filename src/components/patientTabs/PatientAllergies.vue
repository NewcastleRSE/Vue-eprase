<template>
  <!-- Allergies tab -->
  <div class="tab-pane fade mt-2" :id="'patient-' + patient.patient_code + '-allergy'" role="tabpanel" tabindex="0">
    <div v-if="!dataLoaded" class="d-flex justify-content-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading Allergies...</span>
      </div>
    </div>
    <div v-if="dataLoaded">
      <p v-if="patientAllergies.length == 0">No allergies</p>
      <table class="table table-striped" v-if="patientAllergies.length != 0">
        <tbody>
          <tr v-for="allergy in patientAllergies">
            <td>{{  allergy.allergy }}</td>
          </tr>                         
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>

export default {
  name: 'PatientAllergies',
  props: {
    patient: {
      type: Object,
      required: true
    },
    patientAllergies: {
      type: Array,
      default: []
    },
    dataLoaded: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped></style>
