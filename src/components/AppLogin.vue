<template>
  <main>
    <div class="loginpage">

      <AppLogo cls="banner" />

      <h3 v-if="$route.query.loggedOut === '1'" class="text-danger">You have successfully logged out</h3>

      <h1 class="mt-4">Log-in to ePRaSE</h1>

      <p class="pb-2">
        Please enter your login details below, or click 'Register' to create a new user account.<br>You will need a valid
        <span class="fw-bold">'nhs.uk'</span> or <span class="fw-bold">'nhs.net'</span> email account to register with ePRaSE successfully.
      </p>

      <div class="mb-4">
        <Vueform :endpoint="false" @submit="onLoginClick" v-model="user" sync>
          <TextElement name="email" label="Email address" placeholder="Valid NHS email address" :debounce="1000" :messages="{required: 'Email is required'}" :rules="['required', nhsEmail]" />
          <TextElement name="password" label="Password" :debounce="1000" :messages="{required: 'Password is required'}" :rules="['required']" />
          <GroupElement name="buttonBar" :columns="12">
            <ButtonElement name="submit" :columns="3" full :submits="true">Log in</ButtonElement>
            <ButtonElement name="reset" :columns="3" full :resets="true">Clear form</ButtonElement>
            <ButtonElement name="register" :columns="3" full @click="onRegisterClick">Register</ButtonElement>
            <ButtonElement name="forgotpassword" :columns="3" full @click="onForgotPasswordClick">Forgot password?</ButtonElement>
          </GroupElement>
        </Vueform>
      </div>
    </div>
  </main>
</template>

<script>
import { mapStores } from 'pinia'
import AppLogo from './AppLogo'
import { validateNHSEmail } from '../helpers/utils'
import { rootStore } from '../stores/root'
import { authenticationStore } from '../stores/authentication'
import { Vueform, TextElement, Validator, GroupElement } from '@vueform/vueform'

const nhsEmail = class extends Validator {
  get msg( ){ 
    return 'Must be a valid nhs.net or nhs.uk email address'
  }
  check(value) {
    return validateNHSEmail(value)
  }
}

// HERE
export default {
  name: "AppLogin",
  components: {
    AppLogo
  },
  computed: {
    ...mapStores(rootStore, authenticationStore)
  },
  data() {
    return {
      nhsEmail,
      // validationSchema: {
      //   'email': 'required|nhsEmail',
      //   'password': 'required|lengthBetween:6,50'
      // },
      user: {
        email: '',
        username: '',
        password: '',
      },
      serverError: false,
      loggedOut: false
    }
  },
  methods: {
    onLoginClick(FormData, form$) {

      console.group('onLoginClick()')

      this.serverError = false

      // this.user.username = this.user.email.split('@').shift()
      // this.$refs.loginForm.validate().then(async (valid) => {
      //   console.log('Form submission valid', valid)
      //   if (valid) {
      //     const username = this.user.username
      //     const password = this.user.password
      //     console.debug('Username', username, 'password', password)
      //     const response = await this.authenticationStore.login(username, password)
      //     if (response.status == 200) {
      //       const userId = response.data
      //       rootStore().audit('Successful login', '/login')                        
      //       this.$router.push('/assessmentintro')
      //     } else { 
      //       this.serverError = true
      //       rootStore().failedLoginAudit('Failed login', '/login')
      //     }              
      //   }
      // })
      console.groupEnd()
    },
    onForgotPasswordClick() {
      this.$router.push('/forgotpassword')
    },
    onRegisterClick() {
      this.$router.push('/register')
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
