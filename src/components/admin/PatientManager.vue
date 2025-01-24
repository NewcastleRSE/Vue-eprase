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
    <component :is="currentManager" :patientCode="selectedPatientCode" ref="currentManager"></component>
    <AppLogo cls="bottomright" />
  </main>
</template>

<script>

import { handsontableRegistrations, noEditRenderer } from '../../helpers/handsontable'
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
    }
  },
  data() {
    return {
      dataLoaded: false,
      dataError: false,
      nextPatientNum: null,
      patientData: null,
      selectedPatientCode: '',
      currentManager: 'ManageDiagnosesModal',
      patientTableSettings: {
        persistentState: true,
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
          { title: 'Code', type: 'text', data: 'code', editor: false, renderer: noEditRenderer },
          { title: 'First name', type: 'text', data: 'first_name', editor: false, renderer: noEditRenderer },
          { title: 'Surname', type: 'text', data: 'surname', editor: false, renderer: noEditRenderer },
          { title: 'Age', type: 'numeric', data: 'age', className: 'htRight' },
          { title: 'Gender', type: 'dropdown', source: ['Male', 'Female'], strict: true, data: 'gender', editor: false, renderer: noEditRenderer },
          { title: 'Height', type: 'numeric', data: 'height', className: 'htRight' },
          { title: 'Weight', type: 'text', data: 'weight', className: 'htRight', width: 150 },
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
                console.log(key, selection, this)
                this.selectedPatientCode = this.$refs.patientTableCpt.hotInstance.getDataAtCell(selection[0].start.row, 1)               
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
      return function() {
        // Generate field values where possible
        console.debug('New patient, gender', gender, 'is adult', isAdult, 'selection', selection, this)
        const hot = this.$refs.patientTableCpt.hotInstance
        const row = selection[0].start.row + 1
        hot.alter('insert_row_below', row - 1)
        hot.setDataAtRowProp(row, 'code', this.nextAvailablePatientCode())
        hot.setDataAtRowProp(row, 'first_name', faker.person.firstName(gender.toLowerCase()))
        hot.setDataAtRowProp(row, 'surname', 'zzz' + faker.person.lastName(gender.toLowerCase()))
        hot.setDataAtRowProp(row, 'age', isAdult ? 18 : 0)        
        hot.setDataAtRowProp(row, 'gender', gender)
        hot.setDataAtRowProp(row, 'height', isAdult ? 1.6 : 1.0)
        hot.setDataAtRowProp(row, 'weight', '0')
        hot.setDataAtRowProp(row, 'dob', '01/01/1971')
        hot.setDataAtRowProp(row, 'is_adult', isAdult)
        //TODO save this row to get an id
        hot.selectCell(row, 'age')
      }.bind(this)  
    }    
  },
  mounted() {
    handsontableRegistrations()
    this.getPatients()    
  }
}

</script>

<style scoped></style>