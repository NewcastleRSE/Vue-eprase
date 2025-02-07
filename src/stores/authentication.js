import { defineStore } from 'pinia'
import axios from "axios"
import { jwtDecode } from 'jwt-decode'

const API = process.env.BASE_URL

// Strapi's "authenticated" role - need more granularity for ePRaSE eventually...
const ROLE_AUTHENTICATED = 1

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
        const res = await axios.post(API + 'auth/local', { identifier: username, password: password })
        const userDetails = res.data
        const institutionDetails = await this.getInstitutionDetails(userDetails.user.id, res.data.jwt)
        console.debug('User', userDetails, 'institution details', institutionDetails)
        this.storeUserData(userDetails, institutionDetails)
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
        await axios.post('auth/local/register', { username, institution, email, password, role: ROLE_AUTHENTICATED })
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
    async getInstitutionDetails(userId, token) {

      console.group('getInstitutionDetails()')
      console.debug('Determining institution for user', userId, 'logged in with token', token)

      try {
        const res = await axios.get(`${API}users?filters[id][$eq]=${userId}&populate=institution`, { headers: { 'Authorization': `Bearer ${token}` } })   
        if ((Array.isArray(res) && res.length == 0) || Object.keys(res).length == 0) {
          throw new Error('No user found with id', userId)
        }
        const details = Array.isArray(res.data) ? res.data[0].institution : res.data.institution
        console.debug('Details', details)
        console.groupEnd()
        return details
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
    storeUserData(userDetails, institutionDetails) {

      console.group('storeUserData()')
      console.debug('User data', userDetails, 'institution', institutionDetails)

      const csPayload = {
        user: userDetails.user.username,
        userId: userDetails.user.id,
        institutionId: institutionDetails.id,
        orgCode: institutionDetails.code,
        orgName: institutionDetails.name,
        trust: institutionDetails.trust_type,
        token: userDetails.jwt
      }

      console.debug('State before update : ', this.userId, this.user, this.institutionId, this.orgCode, this.orgName, this.trust, this.token)

      this.$patch(csPayload)      

      console.debug('State after update : ', this.userId, this.user, this.institutionId, this.orgCode, this.orgName, this.trust, this.token)
      console.groupEnd()
    },
    // User management methods, only accessible to an admin
    async findUsers(identifier, institution_id) {
      try {
        const params = new URLSearchParams()
        if (identifier) {
          params.set('identifier', identifier)
        }
        if (institution_id) {
          params.set('institution_id', institution_id)
        }
        const query = params.toString()
        const res = await axios.get('auth/findUsers?' + query, { headers: { 'Authorization': 'Bearer ' + this.token } })
        return { status: res.status, data: res.data }
      } catch (err) {
        this.triageError(err)
      }
    },
    async updateUser(id, email, password, enable, institution_id) {
      try {
        const res = await axios.post('auth/updateUser', 
          { id, email, password, enable, institution_id }, 
          { headers: { 'Authorization': 'Bearer ' + this.token, 'Content-Type': 'multipart/form-data' } }
        )
        return { status: res.status, data: res.data }
      } catch (err) {
        this.triageError(err)
      }
    },
    async deleteUser(id) {
      try {
        const res = await axios.delete('auth/deleteUser', 
          { headers: { 'Authorization': 'Bearer ' + this.token }, params: { id: id } }
        )
        return { status: res.status, data: res.data }
      } catch (err) {
        this.triageError(err)
      }
    },
    isValidNHSEmail(value) {
      value.match(/^[a-zA-Z0-9-.]+@([a-z]+.|)nhs.(uk|net)+$/)
    }
  }
})