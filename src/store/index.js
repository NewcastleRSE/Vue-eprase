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
  },
  actions : {
    setPatientList({ commit }, { patientList, patientIds } ) {
      commit('setPatientList', { patientList }),
      commit('setPatientIds', { patientIds })
    }
  },
  mutations: {
    setPatientList(state, patientList ){
      state.patientList = patientList;
    },
    setPatientIds(state, patientIds ){
      state.patientIds = patientIds;
    }
  },
  getters: {
    getPatientListById: (state) => (id) => {
      return state.patientList.find(id => patientList.id === id)
    },
    getPatientList : state => {
      return state.patientList
    }
  }
});
