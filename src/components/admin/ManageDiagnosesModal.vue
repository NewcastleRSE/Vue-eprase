<template>
  <GenericModal 
    :modalName="'ManageDiagnosesModal'" 
    :modalId="'manageDiagnosesModal'" 
    :title="'Diagnosis Manager'"
    :sizeClass="'modal-xl'"
    :closeBtnText="'Done'"
    :showActionBtn="false"
  >
    <p class="p-3 rounded bg-info-subtle">
      Info here TODO
    </p>
    <div class="px-4 w-100 ht-theme-horizon">       
      <hot-table ref="diagnosisTableCpt" :settings="diagnosisTableSettings"></hot-table>
    </div>
  </GenericModal>
</template>

<script>

import { handsontableRegistrations, noEditRenderer } from '../../helpers/handsontable'
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
    patientCode: {
      type: String,
      default: ''
    }
  },
  computed: {    
    ...mapStores(authenticationStore, patientStore)
  },
  data() {
    return {
      spreadsheet: null,
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
    async getDiagnosisData() {
      //try {
        const responseAll = await patientStore().getAllDiagnoses()
        if (responseAll.status >= 400) {               
          throw new Error(responseAll.message)
        }
        const responsePatient = await patientStore().getPatientByCode(this.patientCode)      
        if (responsePatient.status >= 400) {        
          throw new Error(responsePatient.message)
        }        
        this.patientDiagnoses = responsePatient.data.diagnosis.map(pd => pd.id)
        this.allDiagnoses = responseAll.data.map(d => Object.assign(d, { assigned: this.patientDiagnoses.includes(d.id) }))
        console.debug(this.allDiagnoses, this.spreadsheet)  
        this.spreadsheet.updateData(this.allDiagnoses)        
      //} catch(e) {
      //  this.dataError = [e.message]  
      //  console.error(e.message)    
      //}
    }   
  },
  mounted() {
    handsontableRegistrations()
    document.querySelector('#manageDiagnosesModal').addEventListener('shown.bs.modal', evt => {
      this.getDiagnosisData()
    })
    this.spreadsheet = this.$refs.diagnosisTableCpt.hotInstance 
  }
}
</script>

<style scoped></style>
