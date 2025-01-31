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

import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import * as hothelp from '../../helpers/handsontable'
import { removeDuplicates } from '../../helpers/utils.js'
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
      unsavedRowNum: -1,                  // Set when a new patient is created, and only unset when record is saved
      validationSchema: {
        'id': (value) => value == null || (Number.isInteger(value) && value > 0),
        'code': ( value) => value != null && value.match(/^P\d{3}$/) != null,
        'first_name': (value) => value != null && value.length > 0,
        'surname': (value) => value != null && value.length > 0,
        'age': (value) => value != null && Number.isInteger(value) && value > 0,
        'gender': (value) => value == 'Male' || value == 'Female',
        'height': (value) => !Number.isNaN(value) && value >= 0,
        'weight': (value) => value != null && value.length > 0,
        'dob': (value) => value != null && dayjs(value, 'DD-MM-YYYY', true).isValid(),
        'is_adult': (value) => value === true || value === false
      },
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
        copyPaste: false,
        columns: [
          { title: 'ID', type: 'numeric', data: 'id', editor: false, validator: false },
          { title: 'Code', type: 'text', data: 'code', editor: false, renderer: hothelp.noEditRenderer, validator: false },
          { title: 'First name', type: 'text', data: 'first_name', editor: false, renderer: hothelp.noEditRenderer, validator: false },
          { title: 'Surname', type: 'text', data: 'surname', editor: false, renderer: hothelp.noEditRenderer, validator: false },
          { title: 'Age', type: 'numeric', data: 'age', className: 'htRight', validator: false },
          { title: 'Gender', type: 'dropdown', source: ['Male', 'Female'], strict: true, data: 'gender', editor: false, renderer: hothelp.noEditRenderer, validator: false },
          { title: 'Height', type: 'numeric', data: 'height', className: 'htRight', validator: false },
          { title: 'Weight', type: 'text', data: 'weight', className: 'htRight', width: 150, validator: false},
          { title: 'DOB', type: 'date', dateFormat: 'DD/MM/YYYY', data: 'dob', className: 'htRight', editor: false, renderer: hothelp.noEditRenderer, validator: false },
          { title: 'Adult', type: 'checkbox', data: 'is_adult', className: 'htCenter', width: 120, readOnly: true, validator: false }       
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
        afterCreateRow: this.afterCreateRowHook,
        afterChange: this.afterChangeHook,
        afterValidate: this.afterValidateHook,
        contextMenu: {
          callback: (key, selection, clickEvent) => {
            // Common callback for all options - not sure we need this
            console.debug('Common callback', key, selection, clickEvent);
          },
          items: {     
            new_male_adult_patient: {
              name: 'Insert new adult male patient below',
              callback: (key, selection) => {
                this.createNewPatient('Male', true, selection)()  
              },
              disabled: this.unsavedDataExists
            },
            new_female_adult_patient: {
              name: 'Insert new adult female patient below',
              callback: (key, selection) => {   
                this.createNewPatient('Female', true, selection)()
              },
              disabled: this.unsavedDataExists
            },
            manage_diagnoses: {
              name: 'Manage diagnoses',
              callback: (key, selection) => {
                this.selectedPatientData = hothelp.rowDataArrayToColumnObject(this.hot.getDataAtRow(selection[0].start.row), this.patientTableSettings.columns)
                this.$refs.currentManager.show()
              },
              disabled: this.unsavedDataExists
            },
            remove_row: {
              name: 'Remove patient',
              disabled: this.patientDeletionPrevented
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
    afterCreateRowHook(index) {
      this.unsavedRowNum = index
    },
    afterChangeHook(changes, source) {

      console.group('afterChangeHook')
      console.debug('After change hook called with', changes, source)

      if (changes != null) {
        const rowsToSave = removeDuplicates(changes.map(c => c[0]))
        rowsToSave.forEach(row => {
          if (this.validatePatientRecord(row)) {
            //TODO save the data
            console.debug('### TODO - save the data here ###')
            console.debug('### TODO - data end ###')
            if (row == this.unsavedRowNum) {
              this.unsavedRowNum = -1
            }
          }          
        })        
      }
      console.groupEnd()
    },
    unsavedDataExists() {      
      return this.unsavedRowNum >= 0
    },
    patientDeletionPrevented() {
      //TODO - should check patient record not used anywhere else (database foreign keys will prevent deletion)
      // We can, however, delete an unsaved row, as this will have no repercussions elsewhere in the database
      return this.hot.getSelectedLast()?.[0] != this.unsavedRowNum
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
    validatePatientRecord(row) {

      let valid = true

      console.group('validatePatientRecord()')
      console.debug('Validating record at', row)

      const rec = hothelp.rowDataArrayToColumnObject(this.hot.getDataAtRow(row), this.patientTableSettings.columns)
      for (const [key, value] of Object.entries(rec)) {        
        let td = this.hot.getCell(row, this.hot.propToCol(key))
        let meta = this.hot.getCellMeta(row, this.hot.propToCol(key))
        console.debug('Cell at', row, this.hot.propToCol(key), 'is', td)            
        if (!this.validationSchema[key](value)) { 
          console.debug(key, 'with value', value, 'is invalid')         
          if (td != null) {
            matchMedia.valid = false
            console.debug('Classlist before', td.classList)
            td.classList.add('bg-danger-subtle')
            console.debug('Classlist after', td.classList)
          }          
          valid = false          
        } else {
          console.debug(key, 'with value', value, 'is valid')
          if (td != null) {
            meta.valid = true
            console.debug('Classlist before', td.classList)
            td.classList.remove('bg-danger-subtle')
            console.debug('Classlist after', td.classList)
          }
        }
      }

      console.debug('Returning', valid)
      console.groupEnd()

      return valid
    },
    createNewPatient(gender, isAdult, selection) {
      return () => {
        // Generate field values where possible
        console.debug('New patient, gender', gender, 'is adult', isAdult, 'selection', selection, this)
        const row = selection[0].start.row + 1
        const data = [
          [row, 'code', this.nextAvailablePatientCode()],
          [row, 'first_name', faker.person.firstName(gender.toLowerCase())],
          [row, 'surname', 'zzz' + faker.person.lastName(gender.toLowerCase())],
          [row, 'age', isAdult ? 18 : 0],        
          [row, 'gender', gender],
          [row, 'height', isAdult ? 1.6 : 1.0],
          [row, 'weight', '0'],
          [row, 'dob', '01/01/1971'],
          [row, 'is_adult', isAdult]
        ]
        this.hot.alter('insert_row_below', row - 1)
        this.hot.setDataAtRowProp(data)    
        this.hot.selectRows(row)    
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