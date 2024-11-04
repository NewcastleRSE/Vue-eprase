<template>
  <h3>EP System Comparison</h3>
  <p>This chart gives an overview of results by EP System</p>  

  <Form ref="epSystemComparisonForm" v-slot="{ meta: formMeta }" :validation-schema="validationSchema">

    <div class="mb-4 row">
      <label class="col-sm-8 col-form-label" for="ep-system-selector">Please choose an EP System to filter results</label>
      <div class="col-sm-4">
        <Field v-slot="{ field, meta }" v-model="searchfield" name="searchfield" id="ep-system-selector">
          <select v-bind="field" class="form-select"
            :class="meta.dirty ? (meta.valid ? 'is-valid' : 'is-invalid') : ''">
            <option value="" disabled>Select system...</option>
            <option v-for="epSystem in epSystemOptions" :value="epSystem.value">{{  epSystem.text }}</option>           
          </select>
        </Field>
      </div>
      <ErrorMessage name="ep-service" as="div" class="mt-2 text-danger text-center" v-slot="{ message }">
        {{ message }}
      </ErrorMessage>
    </div>

    <div v-if="searchfield === 'Other'" class="mb-4 row">
      <label class="col-sm-8 col-form-label" for="other-ep-system">Other eP service? <span
          class="required-field">*</span></label>
      <div class="col-sm-4">
        <Field v-slot="{ field, meta }" v-model="other" name="other" id="other-ep-system">
          <input v-bind="field" type="text" class="form-control"
            :class="meta.dirty ? (meta.valid ? 'is-valid' : 'is-invalid') : ''" placeholder="Enter service name...">
        </Field>
      </div>
      <ErrorMessage name="other" as="div" class="mt-2 text-danger text-center" v-slot="{ message }">
        {{ message }}
      </ErrorMessage>
    </div>

    <div>     
      <button type="button" class="btn btn-primary" :disabled="!formMeta.valid" id="search-button" @click="renderChart">
        <i class="bi bi-search pe-1"></i>Search
      </button>
    </div>
  </Form>

  <div ref="epSystemComparisonContainer" id="epSystemComparisonContainer" class="mb-4"></div>  
  <div v-if="submitted && filteredChartData.length == 0" class="mb-4 bg-warning-subtle"><span class="fw-bold">No instance of this EP System found</span></div>

</template>

<script>

import bsColors from '../assets/scss/variables.scss'
import Plotly from 'plotly.js-cartesian-dist-min'
import { mapStores, mapState } from 'pinia'
import { rootStore } from '../stores/root'
import { appSettingsStore } from '../stores/appSettings'
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
    ...mapState(appSettingsStore, ['epSystemOptions']),
    heading() {
      return 'Results by EP System : ' + this.searchfield == 'Other' ? this.other : this.searchfield
    },
    epSystemOptions() {
      return appSettingsStore().epSystemOptions
    },
    chartDataEmpty() {
      return !Array.isArray(this.chartData) || this.chartData.length == 0
    }
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
        'searchfield': 'required',
        'other': (value) => {
          return (this.searchfield == 'Other') ? (value != '' ? true : 'Please give details') : true
        },           
      },
      chartData: [],
      filteredChartData: [],
      searchfield: '',
      other: '',
      submitted: false
    }
  },
  methods: {  
    renderChart() {
      
      console.group('EpSystemComparisonChart - renderChart()')
      console.debug('Filtering chart data', this.chartData, 'by system type', this.searchfield)
      if (this.searchfield == 'Other') {
        console.debug('Searching user-defined system type', this.other)
      }

      this.submitted = true

      const searchValue = this.searchfield == 'Other' ? this.other : this.searchfield
      const colorMapping = {
        'GoodMitigation': bsColors.successColor,
        'SomeMitigation': bsColors.warningColor,
        'NotMitigated': bsColors.dangerColor,
        'OverMitigated': bsColors.infoColor,
        'InvalidTests': bsColors.invalidColor
      }
      this.filteredChartData = []

      this.chartData.forEach(elt => {
        const filteredX = []
        const filteredY = []
        elt.x.forEach((xval, idx) => {
          if (xval.endsWith(`(${searchValue})`)) {
            filteredX.push(xval)
            filteredY.push(elt.y[idx])
          }
        })
        if (filteredX.length > 0) {
          this.filteredChartData.push({
            name: elt.name,
            type: elt.type,
            x: filteredX,
            y: filteredY,
            marker: {
              color: colorMapping[elt.name]
            }
          })
        }
      })
      if (this.filteredChartData.length > 0) {
        console.debug('filteredChartData : ', this.filteredChartData)
        Plotly.react(this.$refs.epSystemComparisonContainer, this.filteredChartData, {
          barmode: 'stack',
          width: 900,
          height: 700
        }, {displayModeBar: false})
      } else {
        Plotly.purge(this.$refs.epSystemComparisonContainer)
      }

      console.groupEnd()
    }, 
    async getMitigationResults() {
      this.chartData = rootStore().mitigationChartData
      if (this.chartDataEmpty) {
        const response = await rootStore().getAllMitigationResults()
        if (response.status < 400) {
          this.chartData = []
          const orgNamesSystems = response.data.map(d => `${d.institution.orgName} (${d.epSystem})`)
          const mkeys = ['goodMitigation', 'someMitigation', 'notMitigated', 'overMitigated', 'invalidTests']
          const colorMapping = [bsColors.successColor, bsColors.warningColor, bsColors.dangerColor, bsColors.infoColor, bsColors.invalidColor]
          mkeys.forEach((mk, mkIdx) => {
            const chartBlock = {
              x: orgNamesSystems,
              y: [],
              name: mk.substring(0, 1).toUpperCase() + mk.substring(1),
              type: 'bar',
              marker: {
                color: colorMapping[mkIdx]
              }
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
