import { defineStore } from 'pinia'
import axios from "axios"

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
  getters: {
    authTokenHeader() {
      return { 'Authorization': `Bearer ${this.token}` }
    }
  },
  persist: true, 
  actions: {
    async login(identifier, password) {

      let ret = {}
      const payload = { identifier, password }

      console.group('login()')
      console.debug('Data payload', payload)

      try {
        const signinRes = await axios.post(API + 'auth/local', payload)
        const userDetails = signinRes.data
        console.debug('User details from signin', userDetails)
        this.$patch({token: signinRes.data.jwt})  // Store the JWT

        console.debug('Determining user institution...')
        const instRes = await axios.get(`${API}users?filters[id][$eq]=${userDetails.user.id}&populate=institution`, { headers: this.authTokenHeader })   
        if ((Array.isArray(instRes) && instRes.length == 0) || Object.keys(instRes).length == 0) {
          throw new Error('No institution found for user id', userId)
        }
        const instDetails = Array.isArray(instRes.data) ? instRes.data[0].institution : instRes.data.institution
        console.debug('Institution details for user', instDetails)
        
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
    async isLoggedIn() {

      let ret = {}

      console.group('isLoggedIn()')

      // Example return from /users/me API call (not in Strapi documentation!)
      // {
      //   "id": 1,
      //   "documentId": "r6oyijabsyw5sifgjm0xuz7j",
      //   "username": "david",
      //   "email": "david.herbert@ncl.ac.uk",
      //   "provider": "local",
      //   "confirmed": true,
      //   "blocked": false,
      //   "createdAt": "2025-03-17T15:03:20.739Z",
      //   "updatedAt": "2025-03-17T15:03:20.739Z",
      //   "publishedAt": "2025-03-17T15:03:20.739Z"
      // }

      if (!this.token) {
        console.debug('No JWT present => cannot be logged in')
        ret = { status: 200, data: false }        
      } else {
        try {
          const res = await axios.get(API + 'users/me', { headers: this.authTokenHeader })
          ret = { status: res.status, data: true}
        } catch (err) {
          ret = this.triageError(err)
        }
      }
      
      console.debug('Returning', ret)
      console.groupEnd()

      return ret
    },
    async signup(username, institution, email, password) {

      let ret = {}
      const payload = { username, institution, email, password, role: ROLE_AUTHENTICATED }

      console.group('signup()')
      console.debug('Data payload', payload)

      try {
        const signupRes = await axios.post('auth/local/register', payload)
        ret = { status: signupRes.status, data: signupRes.data }
      } catch (err) {
        ret = this.triageError(err)
      }

      console.debug('Returning', ret)
      console.groupEnd()

      return ret
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