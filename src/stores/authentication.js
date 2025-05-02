import { defineStore } from 'pinia'
import axios from "axios"

const API = process.env.BASE_URL

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
        // NOTE: this uses the standard authentication pathway which doesn't restrict institutions to one logged-in user at a time
        // Will need to develop a plugin to do the signin in order to implement this - David 21/03/2025
        const signinRes = await axios.post(API + 'auth/local', payload)
        const userDetails = signinRes.data
        console.debug('User details from signin', userDetails)
        this.$patch({token: signinRes.data.jwt})  // Store the JWT

        console.debug('Determining user institution...')
        const instRes = await axios.get(`${API}users/me?populate=institution`, { headers: this.authTokenHeader }) 
        
        this.$patch({
          user: userDetails.user.username,
          userId: userDetails.user.id,
          institutionId: instRes.data.institution.id,
          orgCode: instRes.data.institution.code,
          orgName: instRes.data.institution.name,
          trust: instRes.data.institution.trust_type
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

      let ret = false

      console.group('isLoggedIn()')

      try {
        const res = await axios.get(API + 'users/me?populate=*', { headers: this.authTokenHeader })
        ret = true
      } catch (err) {
        console.error(err)
      }
      
      console.debug('Returning', ret)
      console.groupEnd()

      return ret
    },
    async signup(username, institution, hospital, email, password) {

      let ret = {}
      const payload = { username, institution, hospital, email, password }
      
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
        payload = { status: err.response.status, message: err.response.data.error.message || err.response.data }
      } else if (err.request) {
        console.debug('err.request set')
        console.debug(err.request)
        payload = { status: err.request.status, message: err.request.statusText }
      } else {
        console.debug('Catch-all')
        console.error(err)
        payload =  { status: err.status, message: err.message }
      }

      console.debug('Payload', payload)
      console.groupEnd()

      return payload
    }
  }
})