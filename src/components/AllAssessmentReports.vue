<template>
  <div v-if="loading">Loading report data...</div>
  <div v-if="!loading">

    <nav class="mt-4">
      <ul class="nav nav-tabs nav-fill mb-3" id="progress-report-tab" role="tablist">
        <li class="nav-item" role="presentation" title="Completed institution reports (patient data and scenarios)" data-bs-toggle="tooltip" data-bs-placement="top">
          <a class="nav-link active" data-bs-toggle="tab" href="#view-completed-tab" role="tab">Completed institution reports {{ `(${reports.length})` }}</a>
        </li>
        <li class="nav-item" role="presentation" title="Institution registered only" data-bs-toggle="tooltip" data-bs-placement="top">
          <a class="nav-link" data-bs-toggle="tab" href="#view-no-system-tab" role="tab">Registered only {{`(${getSystemNotComplete.length})` }}</a>
        </li>
        <li class="nav-item" role="presentation" title="System page completed" data-bs-toggle="tooltip" data-bs-placement="top">
          <a class="nav-link" data-bs-toggle="tab" href="#view-system-tab" role="tab">System info complete {{`(${getSystemComplete.length})` }}</a>
        </li>
        <li class="nav-item" role="presentation" title="Patient data entered, working on scenarios" data-bs-toggle="tooltip" data-bs-placement="top">
          <a class="nav-link" data-bs-toggle="tab" href="#view-patient-data-tab" role="tab">Patient data complete {{`(${getPatientDataCreated.length})` }}</a>
        </li>        
      </ul>
    </nav>

    <div class="tab-content">
      <div class="tab-pane fade show active" id="view-completed-tab" role="tabpanel">

        <div v-if="reports.length === 0">
          <p>None currently available.</p>
        </div>

        <div v-if="reports.length != 0">
          <table class="table table-striped mb-4">
            <thead>
              <tr>
                <th>Institution</th>
                <th>Complete date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="report in reports" :key="report" @click="onReportClick(report.assessmentId)"
                data-bs-title="Click on row to view details (in a new tab)" data-bs-placement="top" data-bs-toggle="tooltip"
                style="cursor:pointer">
                <td>{{ report.institution.orgName }}</td>
                <td>{{ report.system.time_created }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="tab-pane fade" id="view-no-system-tab" role="tabpanel">
        <div v-if="getSystemNotComplete.length === 0">
          <p>None currently available.</p>
        </div>

        <div v-if="getSystemNotComplete.length != 0">
          <table class="table table-striped mb-4">        
            <tbody>
              <tr v-for="snc in getSystemNotComplete">
                <td>{{ snc.institution.orgName }}</td>
              </tr>
            </tbody>
          </table> 
        </div>
      </div>
      <div class="tab-pane fade" id="view-system-tab" role="tabpanel">
        <div v-if="getSystemComplete.length === 0">
          <p>None currently available.</p>
        </div>

        <div v-if="getSystemComplete.length != 0">
          <table class="table table-striped mb-4">          
            <tbody>
              <tr v-for="sc in getSystemComplete">
                <td>{{ sc.institution.orgName }}</td>
              </tr>
            </tbody>
          </table> 
        </div>
      </div>
      <div class="tab-pane fade" id="view-patient-data-tab" role="tabpanel">
        <div v-if="getPatientDataCreated.length === 0">
          <p>None currently available.</p>
        </div>

        <div v-if="getPatientDataCreated.length != 0">
          <table class="table table-striped mb-4">          
            <tbody>
              <tr v-for="pdc in getPatientDataCreated">
                <td>{{ pdc.institution.orgName }}</td>
              </tr>
            </tbody>
          </table> 
        </div>
      </div>      
    </div>
  </div>

</template>

<script>

import { rootStore } from '../stores/root'
import { authenticationStore } from '../stores/authentication'
import { mapStores } from 'pinia'
export default {
  name: "AllAssessmentReports",
  props: {
    reports: {
      type: Array
    },
    partialAssessments: {
      type: Array
    },
    loading: true
  },
  computed: {
    ...mapStores(rootStore, authenticationStore),
    getSystemNotComplete() {  // Registered, but not yet completed system page
      return this.partialAssessments.filter(pa => pa.system == null || pa.system.id == null).sort((a, b) => a.institution.orgName.localeCompare(b.institution.orgName))
    },
    getSystemComplete() { // Done system page, but not yet completed patient data
      return this.partialAssessments.filter(pa => pa.system != null && pa.system.id != null && pa.patientDataCreated === false).sort((a, b) => a.institution.orgName.localeCompare(b.institution.orgName))
    },
    getPatientDataCreated() { // Done patient data entry, but not completed scenarios
      return this.partialAssessments.filter(pa => pa.patientDataCreated === true && pa.assessmentComplete === false).sort((a, b) => a.institution.orgName.localeCompare(b.institution.orgName))
    }
  },
  methods: {
    onReportClick(assessmentId) {
      window.open('/assessmentresults?ID=' + assessmentId, '_blank')
    }
  }
}
</script>

<style scoped></style>
