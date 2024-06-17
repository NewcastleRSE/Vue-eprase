<template>
  <div class="result-table-content">

    <h4>Results by category and percentage</h4>

    <div class="results-summary">
      <table class="table is-striped">
        <tr>
          <th>Category</th>
          <th>Good mitigation/Pass</th>
          <th>Some mitigation</th>
          <th>Not mitigated</th>
          <th>Over mitigated</th>
        </tr>
        <tr>
          <td>Drug Age ({{ tableData['categories'][0].drugAge.count }})</td>
          <td>{{ calc(tableData['categories'][0].drugAge.good, tableData['categories'][0].drugAge.count) }} <span
              class="success">({{ tableData['categories'][0].drugAge.good }}/{{ tableData['categories'][0].drugAge.count
              }})</span></td>
          <td>{{ calc(tableData['categories'][0].drugAge.some, tableData['categories'][0].drugAge.count) }} <span
              class="warning">({{ tableData['categories'][0].drugAge.some }}/{{ tableData['categories'][0].drugAge.count
              }})</span></td>
          <td>{{ calc(tableData['categories'][0].drugAge.not, tableData['categories'][0].drugAge.count) }} <span
              class="danger">({{ tableData['categories'][0].drugAge.not }}/{{ tableData['categories'][0].drugAge.count
              }})</span></td>
          <td>{{ calc(tableData['categories'][0].drugAge.over, tableData['categories'][0].drugAge.count) }} <span
              class="info">({{ tableData['categories'][0].drugAge.over }}/{{ tableData['categories'][0].drugAge.count
              }})</span></td>
        </tr>
        <tr>
          <td>Drug Dose ({{ tableData['categories'][1].drugDose.count }})</td>
          <td>{{ calc(tableData['categories'][1].drugDose.good, tableData['categories'][1].drugDose.count) }} <span
              class="success">({{ tableData['categories'][1].drugDose.good }}/{{
            tableData['categories'][1].drugDose.count }})</span></td>
          <td>{{ calc(tableData['categories'][1].drugDose.some, tableData['categories'][1].drugDose.count) }} <span
              class="warning">({{ tableData['categories'][1].drugDose.some }}/{{
            tableData['categories'][1].drugDose.count }})</span></td>
          <td>{{ calc(tableData['categories'][1].drugDose.not, tableData['categories'][1].drugDose.count) }} <span
              class="danger">({{ tableData['categories'][1].drugDose.not }}/{{ tableData['categories'][1].drugDose.count
              }})</span></td>
          <td>{{ calc(tableData['categories'][1].drugDose.over, tableData['categories'][1].drugDose.count) }} <span
              class="info">({{ tableData['categories'][1].drugDose.over }}/{{
            tableData['categories'][1].drugDose.count }})</span></td>
        </tr>
        <tr>
          <td>Drug Interaction ({{ tableData['categories'][2].drugInteraction.count }})</td>
          <td>{{ calc(tableData['categories'][2].drugInteraction.good, tableData['categories'][2].drugInteraction.count)
            }} <span class="success">({{ tableData['categories'][2].drugInteraction.good }}/{{
            tableData['categories'][2].drugInteraction.count }})</span></td>
          <td>{{ calc(tableData['categories'][2].drugInteraction.some, tableData['categories'][2].drugInteraction.count)
            }} <span class="warning">({{ tableData['categories'][2].drugInteraction.some }}/{{
            tableData['categories'][2].drugInteraction.count }})</span></td>
          <td>{{ calc(tableData['categories'][2].drugInteraction.not, tableData['categories'][2].drugInteraction.count)
            }} <span class="danger">({{ tableData['categories'][2].drugInteraction.not }}/{{
            tableData['categories'][2].drugInteraction.count }})</span></td>
          <td>{{ calc(tableData['categories'][2].drugInteraction.over, tableData['categories'][2].drugInteraction.count)
            }} <span class="info">({{ tableData['categories'][2].drugInteraction.over }}/{{
            tableData['categories'][2].drugInteraction.count }})</span></td>
        </tr>
        <tr>
          <td>Drug Allergy ({{ tableData['categories'][3].drugAllergy.count }})</td>
          <td>{{ calc(tableData['categories'][3].drugAllergy.good, tableData['categories'][3].drugAllergy.count) }}
            <span class="success">({{ tableData['categories'][3].drugAllergy.good }}/{{
            tableData['categories'][3].drugAllergy.count }})</span></td>
          <td>{{ calc(tableData['categories'][3].drugAllergy.some, tableData['categories'][3].drugAllergy.count) }}
            <span class="warning">({{ tableData['categories'][3].drugAllergy.some }}/{{
            tableData['categories'][3].drugAllergy.count }})</span></td>
          <td>{{ calc(tableData['categories'][3].drugAllergy.not, tableData['categories'][3].drugAllergy.count) }} <span
              class="danger">({{ tableData['categories'][3].drugAllergy.not }}/{{
            tableData['categories'][3].drugAllergy.count }})</span></td>
          <td>{{ calc(tableData['categories'][3].drugAllergy.over, tableData['categories'][3].drugAllergy.count) }}
            <span class="info">({{ tableData['categories'][3].drugAllergy.over }}/{{
            tableData['categories'][3].drugAllergy.count }})</span></td>
        </tr>
        <tr>
          <td>Drug Duplication ({{ tableData['categories'][4].drugDuplication.count }})</td>
          <td>{{ calc(tableData['categories'][4].drugDuplication.good, tableData['categories'][4].drugDuplication.count)
            }} <span class="success">({{ tableData['categories'][4].drugDuplication.good }}/{{
            tableData['categories'][4].drugDuplication.count }})</span> </td>
          <td>{{ calc(tableData['categories'][4].drugDuplication.some, tableData['categories'][4].drugDuplication.count)
            }} <span class="warning">({{ tableData['categories'][4].drugDuplication.some }}/{{
            tableData['categories'][4].drugDuplication.count }})</span></td>
          <td>{{ calc(tableData['categories'][4].drugDuplication.not, tableData['categories'][4].drugDuplication.count)
            }} <span class="danger">({{ tableData['categories'][4].drugDuplication.not }}/{{
            tableData['categories'][4].drugDuplication.count }})</span></td>
          <td>{{ calc(tableData['categories'][4].drugDuplication.over, tableData['categories'][4].drugDuplication.count)
            }} <span class="info ">({{ tableData['categories'][4].drugDuplication.over }}/{{
            tableData['categories'][4].drugDuplication.count }})</span></td>
        </tr>
        <tr>
          <td>Drug Disease ({{ tableData['categories'][5].drugDisease.count }})</td>
          <td>{{ calc(tableData['categories'][5].drugDisease.good, tableData['categories'][5].drugDisease.count) }}
            <span class="success">({{ tableData['categories'][5].drugDisease.good }}/{{
            tableData['categories'][5].drugDisease.count }})</span></td>
          <td>{{ calc(tableData['categories'][5].drugDisease.some, tableData['categories'][5].drugDisease.count) }}
            <span class="warning">({{ tableData['categories'][5].drugDisease.some }}/{{
            tableData['categories'][5].drugDisease.count }})</span></td>
          <td>{{ calc(tableData['categories'][5].drugDisease.not, tableData['categories'][5].drugDisease.count) }} <span
              class="danger">({{ tableData['categories'][5].drugDisease.not }}/{{
            tableData['categories'][5].drugDisease.count }})</span></td>
          <td>{{ calc(tableData['categories'][5].drugDisease.over, tableData['categories'][5].drugDisease.count) }}
            <span class="info">({{ tableData['categories'][5].drugDisease.over }}/{{
            tableData['categories'][5].drugDisease.count }})</span></td>
        </tr>
        <tr>
          <td>Drug Omissions ({{ tableData['categories'][6].drugOmissions.count }})</td>
          <td>{{ calc(tableData['categories'][6].drugOmissions.good, tableData['categories'][6].drugOmissions.count) }}
            <span class="success">({{ tableData['categories'][6].drugOmissions.good }}/{{
            tableData['categories'][6].drugOmissions.count }})</span></td>
          <td>{{ calc(tableData['categories'][6].drugOmissions.some, tableData['categories'][6].drugOmissions.count) }}
            <span class="warning">({{ tableData['categories'][6].drugOmissions.some }}/{{
            tableData['categories'][6].drugOmissions.count }})</span></td>
          <td>{{ calc(tableData['categories'][6].drugOmissions.not, tableData['categories'][6].drugOmissions.count) }}
            <span class="danger">({{ tableData['categories'][6].drugOmissions.not }}/{{
            tableData['categories'][6].drugOmissions.count }})</span></td>
          <td>{{ calc(tableData['categories'][6].drugOmissions.over, tableData['categories'][6].drugOmissions.count) }}
            <span class="info">({{ tableData['categories'][6].drugOmissions.over }}/{{
            tableData['categories'][6].drugOmissions.count }})</span></td>
        </tr>
        <tr>
          <td>Theraputic Duplication ({{ tableData['categories'][7].theraputicDuplication.count }})</td>
          <td>{{ calc(tableData['categories'][7].theraputicDuplication.good,
            tableData['categories'][7].theraputicDuplication.count) }} <span class="success">({{
            tableData['categories'][7].theraputicDuplication.good }}/{{
            tableData['categories'][7].theraputicDuplication.count }})</span></td>
          <td>{{ calc(tableData['categories'][7].theraputicDuplication.some,
            tableData['categories'][7].theraputicDuplication.count) }} <span class="warning">({{
            tableData['categories'][7].theraputicDuplication.some }}/{{
            tableData['categories'][7].theraputicDuplication.count }})</span></td>
          <td>{{ calc(tableData['categories'][7].theraputicDuplication.not,
            tableData['categories'][7].theraputicDuplication.count) }} <span class="danger">({{
            tableData['categories'][7].theraputicDuplication.not }}/{{
            tableData['categories'][7].theraputicDuplication.count }})</span></td>
          <td>{{ calc(tableData['categories'][7].theraputicDuplication.over,
            tableData['categories'][7].theraputicDuplication.count) }} <span class="info">({{
            tableData['categories'][7].theraputicDuplication.over }}/{{
            tableData['categories'][7].theraputicDuplication.count }})</span></td>
        </tr>
        <tr>
          <td>Drug Lab ({{ tableData['categories'][8].drugLab.count }})</td>
          <td>{{ calc(tableData['categories'][8].drugLab.good, tableData['categories'][8].drugLab.count) }} <span
              class="success">({{ tableData['categories'][8].drugLab.good }}/{{ tableData['categories'][8].drugLab.count
              }})</span></td>
          <td>{{ calc(tableData['categories'][8].drugLab.some, tableData['categories'][8].drugLab.count) }} <span
              class="warning">({{ tableData['categories'][8].drugLab.some }}/{{ tableData['categories'][8].drugLab.count
              }})</span></td>
          <td>{{ calc(tableData['categories'][8].drugLab.not, tableData['categories'][8].drugLab.count) }} <span
              class="danger">({{ tableData['categories'][8].drugLab.not }}/{{ tableData['categories'][8].drugLab.count
              }})</span></td>
          <td>{{ calc(tableData['categories'][8].drugLab.over, tableData['categories'][8].drugLab.count) }} <span
              class="info">({{ tableData['categories'][8].drugLab.over }}/{{ tableData['categories'][8].drugLab.count
              }})</span></td>
        </tr>
        <tr>
          <td>Drug Brand ({{ tableData['categories'][9].drugBrand.count }})</td>
          <td>{{ calc(tableData['categories'][9].drugBrand.good, tableData['categories'][9].drugBrand.count) }} <span
              class="success">({{ tableData['categories'][9].drugBrand.good }}/{{
            tableData['categories'][9].drugBrand.count }})</span></td>
          <td>{{ calc(tableData['categories'][9].drugBrand.some, tableData['categories'][9].drugBrand.count) }} <span
              class="warning">({{ tableData['categories'][9].drugBrand.some }}/{{
            tableData['categories'][9].drugBrand.count }})</span></td>
          <td>{{ calc(tableData['categories'][9].drugBrand.not, tableData['categories'][9].drugBrand.count) }} <span
              class="danger">({{ tableData['categories'][9].drugBrand.not }}/{{
            tableData['categories'][9].drugBrand.count }})</span></td>
          <td>{{ calc(tableData['categories'][9].drugBrand.over, tableData['categories'][9].drugBrand.count) }} <span
              class="info">({{ tableData['categories'][9].drugBrand.over }}/{{
            tableData['categories'][9].drugBrand.count }})</span></td>
        </tr>
        <tr>
          <td>Drug Route ({{ tableData['categories'][10].drugRoute.count }})</td>
          <td>{{ calc(tableData['categories'][10].drugRoute.good, tableData['categories'][10].drugRoute.count) }} <span
              class="success">({{ tableData['categories'][10].drugRoute.good }}/{{
            tableData['categories'][10].drugRoute.count }})</span></td>
          <td>{{ calc(tableData['categories'][10].drugRoute.some, tableData['categories'][10].drugRoute.count) }} <span
              class="warning">({{ tableData['categories'][10].drugRoute.some }}/{{
            tableData['categories'][10].drugRoute.count }})</span></td>
          <td>{{ calc(tableData['categories'][10].drugRoute.not, tableData['categories'][10].drugRoute.count) }} <span
              class="danger">({{ tableData['categories'][10].drugRoute.not }}/{{
            tableData['categories'][10].drugRoute.count }})</span></td>
          <td>{{ calc(tableData['categories'][10].drugRoute.over, tableData['categories'][10].drugRoute.count) }} <span
              class="info">({{ tableData['categories'][10].drugRoute.over }}/{{
            tableData['categories'][10].drugRoute.count }})</span></td>
        </tr>
        <tr>
          <td>Drug Overdose ({{ tableData['categories'][11].drugOverdose.count }})</td>
          <td>{{ calc(tableData['categories'][11].drugOverdose.good, tableData['categories'][11].drugOverdose.count) }}
            <span class="success">({{ tableData['categories'][11].drugOverdose.good }}/{{
            tableData['categories'][11].drugOverdose.count }})</span></td>
          <td>{{ calc(tableData['categories'][11].drugOverdose.some, tableData['categories'][11].drugOverdose.count) }}
            <span class="warning">({{ tableData['categories'][11].drugOverdose.some }}/{{
            tableData['categories'][11].drugOverdose.count }})</span></td>
          <td>{{ calc(tableData['categories'][11].drugOverdose.not, tableData['categories'][11].drugOverdose.count) }}
            <span class="danger">({{ tableData['categories'][11].drugOverdose.not }}/{{
            tableData['categories'][11].drugOverdose.count }})</span></td>
          <td>{{ calc(tableData['categories'][11].drugOverdose.over, tableData['categories'][11].drugOverdose.count) }}
            <span class="info">({{ tableData['categories'][11].drugOverdose.over }}/{{
            tableData['categories'][11].drugOverdose.count }})</span></td>
        </tr>
        <tr>
          <td>Drug Frequency ({{ tableData['categories'][12].drugFrequency.count }})</td>
          <td>{{ calc(tableData['categories'][12].drugFrequency.good, tableData['categories'][12].drugFrequency.count)
            }} <span class="success">({{ tableData['categories'][12].drugFrequency.good }}/{{
            tableData['categories'][12].drugFrequency.count }})</span></td>
          <td>{{ calc(tableData['categories'][12].drugFrequency.some, tableData['categories'][12].drugFrequency.count)
            }} <span class="warning">({{ tableData['categories'][12].drugFrequency.some }}/{{
              tableData['categories'][12].drugFrequency.count }})</span></td>
          <td>{{ calc(tableData['categories'][12].drugFrequency.not, tableData['categories'][12].drugFrequency.count) }}
            <span class="danger">({{ tableData['categories'][12].drugFrequency.not }}/{{
              tableData['categories'][12].drugFrequency.count }})</span></td>
          <td>{{ calc(tableData['categories'][12].drugFrequency.over, tableData['categories'][12].drugFrequency.count)
            }} <span class="info">({{ tableData['categories'][12].drugFrequency.over }}/{{
              tableData['categories'][12].drugFrequency.count }})</span></td>
        </tr>
        <tr>
          <th>All Categories *</th>
          <td class="good">Total : {{ calcPercentage(totalGood, totalValidTests) }}%</td>
          <td class="some">Total : {{ calcPercentage(totalSome, totalValidTests) }}%</td>
          <td class="not">Total : {{ calcPercentage(totalNot, totalValidTests) }}% </td>
          <td class="over">Total : {{ calcPercentage(totalOver, totalValidTests) }}% </td>
        </tr>
      </table>
    </div>

    <div class="note">* All categories (Good/Some/Not/Over) calculated as a percentage of the <span class="fw-bold">total valid tests</span>, not an average of the previous columns
    </div>

  </div>

</template>

<script>

import { calcPercentage } from '../helpers/utils';

export default {
  name: "ResultsTable",
  props: {
    tableData: {},
    totalValidTests: 0
  },
  computed: {
    totalGood() {    
      return this.tableData.totals.totalGood
    },
    totalSome() {
      return this.tableData.totals.totalSome;
    },
    totalNot() {
      return this.tableData.totals.totalNot
    },
    totalOver() {
      return this.tableData.totals.totalOver;
    }
  }
}
</script>

<style scoped></style>
