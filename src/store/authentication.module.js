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
    saveData({ dispatch, commit }, { ep_service, ep_version, ep_usage, patient_type, lab_results, med_history, time_taken }){
      dataService.saveAssessmentData(ep_service, ep_version, ep_usage, patient_type, lab_results, med_history, time_taken);
      commit('saveAssessmentData');
    }
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
    saveAssessmentData(state) {
      state.status = {};
      state.user = user;
    }
  }
}
