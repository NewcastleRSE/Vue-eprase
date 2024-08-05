import { defineStore } from 'pinia'
import axios from "axios"
import { jwtDecode } from 'jwt-decode'

export const authenticationStore = defineStore('authentication', {
  state: () => ({
    user: null,
    userId: null,
    institutionId: null,
    orgCode: null,
    orgName: null,
    trust: null,
    token: null
  }),
  persist: true,
  getters: {   
    isLoggedIn: (state) => {
      if (state.user && state.userId && state.institutionId && state.token) {
        // Check token expiry date
        const decodedToken = jwtDecode(state.token)
        return decodedToken && (decodedToken.exp * 1000) > new Date().getTime()
      }
      return false
    }
  },
  actions: {
    async login(username, password) {

      let ret = {}

      console.group('login()')
      console.debug('Username', username, 'password', password)

      try {
        const user = await axios.post('auth/signin', { username, password })
        const institutionDetails = await this.getInstitutionDetails(user.data.institution_id)
        console.debug('User', user, 'institution details', institutionDetails)
        this.updateUser(user, institutionDetails)
        ret =  { status: 200, data: this.userId }        
      } catch (err) {        
        ret = this.triageError(err)      
      }

      console.debug('Returning', ret)
      console.groupEnd()

      return ret
    },
    clear() {
      this.$reset()
      localStorage.clear()
    },
    logout() {

      console.group('logout()')

      this.clear()

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
      if (!userId) return false

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
    async getInstitutionDetails(institutionId) {

      console.group('getInstitutionDetails()')

      institutionId = institutionId || this.institutionId
      console.debug('Institution ID', institutionId)

      try {
        const res = await axios.get('auth/institutionDetails?institutionId=' + institutionId)
        console.debug('Details', res.data)
        console.groupEnd()
        return res.data
      } catch (err) {
        console.error('Error getting user institution details:', err)
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
    updateUser(user, institution) {

      console.group('updateUser()')
      console.debug('User data', user.data, 'institution', institution)

      const csPayload = {
        user: user.data.username,
        userId: user.data.user_id,
        institutionId: user.data.institution_id,
        orgCode: institution.orgCode,
        orgName: institution.orgName,
        trust: institution.trust,
        token: user.data.jwt.accessToken
      }

      console.debug('State before update : ', this.userId, this.user, this.institutionId, this.orgCode, this.orgName, this.trust, this.token)

      this.$patch(csPayload)      

      console.debug('State after update : ', this.userId, this.user, this.institutionId, this.orgCode, this.orgName, this.trust, this.token)
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