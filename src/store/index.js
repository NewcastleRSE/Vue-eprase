import Vue from 'vue';
import Vuex from 'vuex';

import { alert } from './alert.module';
import { authentication } from './authentication.module';

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    alert,
    authentication,
  },
  state : {
    patientList : null,
    testList: null,
    patientIndex : 0,
    testIndex: 0
  },
  actions : {
    setPatientList({ commit }, { patientList, testList } ) {
      commit('setPatientList', { patientList });
      commit('setTestList', { testList });
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
    }
  }
});
