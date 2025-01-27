<template>
  <main class="leftalign">

    <div class="pills-banner"><img src="../../assets/images/pills-bw.png" alt="banner graphic"></div>

    <div class="content p-4">

      <LoginInfo />

      <h1 class="px-4">Patient Management</h1>
      <div v-if="dataLoaded && !dataError" class="px-4 w-100 ht-theme-horizon">       
        <hot-table ref="patientTableCpt" :settings="patientTableSettings"></hot-table>
      </div>
      <div v-if="dataError">
        <p class="p-3 bg-danger-subtle">
          The following error occurred while fetching patient data : {{ dataError }}
        </p>
      </div>
    </div>
    <component :is="currentManager" :patientRecord="selectedPatientData" ref="currentManager"></component>
    <AppLogo cls="bottomright" />
  </main>
</template>

<script>

import { patientCodeValidator, patientWeightValidator, noEditRenderer, rowDataArrayToColumnObject } from '../../helpers/handsontable'
import { faker } from '@faker-js/faker'
import { mapStores } from 'pinia'
import AppLogo from '../AppLogo'
import LoginInfo from '../LoginInfo'
import { HotTable } from '@handsontable/vue3'
import { patientStore } from '../../stores/patients'
import { authenticationStore } from '../../stores/authentication'
import ManageDiagnosesModal from './ManageDiagnosesModal'

export default {
  name: "PatientManager",
  components: {
    HotTable,
    LoginInfo,
    AppLogo,
    ManageDiagnosesModal
  },
  computed: {    
    ...mapStores(authenticationStore, patientStore),
    manageDiagnosesModal() {
      return this.$refs.manageDiagnosesModal
    },
    hot() {
      return this.$refs.patientTableCpt.hotInstance
    }
  },
  data() {
    return {
      dataLoaded: false,
      dataError: false,
      nextPatientNum: null,
      patientData: null,
      selectedPatientData: {},
      currentManager: 'ManageDiagnosesModal',
      patientTableSettings: {
        data: [],
        width: 'auto',
        height: 'auto',
        columnSorting: {
          headerAction: true,
          sortEmptyCells: false,
          indicator: true,
          initialConfig: {
            column: 1,
            sortOrder: 'asc',
          },
        },
        columns: [
          { title: 'ID', type: 'numeric', data: 'id', readOnly: true },
          { title: 'Code', type: 'text', data: 'code', editor: false, renderer: noEditRenderer, validator: patientCodeValidator },
          { title: 'First name', type: 'text', data: 'first_name', editor: false, renderer: noEditRenderer },
          { title: 'Surname', type: 'text', data: 'surname', editor: false, renderer: noEditRenderer },
          { title: 'Age', type: 'numeric', data: 'age', className: 'htRight' },
          { title: 'Gender', type: 'dropdown', source: ['Male', 'Female'], strict: true, data: 'gender', editor: false, renderer: noEditRenderer },
          { title: 'Height', type: 'numeric', data: 'height', className: 'htRight' },
          { title: 'Weight', type: 'text', data: 'weight', className: 'htRight', width: 150, validator: patientWeightValidator },
          { title: 'DOB', type: 'date', dateFormat: 'DD/MM/YYYY', data: 'dob', className: 'htRight', editor: false, renderer: noEditRenderer },
          { title: 'Adult', type: 'checkbox', data: 'is_adult', className: 'htCenter', width: 120, readOnly: true }       
        ],
        hiddenColumns: { columns: [0, 8] },
        autoWrapRow: true,
        autoWrapCol: true,
        manualColumnResize: true,
        filters: true,        
        dropdownMenu: [
          'alignment',
          '---------',  
          'filter_by_condition',
          'filter_operators',       
          'filter_by_value',
          'filter_action_bar'
        ],
        afterCreateRow(index, amount, source) {

        },
        afterChange: (changes, source) => {
          if (changes != null) {
            const changedRowHash = {}          
            changes?.forEach(([row, prop, oldValue, newValue]) => {
              console.debug('afterChange called with', row, prop, oldValue, newValue, source)
              //TODO save this row to get an id
              changedRowHash[row] = 1
            })
            console.debug(Object.keys(changedRowHash))//TODO these are strings
            this.hot.validateRows(Object.keys(changedRowHash), (valid) => {
              console.log('VALID = ', valid)
            })
          }          
        },
        contextMenu: {
          callback: (key, selection, clickEvent) => {
            // Common callback for all options - not sure we need this
            console.debug('Common callback', key, selection, clickEvent);
          },
          items: {     
            new_male_adult_patient: {
              name: 'Insert new adult male patient below',
              callback: (key, selection) => {
                console.log('Male patient create', key)    
                this.createNewPatient('Male', true, selection)()  
              }
            },
            new_female_adult_patient: {
              name: 'Insert new adult female patient below',
              callback: (key, selection) => {   
                console.log('Female patient create', key)                 
                this.createNewPatient('Female', true, selection)()
              }
            },
            manage_diagnoses: {
              name: 'Manage diagnoses',
              callback: (key, selection) => {
                console.log(key, selection, this)
                this.selectedPatientData = rowDataArrayToColumnObject(this.hot.getDataAtRow(selection[0].start.row), this.patientTableSettings.columns)
                this.$refs.currentManager.show()
              }
            },
            remove_patient: {
              name: 'Remove patient',
              disabled: () => {
                return true
              }
            }
          }
        },
        licenseKey: 'non-commercial-and-evaluation'
      }
    }
  },
  methods: {
    async spreadsheetSetup() {
      await import('../../helpers/handsontable.js')
    },
    async getPatients() {
      const response = await patientStore().getPatients()
      this.patientData = response.data
      if (response.status == 200) {
        this.patientTableSettings.data = this.patientData.map(p => {
          const { id, code, first_name, surname, age, gender, height, weight, dob, is_adult } = p
          return { id, code, first_name, surname, age, gender, height, weight, dob, is_adult }
        })
        this.dataLoaded = true
      } else {
        this.dataError = [response.message]
        console.error(response.message)
      }
    },
    nextAvailablePatientCode() {
      // Get the next available patient code Pxxxx
      if (this.nextPatientNum == null) {
        this.nextPatientNum = parseInt(this.patientData.map(p => p.code).sort().pop().substr(1)) + 1
      } else {
        this.nextPatientNum++ 
      }
      return 'P' + this.nextPatientNum.toString().padStart(3, '0')
    },
    createNewPatient(gender, isAdult, selection) {
      return () => {
        // Generate field values where possible
        console.debug('New patient, gender', gender, 'is adult', isAdult, 'selection', selection, this)
        const row = selection[0].start.row + 1
        this.hot.alter('insert_row_below', row - 1)
        this.hot.setDataAtRowProp([
          [row, 'code', this.nextAvailablePatientCode(), 'new_patient_start'],
          [row, 'first_name', faker.person.firstName(gender.toLowerCase()), 'new_patient'],
          [row, 'surname', 'zzz' + faker.person.lastName(gender.toLowerCase()), 'new_patient'],
          [row, 'age', isAdult ? 18 : 0, 'new_patient'],        
          [row, 'gender', gender, 'new_patient'],
          [row, 'height', isAdult ? 1.6 : 1.0, 'new_patient'],
          [row, 'weight', '0', 'new_patient'],
          [row, 'dob', '01/01/1971', 'new_patient'],
          [row, 'is_adult', isAdult, 'new_patient_end']
        ])        
        this.hot.selectCell(row, 'age')
      } 
    }    
  },
  mounted() {
    this.spreadsheetSetup()
    this.getPatients()    
  }
}

</script>

<style scoped></style>