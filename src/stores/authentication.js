import { defineStore } from 'pinia'
import axios from 'axios'
import { assessmentStore } from './assessment'
import Cookies from 'js-cookie'

const API = process.env.BASE_URL

export const authenticationStore = defineStore('authentication', {
  state: () => ({
    user: '',
    userId: 0,
    role: '',
    email: '', 
    institutionId: 0,
    hospital: '',
    orgDocId: '',
    orgCode: '',
    orgName: '',
    trust: '',
    token: ''
  }),  
  persist: [
    {
      pick: ['user', 'userId', 'role', 'email', 'institutionId', 'hospital', 'orgDocId', 'orgCode', 'orgName', 'trust'],
      storage: localStorage,
      debug: process.env.NODE_ENV !== 'production'
    }, 
    {
      pick: ['token'],
      storage: {
        getItem: (key) => {
          return Cookies.get(key)
        },
        setItem: (key, value) => {
          Cookies.set(key, value)
        }
      },
      debug: process.env.NODE_ENV !== 'production'
    }
  ],
  getters: {
    authTokenHeader(state) {
      return { 'Authorization': `Bearer ${state.token}` }
    }
  },
  actions: {
    isReporter() {
      return this.role == 'Reporter'
    },
    async login(identifier, password) {

      let ret = {}
      const payload = { identifier, password }

      console.group('login()')
      console.debug('Data payload', payload)

      try {
        // NOTE: this uses the standard authentication pathway which doesn't restrict institutions to one logged-in user at a time
        // Will need to develop a plugin to do the signin in order to implement this - David 21/03/2025
        const signinRes = await axios.post(`${API}auth/local`, payload)
        const userDetails = signinRes.data
        console.debug('User details from signin', userDetails)
        this.$patch({token: userDetails.jwt})

        console.debug('Determining user institution...')
        const instRes = await axios.get(`${API}users/me?populate[role][fields][0]=name&populate=institution`, { headers: this.authTokenHeader }) 
                
        this.$patch({
          user: userDetails.user.username,
          userId: userDetails.user.id,
          role: instRes.data.role.name,
          email: userDetails.user.email,
          institutionId: instRes.data.institution.id,
          hospital: userDetails.user.hospital,
          orgDocId: instRes.data.institution.documentId,
          orgCode: instRes.data.institution.institution_code,
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
      assessmentStore().reset()
      localStorage.clear()
      Cookies.remove('authentication')         
    },
    async logout() {
      console.group('logout()')
      if (this.token) {
        await axios.post(`${API}magic-sessionmanager/logout`, {}, { headers: this.authTokenHeader })
      }  
      this.clear()
      console.groupEnd()
    },    
    async isLoggedIn() {

      let ret = false

      console.group('isLoggedIn()')

      try {
        const res = await axios.get(`${API}users/me?populate=*`, { headers: this.authTokenHeader })
        this.$patch({ role: res.data.role.name })
        ret = true
      } catch (err) {
        console.error(err)
      }
      
      console.debug('Returning', ret)
      console.groupEnd()

      return ret
    },
    async getAllSessions() {

      let ret = false

      console.group('getAllSessions()')

      try {
        const res = await axios.get(`${API}magic-sessionmanager/my-sessions`, { headers: this.authTokenHeader })
        ret = res.data.data
      } catch (err) {
        console.error(err)
      }
      
      console.debug('Returning', ret)
      console.groupEnd()

      return ret
    },
    async terminateSession(sessionId) {

      let ret = false

      console.group('terminateSession()')
      console.debug('Terminating active session', sessionId)

      try {
        const res = await axios.delete(`${API}magic-sessionmanager/my-sessions/${sessionId}`, { headers: this.authTokenHeader })
        console.debug(res)
        ret = res.data.success
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
        const signupRes = await axios.post(`${API}auth/local/register`, payload)        
        ret = { status: signupRes.status, data: signupRes.data }
      } catch (err) {
        ret = this.triageError(err)
      }

      console.debug('Returning', ret)
      console.groupEnd()

      return ret
    },   
    // Enable an already logged in user to change their password
    async changePassword(currentPassword, password, passwordConfirmation) {

      let ret = {}
      const payload = { currentPassword, password, passwordConfirmation }
      
      console.group('changePassword()')
      console.debug('Data payload', payload)

      try {
        const changePassRes = await axios.post(`${API}auth/change-password`, payload, { headers: this.authTokenHeader })        
        ret = { status: changePassRes.status, data: changePassRes.data }
      } catch (err) {
        ret = this.triageError(err)
      }

      console.debug('Returning', ret)
      console.groupEnd()

      return ret
    }, 
    triageError(err) {

      console.group('triageError()')
      console.warn('Received error response', err)

      let payload = {}

      if (err.response) {
        console.warn('err.response set')
        console.warn(err.response)
        payload = { status: err.response.status, message: err.response.data.error ? err.response.data.error.message : err.response.data }
      } else if (err.request) {
        console.warn('err.request set')
        console.warn(err.request)
        payload = { status: err.request.status, message: err.request.statusText }
      } else {
        console.warn('Catch-all')
        console.error(err)
        payload = { status: err.status, message: err.message }
      }

      if (payload.status == 401 || payload.status == 440) {
        this.router.push('/login?action=sessionExpired')
      } else if (payload.status == 403) {
        this.router.push('/login?action=adminsOnly')
      }

      console.warn('Payload', payload)
      console.groupEnd()

      return payload
    }
  }
})