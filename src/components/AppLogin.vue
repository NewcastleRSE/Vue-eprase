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

      <Form ref="loginForm" v-slot="{ meta, errors }">
        <div class="mb-4 row">
          <label for="email" class="col-sm-4 form-label">E-mail Address:</label>
          <div class="col-sm-8">
            <Field type="email" v-model="user.email" id="email" name="email" class="form-control"
              rules="required|nhsEmail" :class="meta.dirty ? (errors.email ? 'is-invalid' : 'is-valid') : ''" />
          </div>
          <ErrorMessage name="email" as="div" class="mt-2 text-danger text-center col-sm-12" v-slot="{ message }">
            {{ message }}
          </ErrorMessage>
        </div>
        <div class="mb-4 row">
          <label for="password" class="col-sm-4 form-label">Password:</label>
          <div class="col-sm-8">
            <Field type="password" v-model="user.password" class="form-control" name="password"
              rules="required|lengthBetween:6,50"
              :class="meta.dirty ? (errors.password ? 'is-invalid' : 'is-valid') : ''" />
          </div>
          <ErrorMessage name="password" as="div" class="mt-2 text-danger text-center col-sm-12" v-slot="{ message }">
            {{ message }}
          </ErrorMessage>
        </div>
        <div class="mb-4">
          <button type="submit" :disabled="!meta.valid" class="btn btn-lg btn-primary me-3" @click="onLoginClick">
            Login
          </button>
          <button type="reset" class="btn btn-lg btn-primary me-3" @click="onResetClick">
            Cancel
          </button>
          <button type="button" class="btn btn-lg btn-primary" @click="onRegisterClick">
            Register
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
import { markRaw } from 'vue'
import { mapStores } from 'pinia'
import AppLogo from "./AppLogo"
import { Form, Field, ErrorMessage } from 'vee-validate'
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
    ...mapStores(authenticationStore)
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

      this.user.username = this.user.email.split('@').shift()
      this.$refs.loginForm.validate().then((valid) => {
        console.log('Form submission valid', valid)
        if (valid) {
          const username = this.user.username
          const password = this.user.password
          console.debug('Username', username, 'password', password)
          try {
            this.authenticationStore.login(username, password).then((userId) => {
              this.authenticationStore.checkIsAdminUser(userId).then((isAdmin) => {
                if (isAdmin) {
                  this.$router.push('/adminhome')
                } else {
                  this.$router.push('/assessmentintro')
                }
              })
            })
          } catch (err) {
            console.error(err)
          }
        }
      })
      console.groupEnd()
    },
    onResetClick() {
      this.$refs.loginForm.resetForm()
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
