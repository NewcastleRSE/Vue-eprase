<template>
  <!-- Profile tab -->
  <div class="tab-pane fade active show mt-2" :id="'patient-' + patient.patient_code + '-profile'" role="tabpanel" tabindex="0">
    <div v-if="!dataLoaded" class="d-flex justify-content-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading Profile...</span>
      </div>
    </div>
    <div v-if="dataLoaded">
      <div class="d-flex">
        <div class="p-2">
          <img v-show="patient.is_adult && patient.gender == 'Male'" class="img-thumbnail" style="width: 150px; height: 150px" src="../../assets/images/anon-male.png" alt="Adult male patient" />
          <img v-show="patient.is_adult && patient.gender == 'Female'" class="img-thumbnail" style="width: 150px; height: 150px" src="../../assets/images/anon-female.png" alt="Adult female patient" />
          <img v-show="isBaby(patient)" class="img-thumbnail" style="width: 150px; height: 150px" src="../../assets/images/baby.png" alt="Baby patient" />
          <img v-show="!isBaby(patient) && !patient.is_adult && patient.gender == 'Male'" class="img-thumbnail" style="width: 150px; height: 150px" src="../../assets/images/anon-child-boy.png" alt="Male paediatric patient" />
          <img v-show="!isBaby(patient) && !patient.is_adult && patient.gender == 'Female'" class="img-thumbnail" style="width: 150px; height: 150px" src="../../assets/images/anon-child-girl.png" alt="Female paediatric patient" />                                               
        </div>
        <div class="p-2 flex-grow-1">
          <table class="table table-striped">
            <tbody>
              <tr><th>First name</th><td>{{  patient.first_name }}</td></tr>
              <tr><th>Surname</th><td>{{  patient.surname }}</td></tr>
              <tr><th>DOB</th><td>{{ patient.dob ? new Date(patient.dob).toLocaleDateString('en-GB') : 'Not specified' }}</td></tr>
              <tr><th>{{ formatAgeCaption(patient) }}</th><td>{{ formatAge(patient) }}</td></tr>                            
              <tr><th>Gender</th><td>{{ patient.gender }}</td></tr>
              <tr><th>Height (cm)</th><td>{{ patient.height }}</td></tr>
              <tr><th>Weight (kg)</th><td>{{ patient.weight }}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>                    
  </div>
</template>

<script>

import { patientIsBaby, patientAgeString, patientAgeCaption } from '../../helpers/common';

export default {
  name: 'PatientProfile',
  props: {
    patient: {
      type: Object,
      required: true
    },
    dataLoaded: {
      type: Boolean,
      default: false
    }
  },
  computerd: {

  },
  methods: {
    isBaby(patient) {
      return patientIsBaby(patient)
    },    
    formatAge(patient) {
      return patientAgeString(patient)
    },
    formatAgeCaption(patient) {
      return patientAgeCaption(patient, true)
    }
  }
}
</script>

<style scoped></style>
