<template>
  <main>
    <div class="loginpage">

      <AppLogo cls="banner" />

      <h3 v-if="$route.query.loggedOut === '1'" class="text-danger">You have successfully logged out</h3>
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
                :class="showPassword ? 'bi bi-eye-slash' : 'bi-eye'" 
                :title="(showPassword ? 'Hide' : 'Show') + ' password'"></i>
            </template>
          </TextElement>
          <GroupElement name="buttonBar" :columns="12" :add-class="'mt-2'">
            <ButtonElement name="submit" :columns="3" full :add-class="'mr-2'" :submits="true">Log in</ButtonElement>
            <ButtonElement name="reset" :columns="3" full :add-class="'mx-2'" :resets="true">Clear form</ButtonElement>
            <ButtonElement name="register" :columns="3" full :add-class="'mx-2'" @click="onRegisterClick">Register</ButtonElement>
            <ButtonElement name="forgotpassword" :columns="3" full :add-class="'ml-2'" @click="onForgotPasswordClick">Forgot password?</ButtonElement>
          </GroupElement>
        </Vueform>
      </div>
    </div>
  </main>
</template>

<script>
import { mapState } from 'pinia'
import AppLogo from './AppLogo'
import { validateNHSEmail, usernameFromEmail } from '../helpers/utils'
import { authenticationStore } from '../stores/authentication'
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
    ...mapState(authenticationStore, ['login'])
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
            // Audit login ok TODO
          } else {
            this.serverError = 'An error occured during signin:' + signinResponse.message
            // Audit login failed
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
