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
    patientIds: null,
    patientIndex : null
  },
  actions : {
    setPatientList({ commit }, { patientList, patientIds } ) {
      commit('setPatientList', { patientList });
      commit('setPatientIds', { patientIds });
    }
  },
  mutations: {
    setPatientList(state, patientList ){
      state.patientList = patientList;
    },
    setPatientIds(state, patientIds ){
      state.patientIds = patientIds;
    },
    updatePatientIndex(state, index){
      state.patientIndex = index + 1;
    }
  },
  getters: {
    getPatientList : state => {
      if (state.patientList) {
        return state.patientList;
      }
    }
  }
});
