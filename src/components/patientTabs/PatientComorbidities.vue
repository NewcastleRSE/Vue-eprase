<template>
  <!-- Comorbidities tab -->
  <div class="tab-pane fade mt-2" :id="'patient-' + patient.patient_code + '-comorbidity'" role="tabpanel" tabindex="0">
    <div v-if="!dataLoaded" class="d-flex justify-content-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading Comorbidities...</span>
      </div>
    </div>
    <div v-if="dataLoaded">
      <p v-if="patientComorbidities.length == 0">No comorbidities</p>
      <table class="table table-striped" v-if="patientComorbidities.length != 0">
        <tbody>
          <tr v-for="comorbidity in patientComorbidities">
            <td>{{  comorbidity.comorbidity }}</td>
          </tr>  
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>

export default {
  name: 'PatientComorbidities',
  props: {
    patient: {
      type: Object,
      required: true
    },
    patientComorbidities: {
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
