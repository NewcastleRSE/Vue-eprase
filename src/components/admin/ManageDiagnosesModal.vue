<template>
  <GenericModal 
    :modalName="'ManageDiagnosesModal'" 
    :modalId="'manageDiagnosesModal'" 
    :title="`Diagnosis Manager for ${patientRecord.code} (${patientRecord.first_name} ${patientRecord.surname})`"
    :sizeClass="'modal-xl'"
    :closeBtnText="'Done'"
    :showActionBtn="false"
  >
    <p class="p-3 rounded bg-info-subtle">
      Info here TODO
    </p>
    <div v-if="dataLoaded && !dataError" class="px-3 w-100 ht-theme-horizon">       
      <hot-table ref="diagnosisTableCpt" :settings="diagnosisTableSettings"></hot-table>
    </div>
    <div v-if="dataError">
      <p class="p-3 rounded bg-danger-subtle">
        The following error occurred while fetching patient data : {{ dataError }}
      </p>
    </div>
  </GenericModal>
</template>

<script>

import { noEditRenderer } from '../../helpers/handsontable'
import { mapStores } from 'pinia'
import { patientStore } from "../../stores/patients"
import { authenticationStore } from "../../stores/authentication"
import { HotTable } from '@handsontable/vue3'
import GenericModal from '../GenericModal'
import { setVisible } from '../../helpers/modal'

export default {
  name: "ManageDiagnosesModal",
  extends: GenericModal,
  components: {
    GenericModal,
    HotTable
  },
  props: {
    patientRecord: {
      type: Object,
      default: {}
    }
  },
  computed: {    
    ...mapStores(authenticationStore, patientStore)
  },
  data() {
    return {
      dataLoaded: false,
      dataError: false,
      patientDiagnoses: null,
      allDiagnoses: null,
      diagnosisTableSettings: {
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
          }
        },
        columns: [
          { title: 'ID', type: 'numeric', data: 'id', readOnly: true },
          { title: 'Diagnosis', type: 'text', data: 'diagnosis', editor: false, renderer: noEditRenderer },
          { title: 'Assigned', type: 'checkbox', className: 'htCenter', data: 'assigned' }
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
        afterUpdateData(...args) {
          console.debug('After update', args)
          this.dataLoaded = true
        },
        licenseKey: 'non-commercial-and-evaluation'
      }
    }
  }, 
  methods: {    
    close() {
      setVisible('manageDiagnosesModal', false)
    },
    show() {     
      setVisible('manageDiagnosesModal', true)
    },
    async spreadsheetSetup() {
      await import('../../helpers/handsontable.js')
    },
    async getDiagnosisData() {
      console.log('### patient record is', this.patientRecord)
      try {
        const responseAll = await patientStore().getAllDiagnoses()
        if (responseAll.status >= 400) {               
          throw new Error(responseAll.message)
        }
        const responsePatient = await patientStore().getPatientByCode(this.patientRecord['code'])      
        if (responsePatient.status >= 400) {        
          throw new Error(responsePatient.message)
        }        
        this.patientDiagnoses = responsePatient.data.diagnosis.map(pd => pd.id)
        this.allDiagnoses = responseAll.data.map(d => Object.assign(d, { assigned: this.patientDiagnoses.includes(d.id) }))
        this.dataLoaded = true
        this.diagnosisTableSettings.data = this.allDiagnoses
      } catch(e) {
       this.dataError = [e.message]  
       console.error(e.message)    
      }
    }   
  },
  mounted() {
    this.spreadsheetSetup()
    document.querySelector('#manageDiagnosesModal').addEventListener('shown.bs.modal', evt => {
      this.getDiagnosisData()
    })     
  }
}
</script>

<style scoped></style>
