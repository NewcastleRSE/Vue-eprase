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
    console.debug(key, selection, clickEvent);
  },
  items: {
    row_above: {
      disabled() {
        // `disabled` can be a boolean or a function
        // Disable option when first row was clicked
        return this.getSelectedLast()?.[0] === 0; // `this` === hot
      },
    },    
    new_male_adult_patient: {
      name: 'Add new male adult patient',
      callback() {
        console.log('Add new male', this)
      }
    },
    new_female_adult_patient: {
      name: 'Add new female adult patient',
      callback() {
        console.log('Add new female', this)
      }
    },
    remove_row: {
      disabled() {
        const row = this.getSelectedLast()?.[0]
        return row && this.getDataAtCell(row, 0) != null
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
        minSpareRows: 1,
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