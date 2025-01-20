<template>
  <GenericModal 
    :modalName="'ManageDiagnosesModal'" 
    :modalId="'manageDiagnosesModal'" 
    :title="'Diagnosis Manager'" 
    :closeBtnText="'Close'"
    :showActionBtn="true"
  >
    <h1 class="px-4">Diagnosis Management</h1>
    <p class="p-4 bg-info-subtle">
      
    </p>
    <div v-if="dataLoaded" class="px-4 w-100 ht-theme-horizon">       
      <hot-table ref="diagnosisTableCpt" :settings="diagnosisTableSettings"></hot-table>
    </div>
  </GenericModal>
</template>

<script>

import { HotTable } from '@handsontable/vue3'
import { setVisible } from '../../helpers/modal'
import GenericModal from '../GenericModal'

export default {
  name: "ManageDiagnosesModal",
  components: {
    GenericModal,
    HotTable
  },
  props: {
    patientCode: null
  },
  computed: {    
    ...mapStores(authenticationStore, patientStore)
  },
  data() {
    return {
      dataLoaded: false,
      dataError: false,
      diagnosisTableSettings: {
        data: [],
        width: 'auto',
        height: 'auto',
        columnSorting: true,
        columns: [
          { title: 'ID', type: 'numeric', data: 'id', readOnly: true },
          { title: 'Diagnosis', type: 'text', data: 'diagnosis' },
          { title: 'Assigned', type: 'checkbox', data: 'assigned' }
        ],
        hiddenColumns: { columns: [0] },
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
            // Common callback for all options
            console.debug('Common callback', key, selection, clickEvent);
          },
          items: {     
            new_diagnosis: {
              name: 'Insert new diagnosis below',
              callback: (key, selection) => {    
                this.createNewPatient('Male', true, selection)()  
              }
            },
            remove_diagnosis: {
              name: 'Remove diagnosis',
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
    close() {
      this.errorText = ''
      setVisible('errorAlertModal', false)
    },
    show(text) {
      this.errorText = text || 'No message was returned by the backend API'
      setVisible('errorAlertModal', true)
    },
    async getPatientDiagnoses() {
      const response = await patientStore().getPatientByCode(patientCode)
      this.patientData = response.data
      if (response.status == 200) {        
        //TODO
        this.dataLoaded = true
      } else {
        this.dataError = [response.message]
        console.error(response.message)
      }
    }    
  },
  mounted() {

  }
}
</script>

<style scoped></style>
