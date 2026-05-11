<template>
  <!-- Presenting complaints tab -->
  <div class="tab-pane fade mt-2" :id="'patient-' + patient.patient_code + '-diagnosis'" role="tabpanel" tabindex="0">
    <div v-if="!dataLoaded" class="d-flex justify-content-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading Presenting Complaints...</span>
      </div>
    </div>
    <div v-if="dataLoaded">
      <p v-if="patientPresentingComplaints.length == 0">No presenting complaints</p>
      <table class="table table-striped" v-if="patientPresentingComplaints.length != 0">
        <tbody>
          <tr v-for="complaint in patientPresentingComplaints">
            <td>{{ complaint.diagnosis }}</td>
          </tr>  
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>

export default {
  name: 'PatientPresentingComplaints',
  props: {
    patient: {
      type: Object,
      required: true
    },
    patientPresentingComplaints: {
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
