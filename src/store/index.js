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
    assessmentId: null,
    patientList : null,
    testList: [],
    patientIndex : 0,
    testIndex: 0,
    part1complete: null,
    part2complete: null,
    part3complete: null,
    part4complete: null,
    configErrorComplete: null,
    mitigationData: []
  },
  actions : {
    setPatientList({ commit }, { patientList  } ) {
      commit('setPatientList', { patientList });
    },
    setTestList({ commit }, { testList}){
      commit('setTestList', { testList });
    },
    saveSystemData({ commit }, { ep_service, other_service, ep_version, ep_usage, other_ep_system, patient_type, lab_results, man_results, diagnosis_results, med_history, high_risk_meds, clinical_areas, time_taken }){
      dataService.saveSystemData(ep_service, other_service, ep_version, ep_usage, other_ep_system, patient_type, lab_results, man_results, diagnosis_results, med_history, high_risk_meds, clinical_areas, time_taken);
      commit('saveSystemData');
    },
    saveCreatePatientData({ commit }, { qualitative_data, time_taken }){
      dataService.saveCreatePatientData( qualitative_data, time_taken);
      commit('saveCreatePatientData');
    },
    savePatientData({ commit }, { qualitative_data, code, time_taken, index, completed }){
      dataService.savePatientData( qualitative_data, code, time_taken);
      commit('savePatientData', completed);
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
    },
    storeAssessmentId({commit}, { id }){
      commit('setAssessmentId', { id} );
    },
    storeMitigationData({ commit }, { goodPercentage, somePercentage, notPercentage, overPercentage}){
      commit('setMitigationData', { goodPercentage, somePercentage, notPercentage, overPercentage });
    },
    storeStackedChartData({commit}, { stackedChartData }){
      commit('setStackedChartData', { stackedChartData })
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
    saveCreatePatientData(state) {
      state.part2complete = true;
    },
    savePatientData(state, completed) {
      state.part3complete = completed;
    },
    savePart4Data(state, completed) {
      state.part4complete = completed;
    },
    saveConfigError(state){
      state.configErrorComplete = true;
    },
    setAssessmentId(state, id){
      state.assessmentId = id;
    },
    setMitigationData(state, goodPercentage, somePercentage, notPercentage, overPercentage){
      state.mitigationData[0] = goodPercentage;
      state.mitigationData[1] = somePercentage;
      state.mitigationData[2] = notPercentage;
      state.mitigationData[3] = overPercentage;
    },
    setStackedChartData(state, stackedChartData){
        state.stackedChartData = stackedChartData
    }
  }
});
