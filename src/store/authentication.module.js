import { userService } from '../services/user.service';
import { router } from '../router';
import {dataService} from "../services/data.service";

const user = localStorage.getItem('user');
const initialState = user
  ? { status: { loggedIn: true }, user }
  : { status: {}, user: null };

export const authentication = {
  namespaced: true,
  state: initialState,
  actions: {
    login({ dispatch, commit }, { username, password }) {
      commit('loginRequest', { username });

      userService.login(username, password)
        .then(
          user => {
            commit('loginSuccess', user);
            router.push('/home');
          },
          error => {
            commit('loginFailure', error);
            dispatch('alert/error', error, { root: true });
          }
        );
    },
    logout({ commit }) {
      userService.logout();
      commit('logout');
    } ,
    savePart1Data({ commit }, { ep_service, ep_version, ep_usage, patient_type, lab_results, med_history, time_taken }){
      dataService.savePart1Data(ep_service, ep_version, ep_usage, patient_type, lab_results, med_history, time_taken);
      commit('savePart1Data');
    },
    savePart2Data({ commit }, { qualitative_data, time_taken }){
      dataService.savePart2Data( qualitative_data, time_taken);
      commit('savePart2Data');
    },
    savePart3Data({ commit }, { qualitative_data, patient_id, time_taken, index }){
      dataService.savePart3Data( qualitative_data, patient_id, time_taken);
      commit('savePart3Data');
      commit('updatePatientIndex', index, { root: true });
    },
    savePrescriptionData({ commit }, { test_id, outcomes, other, overrides, risk_score, result_score, time_taken, qualitative_data, interventions, index }){
      dataService.savePrescriptionData( test_id, outcomes, other, overrides, risk_score, result_score, time_taken, qualitative_data, interventions );
      commit('savePart4Data');
      commit('updateTestIndex', index, { root: true });
    },
  },
  mutations: {
    loginRequest(state, user) {
      state.status = { loggingIn: true };
      state.user = user;
    },
    loginSuccess(state, user) {
      state.status = { loggedIn: true };
      state.user = user;
    },
    loginFailure(state) {
      state.status = {};
      state.user = null;
    },
    logout(state) {
      state.status = {};
      state.user = null;
    } ,
    savePart1Data(state) {
      state.part1complete = true;
    },
    savePart2Data(state) {
      state.part2complete = true;
    },
    savePart3Data(state) {
      state.part3complete = 'In progress';
    },
    savePart4Data(state) {
      state.part4complete = 'In progress';
    }
  }
}
