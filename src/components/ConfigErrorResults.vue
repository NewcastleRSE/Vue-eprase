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
                <tr v-for="cErrData in report.configErrorDataList"
                  :class="cErrData.result == cErrData.good_answer ? 'table-success' : (cErrData.result == !cErrData.good_answer ? 'table-danger' : 'table-secondary')">
                  <td>{{ cErrData.question }}</td>
                  <td v-if="cErrData.result == cErrData.good_answer"><i class="bi bi-check-circle text-success fw-bold"></i></td>
                  <td v-if="cErrData.result == !cErrData.good_answer"><i class="bi bi-x-circle text-danger fw-bold"></i></td>
                  <td v-if="cErrData.result == 2"><i class="bi bi-ban text-secondary fw-bold"></i></td>
                </tr>
              </table>
            </td>

            <!-- <td class="align-content-center">
              <span>{{ report.configErrorDataList[0].result === 0 ? "N" : "Y" }}</span>
            </td>

            <td class="align-content-center">
              <img v-if="report.configErrorDataList[0].result === 0" src="../assets/images/green-tick.png" alt="tick"
                class="smallimg" />
              <img v-show="report.configErrorDataList[0].result === 1" src="../assets/images/cross.png" alt="cross"
                class="smallimg" />
            </td>

            <td class="align-content-center">
              <span>{{ report.configErrorDataList[1].result === 0 ? "N" : "Y" }}</span>
            </td>

            <td class="align-content-center">
              <img v-if="report.configErrorDataList[1].result === 0" src="../assets/images/green-tick.png" alt="tick"
                class="smallimg" />
              <img v-if="report.configErrorDataList[1].result === 1" src="../assets/images/cross.png" alt="cross"
                class="smallimg" />
            </td> -->
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
