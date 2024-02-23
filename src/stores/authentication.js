import { dataService } from '../services/data.service'
import { appSettingsStore } from './appSettings'
import { defineStore } from 'pinia'

export const authenticationStore = defineStore('authentication', {
  state: () => ({
    user: localStorage.getItem('user'),
    userId: localStorage.getItem('userId'),
    institutionId: localStorage.getItem('institutionId'),
    token: localStorage.getItem('token')
  }),
  getters: {
    isLoggedIn: () => state.token != null,
    user: () => state.user,
    userId: () => state.userId,
    institutionId: () => state.institutionId,
    token: () => state.token
  },
  actions: {    
    async login(username, password) {

      console.group('login()')
      console.debug('Username', username, 'password', password)

      const appSettings = appSettingsStore()
      const requestOptions = Object.assign({}, appSettings.axiosDefaultOptions, { body: JSON.stringify({ username, password })})
      console.debug('POST to /auth/signin with payload', requestOptions)

      try {
        const user = await this.axios.post('auth/signin', requestOptions)
        console.debug('Success, user', user)
        dataService.audit('Successful login', '/login')
        this.updateUser(user)
        console.groupEnd()
        if (this.checkIsAdminUser(user.userId)) {
          this.$router.push('/adminhome')
        } else {
          this.$router.push('/assessmentintro')
        }        
      } catch (err) {
        console.error('authentication/login : the following error occurred', err)
        dataService.failedLoginAudit('Failed login', '/login')
        console.groupEnd()
      }
    },
    logout() {
      localStorage.clear()
      this.$reset()
    },
    async checkIsAdminUser(userId) {

      console.group('isAdminUser()')
      console.debug('User ID', userId)

      const appSettings = appSettingsStore()
      const requestOptions = Object.assign({}, appSettings.axiosDefaultOptions)
      requestOptions.headers['Authorization'] = 'Bearer ' + this.token
      console.debug('POST to /auth/signin with payload', requestOptions)

      try {
        const res = await this.axios.get('auth/userIsAdmin?USER_ID=' + userId, requestOptions)
        console.groupEnd()
        return res
      } catch(err) {
        console.error('Error checking if user is admin:', err)
        console.groupEnd()
        return false
      }      
    },    
    updateUser(res) {
      console.debug('State before update', this.state)
      this.$patch(res)
      Object.keys(res).forEach((k) => {
        localStorage.setItem(k, res[k])
      })    
      console.debug('State after update', this.state)
    },
    async requestNewPassword(email) {
      const appSettings = appSettingsStore()
      const requestOptions = Object.assign({}, appSettings.axiosDefaultOptions, { body: email }) 
      try {
        const res = await this.axios.post('auth/newPassword', requestOptions)
        dataService.audit('Successful password reset request', '/requestpassword')
        console.error('Not implemented!')
      } catch (err) {
        console.error('authentication/requestNewPassword : the following error occurred', err)
        dataService.failedLoginAudit('Failed password reset request', '/requestpassword')
      }
    },
    async resetPassword(password, token) {
      const appSettings = appSettingsStore()
      const requestOptions = Object.assign({}, appSettings.axiosDefaultOptions, { body: password }) 
      try {
        const res = await this.axios.post('auth/resetPassword?token=' + token, requestOptions)
        dataService.audit('Successful password reset', '/resetpassword')
        console.error('Not implemented!')
      } catch (err) {
        console.error('authentication/requestNewPassword : the following error occurred', err)
        dataService.failedLoginAudit('Failed password reset request', '/resetpassword')
      }
    }
  }
})