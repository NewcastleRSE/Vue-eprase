<template>
  <div>
    <h2>All Institution Reports</h2>

    <div v-if="reports.length === 0">
      <p>You currently have no reports available.</p>
    </div>

    <div v-if="reports.length > 0">
      <table class="table table-striped mb-4">
        <thead>
          <tr>
            <th>Institution</th>
            <th>Year</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="report in reports" :key="report" @click="onReportClick(report.assessmentId)"
            data-bs-title="Click on row to view details (in a new tab)" data-bs-placement="top" data-bs-toggle="tooltip"
            style="cursor:pointer">
            <td>{{ report.institution.orgName }}</td>
            <td>{{ getFormattedDate(report.system.time_created) }}</td>
          </tr>
        </tbody>
      </table>
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
    reports: [],
    loading: true
  },
  computed: {
    ...mapStores(rootStore, authenticationStore)
  },
  methods: {    
    onReportClick(assessmentId) {
      const routeData = this.$router.resolve({ path: '/assessmentresults', params: {'ID': assessmentId}})
      window.open(routeData.href, '_blank')
    },
    getFormattedDate(ts) {
      return (new Date(ts * 1000).toLocaleDateString("en-GB").split('/'))[2]
    }
  }
}
</script>

<style scoped></style>
