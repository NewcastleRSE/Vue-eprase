<template>
  <div v-if="loading">Loading report data...</div>
  <div v-if="!loading">
    <h2>Extreme Risk Comparison Results</h2>

    <div v-if="reports.length === 0">
      <p>You currently have no reports available.</p>
    </div>

    <div v-if="reports.length > 0">
      <table class="table table-striped mb-4">
        <thead>
          <tr>
            <th>Institution Name</th>
            <th>Ep System</th>
            <th>Drug mitigation results</th>
          </tr>
        </thead>
        <tbody>         
          <tr v-for="report in reports" :key="report">
            <td>{{ report.institution.orgName }}</td>
            <td>
              <span v-if="report.system.ep_service !== 'Other'">{{ report.system.ep_service }} </span>
              <span v-if="report.system.other_ep_system">{{ report.system.other_ep_system }}</span>
            </td>
            <td>
              <ul class="list-group list-unstyled">
                <li class="list-group-item" v-for="rd in report.description">{{ rd }}</li>
              </ul>            
            </td>
          </tr>            
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>

export default {
  name: "HighRiskComparison",
  props: {
    reports: {
      type: Array
    },
    loading: true
  },
  watch: {
    loading(newVal) {
      if (newVal === false) {
        console.debug('data has all loaded')
        this.assembleStats()
      }
    }
  },
  methods: {
    assembleStats() {
      this.reports.forEach(r => {
        const extremes = r.prescriptionList.filter(p => p.risk_level === 'Extreme')
        r.description = extremes.map(e => e.prescription.drug_name + ' | ' + e.result)
      })
    }
  }
}
</script>

<style scoped></style>
