import { defineStore } from 'pinia'
import axios from "axios"
import { jwtDecode } from 'jwt-decode'

export const authenticationStore = defineStore('authentication', {
  state: () => ({
    user: localStorage.getItem('user'),
    userId: localStorage.getItem('userId'),
    institutionId: localStorage.getItem('institutionId'),
    token: localStorage.getItem('token')
  }),
  getters: {   
    isLoggedIn: (state) => {
      if (state.user && state.userId && state.institutionId && state.token) {
        // Check token expiry date
        const decodedToken = jwtDecode(state.token)
        return decodedToken && (decodedToken.exp * 1000) > new Date().getTime()
      }
      return false
    },
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
        this.updateUser(user)
        ret =  { status: 200, data: this.userId }        
      } catch (err) {        
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

      userId = userId || this.userId
      console.debug('User ID', userId)

      try {
        const res = await axios.get('auth/userIsAdmin?USER_ID=' + userId, { headers: { 'Authorization': 'Bearer ' + this.token } })
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
        console.debug(err.response)
        payload = { status: err.response.status, message: err.response.data.message || err.response.data }
      } else if (err.request) {
        console.debug('err.request set')
        console.debug(err.request)
        payload = { status: err.request.status, message: err.request.statusText }
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
        console.error('Not implemented!')
      } catch (err) {
        console.error('authentication/requestNewPassword : the following error occurred', err)
      }
    },
    async resetPassword(password, token) {
      try {
        const res = await axios.post('auth/resetPassword?token=' + token, { password })
        console.error('Not implemented!')
      } catch (err) {
        console.error('authentication/requestNewPassword : the following error occurred', err)
      }
    }
  }
})