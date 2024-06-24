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
            <td>{{ report.system.time_created }}</td>
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
  computed: {
    ...mapStores(rootStore, authenticationStore)
  },
  data() {
    return {
      reports: []
    }
  },
  methods: {
    async getReports() {
      const allRepResponse = await rootStore().getAllReports()
      if (allRepResponse.status < 400) {
        this.reports = allRepResponse.data
        this.reports.forEach(rep => {
          rep.system.time_created = this.getFormattedDate(rep.system.time_created)
        })
      } else {
        this.$emit('get-reports-fail', allRepResponse.message)
      }
    },
    onReportClick(assessmentId) {
      const routeData = this.$router.resolve({ path: '/assessmentresults', params: {'ID': assessmentId}})
      window.open(routeData.href, '_blank')
    },
    getFormattedDate(ts) {
      return (new Date(ts * 1000).toLocaleDateString("en-GB").split('/'))[2]
    }
  },
  mounted() {
    this.getReports()
  }
}
</script>

<style scoped></style>
