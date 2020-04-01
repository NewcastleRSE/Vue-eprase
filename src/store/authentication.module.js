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
            dataService.audit('Successful login', '/login');
            router.push('/assessmentintro');
          },
          error => {
            commit('loginFailure', error);
            dataService.failedLoginAudit('Failed login', '/login');
            return Promise.reject(new Error('failed'));
          }
        ).catch((err => {}));
    },
    logout({ commit }) {
      userService.logout();
      commit('logout');
    },
    requestNewPassword({ dispatch, commit }, { email }) {
      commit('newPasswordRequest', { email });

      userService.newPasswordRequest(email)
        .then(
          user => {
            commit('newPasswordSuccess', user);
            router.push('/assessmentintro');
          },
          error => {
            commit('newPasswordFailure', error);
            return Promise.reject(new Error('failed'));
          }
        ).catch((err => {}));

    },
    resetPassword({ dispatch, commit }, { password, token }) {
      commit('resetPassword');

      userService.resetPassword(password, token)
        .then(
          user => {
            commit('passwordResetSuccess', user);
            router.push('/login');
          },
          error => {
            commit('passwordResetFailure', error);
            return Promise.reject(new Error('reset failed'));
          }
        ).catch((err => {}));
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
    },
    newPasswordRequest(state){
      state.status = {};
      state.user = null;
    },
    newPasswordSuccess(state){
      state.status = {};
      state.user = null;
    },
    newPasswordFailure(state){
      state.status = {};
      state.user = null;
    },
    passwordResetSuccess(state){
      state.status = {};
      state.user = null;
    },
    passwordResetFailure(state){
      state.status = {};
      state.user = null;
    },
    resetPassword(state){
      state.status = {};
      state.user = null;
    },
  }
}
