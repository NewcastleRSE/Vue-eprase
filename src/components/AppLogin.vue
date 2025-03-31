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
          <TextElement name="email" label="Email address" placeholder="Valid NHS email address" 
            :debounce="1000" 
            :messages="{required: 'Email is required'}" 
            :rules="['required', nhsEmail]" />
          <TextElement name="password" label="Password" autocomplete="on"
            :input-type="showPassword ? 'text' : 'password'"            
            :debounce="1000" 
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
              {{ buttonLabel('login', 'Log in', 'me-2') }}
            </ButtonElement>
            <ButtonElement name="reset" full 
              :columns="3" 
              :add-class="'mx-2'" 
              :resets="true">
              {{ buttonLabel('reset', 'Clear form', 'me-2') }}
            </ButtonElement>
            <ButtonElement name="register" full 
              :columns="3" 
              :add-class="'mx-2'" 
              :disabled="$route.query.action === 'registered'" 
              @click="onRegisterClick">
              {{ buttonLabel('register', 'Register', 'me-2') }}
            </ButtonElement>
            <ButtonElement name="forgotpassword" full 
              :columns="3" 
              :add-class="'ms-2'" 
              :disabled="$route.query.action === 'registered'" 
              @click="onForgotPasswordClick">
              {{ buttonLabel('forgotPassword', 'Forgot password', 'me-2') }}
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
import { validateNHSEmail, usernameFromEmail, buttonLabel } from '../helpers/utils'
import { authenticationStore } from '../stores/authentication'
import { rootStore } from '../stores/root'
import { Validator } from '@vueform/vueform'

const nhsEmail = class extends Validator {
  get msg( ){ 
    return 'Must be a valid nhs.net or nhs.uk email address'
  }
  check(value) {
    return validateNHSEmail(value)
  }
}

export default {
  name: "AppLogin",
  components: {
    AppLogo
  },
  computed: {
    ...mapState(authenticationStore, ['login', 'clear']),
    ...mapState(rootStore, ['audit'])
  },
  data() {
    return {
      nhsEmail,    
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
          const signinResponse = await authenticationStore().login(usernameFromEmail(this.user.email), this.user.password)
          if (signinResponse.status < 400) {
            console.debug('Successful signin')
            await rootStore().audit('login:' + this.user.email, '/login')
          } else {
            this.serverError = 'An error occured during signin:' + signinResponse.message
            await rootStore().audit('loginfail:' + this.user.email, '/login')
            authenticationStore().clear()
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
  }
}
</script>

<style scoped>
div.loginpage {
  max-width: 60%;
  margin: auto;
}
</style>
