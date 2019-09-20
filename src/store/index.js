import Vue from 'vue';
import Vuex from 'vuex';

import { alert } from './alert.module';
import { authentication } from './authentication.module';
import {dataService} from "../services/data.service";

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    alert,
    authentication,
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
    ep_usage: null,
    lab_results : null
  },
  actions : {
    setPatientList({ commit }, { patientList, testList } ) {
      commit('setPatientList', { patientList });
      commit('setTestList', { testList });
    },
    savePart1Data({ commit }, { ep_service, ep_version, ep_usage, patient_type, lab_results, med_history, time_taken }){
      dataService.savePart1Data(ep_service, ep_version, ep_usage, patient_type, lab_results, med_history, time_taken);
      commit('savePart1Data', { ep_usage, lab_results } );
    },
    savePart2Data({ commit }, { qualitative_data, time_taken }){
      dataService.savePart2Data( qualitative_data, time_taken);
      commit('savePart2Data');
    },
    savePart3Data({ commit }, { qualitative_data, patient_id, time_taken, index }){
      dataService.savePart3Data( qualitative_data, patient_id, time_taken);
      commit('savePart3Data');
      commit('updatePatientIndex', index);
    },
    savePrescriptionData({ commit }, { test_id, outcome, other, override, risk_score, result_score, time_taken, qualitative_data, interventions, index}){
      dataService.savePrescriptionData( test_id, outcome, other, override, risk_score, result_score, time_taken, qualitative_data, interventions );
      commit('savePart4Data');
      commit('updateTestIndex', index);
    },
    completePart3({commit}){
      commit('completePart3');
    },
    completePart4({commit}){
      commit('completePart4');
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
    savePart1Data(state, ep_usage, lab_results) {
      state.part1complete = true;
      state.ep_usage = ep_usage;
      state.lab_results = lab_results;
    },
    savePart2Data(state) {
      state.part2complete = true;
    },
    savePart3Data(state) {
      state.part3complete = 'In progress';
    },
    savePart4Data(state, completed) {
      state.part4complete ='In progress';
    },
    completePart3(state){
      state.part3complete = true;
    },
    completePart4(state){
      state.part4complete = true;
    }
  }
});
