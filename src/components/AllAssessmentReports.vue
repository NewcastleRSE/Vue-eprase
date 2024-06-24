<template>
  <div>
    <h2>All Institution Reports</h2>

    <div v-if="reports.length === 0">
      <p>You currently have no reports available.</p>
    </div>

    <div v-if="reports.length > 0" class="list-group">
      <div v-for="report in reports" :key="report">
        <div @click="onReportClick(report.assessmentId)"
          class="list-group-item list-group-item-action flex-column align-items-start">
          <span class="fw-bold">{{ report.institution.orgName }} - {{ report.system.time_created }}</span>
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
      allRepResponse = await rootStore().getAllReports()
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
      this.$router.push({ path: './assessmentresults?ID=' + assessmentId })
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
