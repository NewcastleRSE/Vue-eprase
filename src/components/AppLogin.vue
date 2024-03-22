<template>
  <main>
    <div class="loginpage">
      <AppLogo cls="banner" />

      <h2 class="mt-4">Log-in to ePRaSE</h2>
      <p class="pb-2">
        Please enter your login details below, or click 'Register' to create a
        new user account. You will need a valid
        <strong>'nhs.uk'</strong> or <strong>'nhs.net'</strong> email account to
        register with ePRaSE successfully.
      </p>

      <Form ref="loginForm" v-slot="{ meta: formMeta }">
        <div v-if="serverError" class="mb-4 row">
          <p class="text-danger text-center col-sm-12">Your login has failed, please check that you are using the correct email and address and password. 
            If your login details continue to fail, please contact the RSE team at: <a href="mailto:rseteam@newcastle.ac.uk">rseteam@newcastle.ac.uk</a>
          </p>
        </div>
        <div class="mb-4 row">
          <label for="email" class="col-sm-4 form-label">E-mail Address:</label>
          <div class="col-sm-8">
            <Field v-slot="{ field, meta }" v-model="user.email" id="email" name="email" rules="required|nhsEmail">
              <input v-bind="field" type="email" class="form-control"
                :class="meta.dirty ? (meta.valid ? 'is-valid' : 'is-invalid') : ''" />
            </Field>
          </div>
          <ErrorMessage name="email" as="div" class="mt-2 text-danger text-center col-sm-12" v-slot="{ message }">
            {{ message }}
          </ErrorMessage>
        </div>
        <div class="mb-4 row">
          <label for="password" class="col-sm-4 form-label">Password:</label>
          <div class="col-sm-8">
            <Field v-slot="{ field, meta }" v-model="user.password" id="password" name="password"
              rules="required|lengthBetween:6,50">
              <input v-bind="field" type="password" class="form-control"
                :class="meta.dirty ? (meta.valid ? 'is-valid' : 'is-invalid') : ''" />
            </Field>
          </div>
          <ErrorMessage name="password" as="div" class="mt-2 text-danger text-center col-sm-12" v-slot="{ message }">
            {{ message }}
          </ErrorMessage>
        </div>
        <div class="mb-4">
          <button type="button" :disabled="!formMeta.valid" class="btn btn-lg btn-primary me-3" @click="onLoginClick">
            Login
          </button>
          <button type="reset" class="btn btn-lg btn-primary me-3" @click="onResetClick">
            Cancel
          </button>         
        </div>
      </Form>
      <p>
        If you have forgotten your password, please contact the RSE team at:
        <a href="mailto:rseteam@newcastle.ac.uk">rseteam@newcastle.ac.uk</a>
      </p>

      <!--<p><a routerLink="">Forgotten your Password? <router-link to="/requestpassword">Click here</router-link></a><br/><br/></p>-->
      <!--<p id="email-link">If you are having difficulty logging in after attempting a password reset, please send an email to <a href="mailto:eprase@newcastle.onmicrosoft.com">eprase@newcastle.onmicrosoft.com</a></p>-->

    </div>
  </main>
</template>

<script>
import { mapStores } from 'pinia'
import AppLogo from "./AppLogo"
import { Form, Field, ErrorMessage } from 'vee-validate'
import { rootStore } from '../stores/root'
import { authenticationStore } from '../stores/authentication'

export default {
  name: "AppLogin",
  components: {
    AppLogo,
    Form,
    Field,
    ErrorMessage,
  },
  computed: {
    ...mapStores(rootStore, authenticationStore)
  },
  data() {
    return {
      user: {
        email: '',
        username: '',
        password: '',
      },
      serverError: false
    }
  },
  methods: {
    onLoginClick() {

      console.group('onLoginClick()')

      this.serverError = false

      this.user.username = this.user.email.split('@').shift()
      this.$refs.loginForm.validate().then(async (valid) => {
        console.log('Form submission valid', valid)
        if (valid) {
          const username = this.user.username
          const password = this.user.password
          console.debug('Username', username, 'password', password)
          const response = await this.authenticationStore.login(username, password)
          if (response.status == 200) {
            const userId = response.data
            rootStore().audit('Successful login', '/login')
            const isAdmin = await this.authenticationStore.checkIsAdminUser(userId)
            if (isAdmin) {
              this.$router.push('/adminhome')
            } else {
              this.$router.push('/assessmentintro')
            }     
          } else { 
            this.serverError = true
            rootStore().failedLoginAudit('Failed login', '/login')
            console.debug('Setting errors...')    
            this.$refs.loginForm.setFieldError('email', 'Unable to log you in - bad username or password')
          }              
        }
      })
      console.groupEnd()
    },
    onResetClick() {
      this.$refs.loginForm.resetForm()
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
