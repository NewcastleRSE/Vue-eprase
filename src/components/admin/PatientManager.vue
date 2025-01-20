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
        <p class="p-4 bg-danger-subtle">
          The following error occurred while fetching patient data : {{ dataError }}
        </p>
      </div>
    </div>
    <AppLogo cls="bottomright" />
  </main>
</template>

<script>

import { faker } from '@faker-js/faker'
import { mapStores } from 'pinia'
import AppLogo from "../AppLogo"
import LoginInfo from "../LoginInfo"
import { HotTable } from '@handsontable/vue3'
import { patientStore } from "../../stores/patients"
import { authenticationStore } from "../../stores/authentication"

import 'handsontable/styles/handsontable.css';
import 'handsontable/styles/ht-theme-main.css';

export default {
  name: "PatientManager",
  components: {
    HotTable,
    LoginInfo,
    AppLogo
  },
  computed: {    
    ...mapStores(authenticationStore, patientStore)
  },
  data() {
    return {
      dataLoaded: false,
      dataError: false,
      nextPatientNum: null,
      patientData: null,
      patientTableSettings: {
        data: [],
        width: 'auto',
        height: 'auto',
        columnSorting: true,
        columns: [
          { title: 'ID', type: 'numeric', data: 'id', readOnly: true },
          { title: 'Code', type: 'text', data: 'code', editor: false, renderer: this.noEditRenderer },
          { title: 'First name', type: 'text', data: 'first_name', editor: false, renderer: this.noEditRenderer },
          { title: 'Surname', type: 'text', data: 'surname', editor: false, renderer: this.noEditRenderer },
          { title: 'Age', type: 'numeric', data: 'age', className: 'htRight' },
          { title: 'Gender', type: 'dropdown', source: ['Male', 'Female'], strict: true, data: 'gender', editor: false, renderer: this.noEditRenderer },
          { title: 'Height', type: 'numeric', data: 'height', className: 'htRight' },
          { title: 'Weight', type: 'text', data: 'weight', className: 'htRight', width: 150 },
          { title: 'DOB', type: 'date', dateFormat: 'DD/MM/YYYY', data: 'dob', className: 'htRight', editor: false, renderer: this.noEditRenderer },
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
              }
            },
            new_female_adult_patient: {
              name: 'Insert new adult female patient below',
              callback: (key, selection) => {                
                this.createNewPatient('Female', true, selection)()
              }
            },
            manage_diagnoses: {
              name: 'Manage diagnoses',
              callback: (key, selection) => {
                console.log(key, selection)
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
    async getPatients() {
      const response = await patientStore().getPatients()
      this.patientData = response.data
      if (response.status == 200) {
        this.patientTableSettings.data = this.patientData.map(p => {
          const { id, code, first_name, surname, age, gender, height, weight, dob, is_adult } = p
          return { id, code, first_name, surname, age, gender, height, weight, dob, is_adult }
        })
        console.debug(this.patientTableSettings.data)
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
      return function() {
        // Generate field values where possible
        console.debug('New patient, gender', gender, 'is adult', isAdult, 'selection', selection, this)
        const hot = this.$refs.patientTableCpt.hotInstance
        const row = selection[0].start.row + 1
        hot.alter('insert_row_below', row - 1)
        hot.setDataAtRowProp(row, 'code', this.nextAvailablePatientCode())
        hot.setDataAtRowProp(row, 'first_name', faker.person.firstName(gender.toLowerCase()))
        hot.setDataAtRowProp(row, 'surname', 'zzz' + faker.person.lastName(gender.toLowerCase()))
        hot.setDataAtRowProp(row, 'gender', gender)
        hot.setDataAtRowProp(row, 'is_adult', isAdult)
        hot.selectCell(row, 'age')
      }.bind(this)  
    },
    noEditRenderer(_instance, td, _row, _col, _prop, value) {
      td.setAttribute('title', 'This value cannot be edited')
      td.classList.add('non-editable-cell')
      td.innerText = value
      return td
    },
    
  },
  mounted() {
    this.getPatients()    
  }
}

</script>

<style scoped></style>