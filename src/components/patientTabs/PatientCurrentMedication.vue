<template>
  <!-- Current medication tab -->
  <div class="tab-pane fade mt-2" :id="'patient-' + patient.patient_code + '-prescription'" role="tabpanel" tabindex="0">
    <div v-if="!dataLoaded" class="d-flex justify-content-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading Current Medication...</span>
      </div>
    </div>
    <div v-if="dataLoaded">
      <p v-if="patientCurrentMedication.length == 0">No current medication</p>
      <table class="table table-striped" v-if="patientCurrentMedication.length != 0">
        <tbody>
          <tr>
            <th>Name</th>
            <th>Dose</th>
            <th>Route</th>
            <th>Frequency</th>
            <th>Duration</th>
            <th>Indication</th>
          </tr>
          <tr v-for="prescription in patientCurrentMedication">
            <td>{{ prescription.name }}</td>
            <td>{{ prescription.dose }}</td>
            <td>{{ prescription.route }}</td>
            <td>{{ prescription.frequency }}</td>
            <td>{{ prescription.duration }}</td>
            <td>{{ prescription.justification }}</td>
          </tr>  
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>

export default {
  name: 'PatientCurrentMedication',
  props: {
    patient: {
      type: Object,
      required: true
    },
    patientCurrentMedication: {
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
