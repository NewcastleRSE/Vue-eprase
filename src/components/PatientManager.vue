<template>
  <main class="leftalign">

    <div class="pills-banner"><img src="../assets/images/pills-bw.png" alt="banner graphic"></div>

    <div class="content p-4">

      <LoginInfo />

      <h1 class="px-4">Patient Management</h1>
      <div v-if="dataLoaded" class="px-4 w-100 ht-theme-horizon">       
        <hot-table :settings="tableSettings"></hot-table>
      </div>
    </div>
    <AppLogo cls="bottomright" />
  </main>
</template>

<script>

import { faker } from '@faker-js/faker'
import { mapStores } from 'pinia'
import AppLogo from "./AppLogo"
import LoginInfo from "./LoginInfo"
import { HotTable } from '@handsontable/vue3'
import { patientStore } from "../stores/patients"
import { authenticationStore } from "../stores/authentication"

import 'handsontable/styles/handsontable.css';
import 'handsontable/styles/ht-theme-main.css';

const contextMenuSettings = {
  callback(key, selection, clickEvent) {
    // Common callback for all options
    console.debug('Common callback', key, selection, clickEvent);
  },
  items: {     
    new_male_adult_patient: {
      name: 'Add new male adult patient',
      callback(key, selection, clickEvent) {
        // Generate field values where possible
        console.debug('New male adult patient', key, selection, clickEvent);
        const row = selection[0].start.row + 1
        this.alter('insert_row_below', row - 1)
        this.setDataAtRowProp(row, 'first_name', faker.person.firstName('male'))
        this.setDataAtRowProp(row, 'surname', 'zzz' + faker.person.lastName('male'))
        this.setDataAtRowProp(row, 'gender', 'male')
        this.setDataAtRowProp(row, 'is_adult', true)
        this.selectCell(row, 'age')              
      }
    },
    new_female_adult_patient: {
      name: 'Add new female adult patient',
      callback(key, selection, clickEvent) {
        // Generate field values where possible
        console.debug('New female adult patient', key, selection, clickEvent);        
        const row = selection[0].start.row + 1
        this.alter('insert_row_below', row - 1)
        this.setDataAtRowProp(row, 'first_name', faker.person.firstName('female'))
        this.setDataAtRowProp(row, 'surname', 'zzz' + faker.person.lastName('female'))
        this.setDataAtRowProp(row, 'gender', 'female')
        this.setDataAtRowProp(row, 'is_adult', true)
        this.selectCell(row, 'age')
      }
    },
    remove_patient: {
      name: 'Remove patient',
      disabled() {
        return true
      }
    }
  }
}

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
      tableSettings: {
        data: [],
        width: 'auto',
        stretchH: 'all',
        height: 'auto', 
        columnSorting: true,     
        columns: [
          { title: 'ID', type: 'numeric', data: 'id' },
          { title: 'Code', type: 'text', data: 'code' },
          { title: 'First name', type: 'text', data: 'first_name' },
          { title: 'Surname', type: 'text', data: 'surname' },
          { title: 'Age', type: 'numeric', data: 'age', className: 'htRight' },
          { title: 'Gender', type: 'dropdown', source: ['male', 'female'], strict: true, data: 'gender' },
          { title: 'Height', type: 'numeric', data: 'height', className: 'htRight' },
          { title: 'Weight', type: 'text', data: 'weight', className: 'htRight' },
          { title: 'DOB', type: 'date', dateFormat: 'DD/MM/YYYY', data: 'dob' },
          { title: 'Adult', type: 'checkbox', data: 'is_adult', className: 'htCenter' }
        ],
        hiddenColumns: {
          columns: [0, 1, 8]
        },
        autoWrapRow: true,
        autoWrapCol: true,
        manualColumnResize: true,
        filters: true,
        copyPaste: {
          copyColumnHeaders: true
        },
        dropdownMenu: [
          'alignment',
          '---------',  
          'filter_by_condition',
          'filter_operators',       
          'filter_by_value',
          'filter_action_bar'
        ],
        contextMenu: contextMenuSettings,
        licenseKey: 'non-commercial-and-evaluation'
      }
    }
  },
  methods: {
    async getPatients() {
      const response = await patientStore().getPatients()
      if (response.status == 200) {
        this.tableSettings.data = response.data.map(p => {
          const { id, code, first_name, surname, age, gender, height, weight, dob, is_adult } = p
          return { id, code, first_name, surname, age, gender, height, weight, dob, is_adult }
        })
        console.log(this.tableSettings.data)
        this.dataLoaded = true
      } else {
        this.patients = [response.message]
        console.error(response.message)
      }
    }
  },
  mounted() {
    this.getPatients()    
  }
}

</script>

<style scoped></style>