<template>
  <h3>EP System Comparison</h3>
  <p>This chart gives an overview of results by EP System</p>  

  <Form ref="assessmentSystemForm" v-slot="{ meta: formMeta }" :validation-schema="validationSchema">

    <div class="mb-4 row">
      <label class="col-sm-8 col-form-label" for="ep-system-selector">Please choose an EP System to filter results</label>
      <div class="col-sm-4">
        <Field v-slot="{ field, meta }" v-model="searchfield" name="ep-service" id="ep-system-selector">
          <select v-bind="field" class="form-select"
            :class="meta.dirty ? (meta.valid ? 'is-valid' : 'is-invalid') : ''" @change="renderChart">
            <option value="" disabled>Select system...</option>
            <option value="Cerner"> Cerner </option>
            <option value="All script"> All script </option>
            <option value="Meditech"> Meditech </option>
            <option value="JAC"> JAC </option>
            <option value="Medway"> Medway </option>
            <option value="EPIC"> EPIC </option>
            <option value="Open EP"> Open EP </option>
            <option value="PICS"> PICS </option>
            <option value="Sunrise"> Sunrise </option>
            <option value="MedChart">MedChart </option>
            <option value="Lorenzo">Lorenzo </option>
            <option value="Other"> Other (Please Specify)</option>
          </select>
        </Field>
      </div>
      <ErrorMessage name="ep-service" as="div" class="mt-2 text-danger text-center" v-slot="{ message }">
        {{ message }}
      </ErrorMessage>
    </div>
  </Form>

  <div ref="epSystemComparisonContainer" class="mb-4"></div>
  <div v-if="searchfield != null && filteredChartData.length == 0" class="mb-4">No instance of this EP System found</div>

</template>

<script>

import Plotly from 'plotly.js-cartesian-dist-min'
import { mapStores } from 'pinia'
import { rootStore } from '../stores/root'
import { Form, Field, ErrorMessage } from 'vee-validate'

export default {
  name: "EpSystemComparisonChart",
  props: {
    mydata: {
      type: Array
    }
  },
  computed: {
    ...mapStores(rootStore),
  },
  emits: ['get-mitigation-fail'],
  components: {
    Form,
    Field,
    ErrorMessage
  },
  data() {
    return {
      validationSchema: {
        'searchfield': 'required'              
      },
      chartData: [],
      filteredChartData: [],
      searchfield: null
    }
  },
  methods: {  
    renderChart() {
      
      console.group('EpSystemComparisonChart - renderChart()')
      console.debug('Filtering chart data', this.chartData, 'by system type', this.searchfield)

      const re = new RegExp('\\(' + this.searchfield + '\\)')
      this.filteredChartData = this.chartData.filter(cd => cd['x'][0].match(re))
      if (this.filteredChartData.length > 0) {
        Plotly.newPlot(this.$refs.epSystemComparisonContainer, this.filteredChartData, {
          barmode: 'stack',
          width: 900,
          height: 700
        }, {displayModeBar: false})
      }

      console.groupEnd()
    }, 
    async getMitigationResults() {
      this.chartData = rootStore().mitigationChartData
      if (this.chartData == null) {
        const response = await rootStore().getAllMitigationResults()
        if (response.status < 400) {
          this.chartData = []
          const orgNamesSystems = response.data.map(d => `${d.institution.orgName} (${d.epSystem})`)
          const mkeys = ['goodMitigation', 'someMitigation', 'notMitigated', 'overMitigated', 'invalidTests']
          mkeys.forEach(mk => {
            const chartBlock = {
              x: orgNamesSystems,
              y: [],
              name: mk.substring(0, 1).toUpperCase() + mk.substring(1),
              type: 'bar'
            }
            chartBlock.y = response.data.map(d => d[mk])            
            this.chartData.push(chartBlock)
          })
          rootStore().storeMitigationChartData(this.chartData)
        } else {
          this.$emit('get-mitigation-fail', response.message)
        }
      }
    }
  },
  mounted() {
    this.getMitigationResults()
  }
}
</script>

<style scoped></style>
