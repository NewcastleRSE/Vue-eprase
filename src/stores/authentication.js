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
        const signinRes = await axios.post(API + 'auth/local', { identifier: username, password: password })
        const userDetails = signinRes.data
        console.debug('User details from signin', userDetails)
        this.$patch({token: signinRes.data.jwt})  // Store the JWT

        const instRes = await axios.get(`${API}users?filters[id][$eq]=${userDetails.user.id}&populate=institution`, { headers: { 'Authorization': `Bearer ${this.token}` } })   
        if ((Array.isArray(instRes) && instRes.length == 0) || Object.keys(instRes).length == 0) {
          throw new Error('No user found with id', userId)
        }
        const instDetails = Array.isArray(instRes.data) ? instRes.data[0].institution : instRes.data.institution
        console.debug('Institution details for user', details)
        
        this.$patch({
          user: userDetails.user.username,
          userId: userDetails.user.id,
          institutionId: instDetails.id,
          orgCode: instDetails.code,
          orgName: instDetails.name,
          trust: instDetails.trust_type
        })
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
    }
  }
})