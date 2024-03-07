import { dataService } from '../services/data.service'
import { defineStore } from 'pinia'
import axios from "axios"

export const authenticationStore = defineStore('authentication', {
  state: () => ({
    user: localStorage.getItem('user'),
    userId: localStorage.getItem('userId'),
    institutionId: localStorage.getItem('institutionId'),
    token: localStorage.getItem('token')
  }),
  getters: {
    isLoggedIn: (state) => state.token != null,
    getUser: (state) => state.user,
    getUserId: (state) => state.userId,
    getInstitutionId: (state) => state.institutionId,
    getToken: (state) => state.token
  },
  actions: {
    async login(username, password) {

      let ret = {}

      console.group('login()')
      console.debug('Username', username, 'password', password)

      try {
        const user = await axios.post('auth/signin', { username, password })
        console.debug('User', user)
        //dataService.audit('Successful login', '/login') - TODO not working 23/02/2024 David Herbert
        this.updateUser(user)
        ret =  { status: 200, data: this.userId }        
      } catch (err) {
        //dataService.failedLoginAudit('Failed login', '/login')
        ret = this.triageError(err)      
      }

      console.debug('Returning', ret)
      console.groupEnd()

      return ret
    },
    logout() {

      console.group('logout()')

      localStorage.clear()
      this.$reset()

      console.groupEnd()
    },
    async signup(username, institution, email, password) {

      let ret = {}

      console.group('signup()')
      console.debug('Username', username, 'institution', institution, 'email', email, 'password', password)

      try {
        await axios.post('auth/signup/user', { username, institution, email, password, role:['user'] })
        ret = { status: 'ok', data: '' }
      } catch (err) {
        ret = this.triageError(err)
      }

      console.debug('Returning', ret)
      console.groupEnd()

      return ret
    },
    async checkIsAdminUser(userId) {

      console.group('checkIsAdminUser()')
      console.debug('User ID', userId)

      try {
        const res = await axios.get('auth/userIsAdmin?USER_ID=' + userId, { headers: { 'Authorization': 'Bearer ' + this.getToken } })
        console.debug('Admin user', res.data)
        console.groupEnd()
        return res.data
      } catch (err) {
        console.error('Error checking if user is admin:', err)
        console.groupEnd()
        return false
      }
    },
    triageError(err) {

      console.group('triageError()')

      let payload = {}

      if (err.response) {
        console.debug('err.response set')
        console.debug(err.response.data);
        console.debug(err.response.status);
        payload = { status: err.response.status, message: err.response.data.message || err.response.data }
      } else if (err.request) {
        console.debug('err.request set')
        console.debug(err.request)
        payload = { status: err.request.status, message: err.request.message }
      } else {
        console.debug('Catch-all')
        console.error(err)
        payload =  { status: 500, message: err }
      }

      console.debug('Payload', payload)
      console.groupEnd()

      return payload
    },
    updateUser(payload) {

      console.group('updateUser()')
      console.debug('Backend payload', payload)

      const csPayload = {
        user: payload.data.username,
        userId: payload.data.user_id,
        institutionId: payload.data.institution_id,
        token: payload.data.jwt.accessToken
      }

      console.debug('State before update : ', this.userId, this.user, this.institutionId, this.token)

      this.$patch(csPayload)
      Object.keys(csPayload).forEach((k) => {
        localStorage.setItem(k, csPayload[k])
      })

      console.debug('State after update : ', this.userId, this.user, this.institutionId, this.token)
      console.groupEnd()
    },    
    async requestNewPassword(email) {
      try {
        const res = await axios.post('auth/newPassword', { email })
        dataService.audit('Successful password reset request', '/requestpassword')
        console.error('Not implemented!')
      } catch (err) {
        console.error('authentication/requestNewPassword : the following error occurred', err)
        dataService.failedLoginAudit('Failed password reset request', '/requestpassword')
      }
    },
    async resetPassword(password, token) {
      try {
        const res = await axios.post('auth/resetPassword?token=' + token, { password })
        dataService.audit('Successful password reset', '/resetpassword')
        console.error('Not implemented!')
      } catch (err) {
        console.error('authentication/requestNewPassword : the following error occurred', err)
        dataService.failedLoginAudit('Failed password reset request', '/resetpassword')
      }
    }
  }
})