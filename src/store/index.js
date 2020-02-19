import Vue from 'vue';
import Vuex from 'vuex';

import { authentication } from './authentication.module';
import {dataService} from "../services/data.service";

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    authentication
  },
  state : {
    patientList : null,
    testList: [],
    patientIndex : 0,
    testIndex: 0,
    part1complete: null,
    part2complete: null,
    part3complete: null,
    part4complete: null,
    configErrorComplete: null
  },
  actions : {
    setPatientList({ commit }, { patientList  } ) {
      commit('setPatientList', { patientList });
    },
    setTestList({ commit }, { testList}){
      commit('setTestList', { testList });
    },
    saveSystemData({ commit }, { ep_service, other_service, ep_version, ep_usage, patient_type, lab_results, man_results, diagnosis_results, med_history, high_risk_meds, clinical_areas, time_taken }){
      dataService.saveSystemData(ep_service, other_service, ep_version, ep_usage, patient_type, lab_results, man_results, diagnosis_results, med_history, high_risk_meds, clinical_areas, time_taken);
      commit('saveSystemData');
    },
    savePart2Data({ commit }, { qualitative_data, time_taken }){
      dataService.savePart2Data( qualitative_data, time_taken);
      commit('savePart2Data');
    },
    savePart3Data({ commit }, { qualitative_data, patient_id, time_taken, index, completed }){
      dataService.savePart3Data( qualitative_data, patient_id, time_taken);
      commit('savePart3Data', completed);
      commit('updatePatientIndex', index);
    },
    savePrescriptionData({ commit }, { prescription, outcome, other, intervention_type, selected_type, risk_level, result, result_score, time_taken, qualitative_data, index, completed}){
      dataService.savePrescriptionData( prescription, outcome, other, intervention_type, selected_type, risk_level, result, result_score, time_taken, qualitative_data, index, completed );
      commit('savePart4Data', completed);
      commit('updateTestIndex', index);
    },
    saveConfigError({ commit }, { test_id,  result, time_taken, index }){
      dataService.saveConfigError( test_id, result, time_taken);
      commit('saveConfigError');
      commit('updateTestIndex', index);
    }
  },
  mutations: {
    setPatientList(state, patientList ){
      state.patientList = patientList;
    },
    setTestList(state, testList ){
      state.testList = testList;
    },
    updatePatientIndex(state, index){
      state.patientIndex = index + 1;
    },
    updateTestIndex(state, index){
      state.testIndex = index + 1;
    },
    saveSystemData(state) {
      state.part1complete = true;
    },
    savePart2Data(state) {
      state.part2complete = true;
    },
    savePart3Data(state, completed) {
      state.part3complete = completed;
    },
    savePart4Data(state, completed) {
      state.part4complete = completed;
    },
    saveConfigError(state){
      state.configErrorComplete = true;
    }
  }
});
