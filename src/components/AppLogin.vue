<template>
  <main>
    <div class="loginpage">

      <AppLogo cls="banner" />

      <div class="alert alert-danger" v-if="!toolIsOpen">
        The ePrescribing Risk and Safety Evaluation tool (ePRaSE) is currently closed to users.  Access possible for admins only.
      </div>

      <div v-if="toolIsOpen && multipleSessions">
        <table class="table table-striped vf-col-12">
          <thead>
            <tr>
              <th class="align-content-center" colspan="9">You have ePRaSE sessions open on other devices - please choose what to do</th>
            </tr>
            <tr>
              <th>Login time</th>
              <th>Mins since active</th>
              <th>Device type</th>
              <th>Browser</th>
              <th>OS name</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in nonCurrentSessions">
              <td>{{ convertDate(s.loginTime, true) }}</td>
              <td>{{ s.minutesSinceActive }}</td>
              <td>{{ s.deviceType }}</td>
              <td>{{ s.browserName }}</td>
              <td>{{ s.osName }}</td>
            </tr>                            
          </tbody>
        </table>
        <Vueform ref="loginDisambiguateForm" :endpoint="false">
          <GroupElement name="buttonBar" :columns="12" :add-class="'mt-2'">
            <ButtonElement name="submit" full
              :columns="6" 
              :add-class="'me-2'" 
              data-bs-toggle="modal" data-bs-target="#logoutCurrentSessionModal"
            >
              <i class="bi bi-box-arrow-right me-2"></i>Log out this session 
            </ButtonElement>
            <ButtonElement name="reset" full 
              :columns="6" 
              :add-class="'ms-2'" 
              data-bs-toggle="modal" data-bs-target="#logoutOtherSessionsModal"
            >
              <i class="bi bi-box-arrow-right me-2"></i>Log out other sessions
            </ButtonElement>           
          </GroupElement>
        </Vueform>  
        <LogoutCurrentSessionModal ref="logoutCurrentSessionModal" :showActionBtn="true" @modal-actioned="logoutCurrentSession()" />
        <LogoutOtherSessionsModal ref="logoutOtherSessionsModal" :showActionBtn="true" @modal-actioned="logoutOtherSessions()" />
      </div>

      <div v-if="toolIsOpen && !multipleSessions">
        <h3 v-if="$route.query.action === 'loggedOut'" class="text-success">You have successfully logged out</h3>
        <h3 v-if="$route.query.action === 'registered'" class="text-success">Registration successful, please sign in</h3>
        <h3 v-if="$route.query.action === 'changedPassword'" class="text-success">Successfully changed your password, please sign in again</h3>
        <h3 v-if="$route.query.action === 'sessionExpired'" class="text-danger">Your session has expired or has been logged out from another device, please sign in again</h3>
        <h3 v-if="serverError" class="text-danger">{{ serverError }}</h3>

        <h1 class="mt-4">Log-in to ePRaSE</h1>

        <p class="pb-2">
          Please enter your login details below, or click 'Register' to create a new user account.<br>You will need a valid
          <span class="fw-bold">'nhs.uk'</span> or <span class="fw-bold">'nhs.net'</span> email account to register with ePRaSE successfully.
        </p>

        <div class="mb-4">
          <Vueform ref="loginForm" :endpoint="false" @submit="onLoginClick" v-model="user" sync>
            <TextElement name="email" placeholder="Valid NHS email address"
              :label="embolden('Email address', true)" 
              :debounce="200" 
              :messages="{required: 'Email is required'}" 
              :rules="['required', $vueform.rules.nhsEmail]" />
            <TextElement name="password" autocomplete="on"
              :label="embolden('Password', true)"
              :input-type="showPassword ? 'text' : 'password'"            
              :debounce="200" 
              :messages="{required: 'Password is required', between: 'Password must be between 6 and 50 characters long'}" 
              :rules="['required', 'between:6,50']">
              <template #addon-after="scope">
                <i style="cursor:pointer" @click="togglePasswordVisibility"
                  :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'" 
                  :title="(showPassword ? 'Hide' : 'Show') + ' password'"></i>
              </template>
            </TextElement>
            <GroupElement name="buttonBar" :columns="12" :add-class="'mt-2'">
              <ButtonElement name="submit" full
                :columns="3" 
                :add-class="'me-2'" 
                :submits="true">
                <i class="bi bi-person-circle me-2"></i>Log in
              </ButtonElement>
              <ButtonElement name="reset" full 
                :columns="3" 
                :add-class="'mx-2'" 
                :resets="true">
                <i class="bi bi-x-circle-fill me-2"></i>Clear form
              </ButtonElement>
              <ButtonElement name="register" full 
                :columns="3" 
                :add-class="'mx-2'" 
                :disabled="onStaging || $route.query.action === 'registered'" 
                @click="onRegisterClick">
                <i class="bi bi-person-fill-add me-2"></i>Register
              </ButtonElement>
              <ButtonElement name="forgotpassword" full 
                data-bs-toggle="modal" data-bs-target="#forgotPasswordModal"
                :columns="3" 
                :add-class="'ms-2'"               
                :disabled="$route.query.action === 'registered'"> 
                <i class="bi bi-key-fill me-2"></i>Forgot password?
              </ButtonElement>
              <ForgotPasswordModal ref="forgotPasswordModal" />
            </GroupElement>
          </Vueform>
        </div>
      </div>      
    </div>    
  </main>
</template>

<script>
import { mapState } from 'pinia'
import AppLogo from './AppLogo'
import { usernameFromEmail, isStagingSite, isoToUkDate } from '../helpers/utils'
import ForgotPasswordModal from './modals/ForgotPasswordModal'
import { authenticationStore } from '../stores/authentication'
import { rootStore } from '../stores/root'
import { assessmentStore } from '../stores/assessment'
import LogoutCurrentSessionModal from './modals/LogoutCurrentSessionModal.vue'
import LogoutOtherSessionsModal from './modals/LogoutOtherSessionsModal.vue'
import { appSettingsStore } from '../stores/appSettings'

export default {
  name: 'AppLogin',
  components: {
    AppLogo,
    ForgotPasswordModal,
    LogoutCurrentSessionModal,
    LogoutOtherSessionsModal
  },
  computed: {
    ...mapState(authenticationStore, ['login', 'clear', 'isReporter', 'getAllSessions', 'terminateSession']),
    ...mapState(rootStore, ['audit', 'toolOpen']),
    ...mapState(assessmentStore, ['reset', 'setLoggingOut']),
    ...mapState(appSettingsStore, ['sessionTimeout']),
    onStaging() {
      return isStagingSite()
    },
    nonCurrentSessions() {
      return this.sessions.filter(sess => (sess.isCurrentSession === false && sess.isTrulyActive === true && sess.logoutTime == null && sess.minutesSinceActive < parseInt(this.sessionTimeout/60)))
    }
  },
  data() {
    return {
      user: {
        email: '',
        username: '',
        password: '',
      },
      showPassword: false,
      serverError: false,
      toolIsOpen: false,
      sessions: [],
      multipleSessions: false
    }
  },
  methods: {
    convertDate(d, useTime) {
      return isoToUkDate(d, useTime)
    },
    logoutCurrentSession() {
      this.setLoggingOut(true)
      this.$router.push('/logout')
    },
    async logoutOtherSessions() {
      this.nonCurrentSessions.forEach(async ncs => {
        console.debug('Terminate session', ncs)
        let result = await this.terminateSession(ncs.documentId)
        if (!result) {
          console.warn('Failed to delete session with id', ncs.sessionId)
        }
      })
      if (this.isReporter()) {
        this.$router.push('/assessment-dashboard')
      } else {
        this.$router.push('/assessment')
      }
    },
    onLoginClick(form$) {

      console.group('onLoginClick()')
      console.debug('Login form', form$)

      this.serverError = false
  
      form$.validate().then(async () => {
        if (!form$.hasErrors) {
          // Do the signin
          console.debug('Validation completed successfully')
          const signinResponse = await this.login(usernameFromEmail(this.user.email), this.user.password)
          if (signinResponse.status < 400) {
            console.debug('Successful signin')
            if (this.isReporter()) {
              await this.audit('reporter-login:' + this.user.email, '/login')
              this.$router.push('/assessment-dashboard')
            } else {
              await this.audit('login:' + this.user.email, '/login')              
              this.sessions = await this.getAllSessions()
              console.debug('Number of active sessions in addition to current', this.nonCurrentSessions.length)
              if (this.sessions === false) {
                throw new Error('Logged in, but no sessions found - not sure what happened here!')
              } else if (this.nonCurrentSessions.length >= 1) {
                // Disambiguate the case of multiple sessions
                this.multipleSessions = true
              } else {
                this.$router.push('/assessment')
              }              
            }             
          } else {
            console.debug(signinResponse)
            this.serverError = 'An error occured during signin: ' + signinResponse.message
            await this.audit('loginfail:' + this.user.email, '/login')
            this.clear()
          }
        }
      })      
      console.groupEnd()
    },   
    onRegisterClick() {
      this.$router.push('/register')
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword
    }
  },
  async mounted() {
    // Clear any assessment data that may be around
    this.clear()
    this.toolIsOpen = await this.toolOpen()
  }
}
</script>

<style scoped>
div.loginpage {
  max-width: 60%;
  margin: auto;
}
</style>
