<template>
  <main>

    <div class="registerpage">

      <AppLogo cls="banner" />
      <div class="register-text">
        <h2 class="mt-4">Register</h2>

        <div v-if="!appOpen">
          <strong>This application is currently closed</strong>
        </div>

        <div v-if="appOpen">

          <p class="pb-2">To register with the ePRaSE system, please provide the following information.</p>

          <Form ref="regForm" :validation-schema="validationSchema" v-slot="{ meta, errors }">

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
              <label for="institution" class="col-sm-4 form-label">Your NHS Trust:</label>
              <div class="col-sm-8">
                <Field as="select" v-model="user.institution" id="institution" name="institution" class="form-select"
                  rules="required" :class="meta.dirty ? (errors.institution ? 'is-invalid' : 'is-valid') : ''">
                  <option value="" disabled>Please select...</option>
                  <option v-for="inst in institutions" :key="inst.id" :value="inst.id">{{ inst.orgName }}</option>
                </Field>
              </div>
              <ErrorMessage name="institution" as="div" class="mt-2 text-danger text-center col-sm-12" v-slot="{ message }">
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

            <div class="mb-4 row">
              <label for="confirmPassword" class="col-sm-4 form-label">Confirm password:</label>
              <div class="col-sm-8">
                <Field type="password" v-model="user.confirmPassword" class="form-control" name="confirmPassword"
                  rules="required|lengthBetween:6,50|passwordConfirmationEqual:@password"
                  :class="meta.dirty ? (errors.confirmPassword ? 'is-invalid' : 'is-valid') : ''" />
              </div>
              <ErrorMessage name="confirmPassword" as="div" class="mt-2 text-danger text-center col-sm-12"
                v-slot="{ message }">
                {{ message }}
              </ErrorMessage>
            </div>

            <div class="mb-4">
              <button type="submit" :disabled="!meta.valid" class="btn btn-lg btn-primary me-3" @click="onRegisterClick">
                Register
              </button>
              <button type="reset" class="btn btn-lg btn-primary me-3" @click="onResetClick">
                Cancel
              </button>
            </div>
          </Form>

          <div v-if="serverError === 'too-many-users'" class="warning">Sorry, there is a problem with registration, there
            is a limit of 4 users per institution</div>
          <div v-if="serverError === 'email-taken'" class="warning">This email has already been registered against an
            institution</div>

        </div>

      </div>
    </div>
  </main>
</template>

<script>

import AppLogo from './AppLogo'
import { mapStores, mapState } from 'pinia'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { authenticationStore } from '../stores/authentication'
import { appSettingsStore } from '../stores/appSettings'
import { dataService } from '../services/data.service'

export default {
  name: "AppRegister",
  components: {
    AppLogo,
    Form,
    Field,
    ErrorMessage,
  },
  computed: {
    ...mapState(appSettingsStore, ['appOpen']),
    ...mapStores(authenticationStore)
  },
  data() {
    return {
      user: {
        username: '',
        institution: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
      institutions: [],
      serverError: false
    }
  },
  methods: {
    onResetClick() {
      this.$refs.regForm.resetForm()
    },
    onRegisterClick() {

      console.group('onRegisterClick()')

      this.user.username = this.user.email.split('@').shift()
      this.$refs.regForm.validate().then((valid) => {
        console.log('Form submission valid', valid)
        if (valid) {
          const username = this.user.username
          const password = this.user.password
          const institution = this.user.institution
          console.debug('Username', username, 'password', password, 'institution', institution)
          try {
            this.authenticationStore.signup(username, password, institution).then((userId) => {
              this.$router.push('/login?registered')
            })
          } catch (err) {
            console.error(err)
          }
        }
      })
      console.groupEnd()
    }
  },
  created() {
    dataService.getInstitutions().then(data => {
      this.institutions = data
    })
  }
}

</script>

<style scoped>
div.registerpage {
  max-width: 60%;
  margin: auto;
}
</style>
