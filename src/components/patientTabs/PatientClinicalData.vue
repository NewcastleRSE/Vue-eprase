<template>
  <!-- Clinical data tab -->
  <div class="tab-pane fade mt-2" :id="'patient-' + patient.patient_code + '-clinical_data'" role="tabpanel" tabindex="0">
    <div v-if="!dataLoaded" class="d-flex justify-content-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading Clinical Data...</span>
      </div>
    </div>
    <div v-if="dataLoaded">
      <p v-if="patientClinicalData.length == 0">No clinical data</p>
      <table class="table table-striped" v-if="patientClinicalData.length != 0">
        <tbody>                         
          <tr v-for="clinicalData in patientClinicalData">
            <td>{{ clinicalData.clinical_datum }}</td>
          </tr>  
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>

export default {
  name: 'PatientClinicalData',
  props: {
    patient: {
      type: Object,
      required: true
    },
    patientClinicalData: {
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
