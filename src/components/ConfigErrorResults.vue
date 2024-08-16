<template>
  <div class="config-error-result-content">
    <h4>Configuration Error Results</h4>

    <div v-if="reports.length === 0">
      <p>You currently have no reports available</p>
    </div>

    <div v-if="!loading && reports.length != 0">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Institution Name</th>
            <th>Ep System</th>
            <th>Configuration error results</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="report in reports">
            <td>{{ report.institution.orgName }}</td>
            <td>
              <span v-if="report.system.ep_service !== 'Other'">{{ report.system.ep_service }}
              </span>
              <span v-if="report.system.other_ep_system">{{
                report.system.other_ep_system
                }}</span>
            </td>
            <td>
              <table class="table">
                <tr>
                  <th>Question</th>
                  <th>Result</th>
                </tr>
                <tr v-for="cErrData in report.configErrorDataList">
                  <td>{{ cErrData.question }}</td>
                  <td v-if="cErrData.result == 2" class="d-flex align-items-baseline">
                    <h5 class="text-secondary bg-secondary-subtle fw-bolder"><i class="bi bi-ban"></i></h5>                    
                  </td>
                  <td v-if="cErrData.result == cErrData.good_answer" class="d-flex align-items-baseline">
                    <h5 class="text-success bg-success-subtle fw-bolder"><i class="bi bi-check-circle"></i></h5>
                  </td>
                  <td v-if="cErrData.result == !cErrData.good_answer" class="d-flex align-items-baseline">                  
                    <h5 class="text-danger bg-danger-subtle fw-bolder"><i class="bi bi-x-circle"></i></h5>
                  </td>                  
                </tr>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "ConfigErrorResults",
  props: {
    reports: {
      type: Array,
    },
    loading: true
  }
}
</script>

<style scoped></style>
