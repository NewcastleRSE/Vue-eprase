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

      console.group('login()')
      console.debug('Username', username, 'password', password)

      try {
        const user = await axios.post('auth/signin', { username, password }) 
        //dataService.audit('Successful login', '/login') - TODO not working 23/02/2024 David Herbert
        this.updateUser(user)
        return this.userId

        console.groupEnd()

      } catch (err) {        
        //dataService.failedLoginAudit('Failed login', '/login')

        console.error('authentication/login : the following error occurred', err)
        console.groupEnd()

        throw new Error(err)
      }
    },
    logout() {
      localStorage.clear()
      this.$reset()
    },
    async checkIsAdminUser(userId) {

      console.group('checkIsAdminUser()')
      console.debug('User ID', userId)

      try {
        const res = await axios.get('auth/userIsAdmin?USER_ID=' + userId, { headers: { 'Authorization': 'Bearer ' + this.getToken }})
        console.debug('Admin user', res.data)
        console.groupEnd()
        return res.data
      } catch(err) {
        console.error('Error checking if user is admin:', err)
        console.groupEnd()
        return false
      }      
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