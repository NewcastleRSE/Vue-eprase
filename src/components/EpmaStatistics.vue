<template>
  <div class="epma-stats-content">
    <div v-if="loading">Loading report data...</div>
    <div v-if="!loading">

      <h4>EPMA Statistics</h4>

      <div v-if="epma_stats.length === 0">
        <p>You currently have no statistics available</p>
      </div>

      <div v-if="epma_stats.length > 0">

        <table class="table table-striped">
          <caption>Statistics per institution</caption>
          <thead>
            <tr>
              <th>Institution Name</th>
              <th>Ep System</th>
              <th class="ep-usage align-content-center">EP Usage</th>
              <th class="align-content-center">Additional EP System</th>
              <th class="align-content-center">Lab Results<br><span class="smaller">(manually enter lab results)</span>
              </th>
              <th class="align-content-center">Medical History<br><span class="smaller">(enter diagnosis or
                  comorbidities)</span></th>
              <th class="align-content-center">High Risk Meds Coverage</th>
              <th class="align-content-center">High Risk Areas</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="report in epma_stats">
              <td class="align-content-center">{{ report.institution.orgName }}</td>
              <td class="align-content-center"><span v-if="report.system.ep_service !== 'Other'">{{
      report.system.ep_service }} </span>
                <span v-if="report.system.other_ep_system">{{ report.system.other_ep_system }}</span>
              </td>
              <td class="align-content-center">{{ report.system.ep_usage }}%</td>
              <td class="align-content-center">{{ report.system.add_ep_system }}</td>
              <td class="align-content-center"><span>{{ report.system.lab_results ? 'Y' : 'N' }} {{
      report.system.man_results ? '(Y)' : '(N)' }}</span></td>
              <td class="align-content-center">{{ report.system.med_history ? 'Y' : 'N' }} {{
      report.system.diagnosis_results ? '(Y)' : '(N)' }}</td>
              <td class="align-content-center">{{ report.system.high_risk_meds }}% </td>
              <td class="align-content-center">
                <ul class="list-group list-group-numbered">
                  <li class="list-group-item" v-for="area in report.system.clinical_areas">{{ area }}</li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script>

export default {
  name: "EpmaStatistics",
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
  data() {
    return {
      epma_stats: []
    }
  },
  methods: {
    assembleStats() {
      this.epma_stats = this.reports.map(r => {
        r.system.high_risk_meds = this.calcMeds(r.system.high_risk_meds)
        r.system.clinical_areas = this.findHighRiskAreas(r.system.clinical_areas)
        return r
      })
      console.log(this.epma_stats)
    },
    calcMeds(meds) {
      return meds ? meds.split(',').length * 0.1 : 0
    },
    findHighRiskAreas(clinical_areas) {
      return clinical_areas ? clinical_areas.split(',').filter(ca => ca === 'ACC' || ca === 'PCC' || ca === 'A&E') : []
    }
  }
}
</script>

<style scoped></style>
