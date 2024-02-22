import { userService } from "../services/user.service"
import { router } from "../router"
import { dataService } from "../services/data.service"
import { defineStore } from 'pinia'

export const authenticationStore = defineStore('authentication', {
  namespaced: true,
  state: () => ({
    user: localStorage.getItem('user'),
    userId: localStorage.getItem('userId'),
    institutionId: localStorage.getItem('institutionId'),
    token: localStorage.getItem('token')
  }),
  getters: {
    isLoggedIn: () => state.token != null,

  },
  actions: {
    async login(username, password) {
      commit("loginRequest", { username })

      userService
        .login(username, password)
        .then(
          (user) => {
            commit("loginSuccess", user)

            /*redirect admin user */
            if (password === "adminuser1") {
              dataService.audit("Successful admin  login", "/login")
              router.push("/adminhome")
            } else {
              dataService.audit("Successful login", "/login")
              router.push("/assessmentintro")
            }
          },
          (error) => {
            commit("loginFailure", error)
            dataService.failedLoginAudit("Failed login", "/login")
            return Promise.reject(new Error("failed"))
          },
        )
        .catch((err) => { })
    },
    logout() {
      localStorage.clear()
      this.$reset()
    },
    requestNewPassword({ dispatch, commit }, { email }) {
      commit("newPasswordRequest", { email })

      userService
        .newPasswordRequest(email)
        .then(
          (user) => {
            commit("newPasswordSuccess", user)
            router.push("/assessmentintro")
          },
          (error) => {
            commit("newPasswordFailure", error)
            return Promise.reject(new Error("failed"))
          },
        )
        .catch((err) => { })
    },
    resetPassword({ dispatch, commit }, { password, token }) {
      commit("resetPassword")

      userService
        .resetPassword(password, token)
        .then(
          (user) => {
            commit("passwordResetSuccess", user)
            router.push("/login")
          },
          (error) => {
            commit("passwordResetFailure", error)
            return Promise.reject(new Error("reset failed"))
          },
        )
        .catch((err) => { })
    },
  },
  mutations: {
    loginRequest(state, user) {
      state.status = { loggingIn: true }
      state.user = user
    },
    loginSuccess(state, user) {
      state.status = { loggedIn: true }
      state.user = user
    },
    loginFailure(state) {
      state.status = {}
      state.user = null
    },
    logout(state) {
      state.status = {}
      state.user = null
    },
    newPasswordRequest(state) {
      state.status = {}
      state.user = null
    },
    newPasswordSuccess(state) {
      state.status = {}
      state.user = null
    },
    newPasswordFailure(state) {
      state.status = {}
      state.user = null
    },
    passwordResetSuccess(state) {
      state.status = {}
      state.user = null
    },
    passwordResetFailure(state) {
      state.status = {}
      state.user = null
    },
    resetPassword(state) {
      state.status = {}
      state.user = null
    },
  },
})