<template>
  <main>
    <div class="loginpage">

      <AppLogo cls="banner" />

      <h3 v-if="$route.query.action === 'loggedOut'" class="text-success">You have successfully logged out</h3>
      <h3 v-if="$route.query.action === 'registered'" class="text-success">Registration successful, please sign in</h3>
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
            :debounce="500" 
            :messages="{required: 'Email is required'}" 
            :rules="['required', $vueform.rules.nhsEmail]" />
          <TextElement name="password" autocomplete="on"
            :label="embolden('Password', true)"
            :input-type="showPassword ? 'text' : 'password'"            
            :debounce="500" 
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
              :disabled="$route.query.action === 'registered'" 
              @click="onRegisterClick">
              <i class="bi bi-person-fill-add me-2"></i>Register
            </ButtonElement>
            <ButtonElement name="forgotpassword" full 
              :columns="3" 
              :add-class="'ms-2'" 
              :disabled="$route.query.action === 'registered'" 
              @click="onForgotPasswordClick">
              <i class="bi bi-key-fill me-2"></i>Forgot password?
            </ButtonElement>
          </GroupElement>
        </Vueform>
      </div>
    </div>
  </main>
</template>

<script>
import { mapState } from 'pinia'
import AppLogo from './AppLogo'
import { usernameFromEmail } from '../helpers/utils'
import { authenticationStore } from '../stores/authentication'
import { rootStore } from '../stores/root'
import { assessmentStore } from '../stores/assessment'

export default {
  name: 'AppLogin',
  components: {
    AppLogo
  },
  computed: {
    ...mapState(authenticationStore, ['login', 'clear']),
    ...mapState(rootStore, ['audit']),
    ...mapState(assessmentStore, ['reset'])
  },
  data() {
    return {
      user: {
        email: '',
        username: '',
        password: '',
      },
      showPassword: false,
      serverError: false
    }
  },
  methods: {
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
            await this.audit('login:' + this.user.email, '/login')
            this.$router.push('/')
          } else {
            this.serverError = 'An error occured during signin:' + signinResponse.message
            await this.audit('loginfail:' + this.user.email, '/login')
            this.clear()
          }
        }
      })      
      console.groupEnd()
    },
    onForgotPasswordClick() {
      this.$router.push('/forgotpassword')
    },
    onRegisterClick() {
      this.$router.push('/register')
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword
    }
  },
  mounted() {
    // Clear any assessment data that may be around
    this.reset()
  }
}
</script>

<style scoped>
div.loginpage {
  max-width: 60%;
  margin: auto;
}
</style>
