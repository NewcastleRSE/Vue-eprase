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

          <Form ref="regForm" v-slot="{ meta: formMeta }">

            <div class="mb-4 row">
              <label for="email" class="col-sm-4 form-label">E-mail Address:</label>
              <div class="col-sm-8">
                <Field v-slot="{ field, meta }" v-model="user.email" id="email" name="email"
                  rules="required|nhsEmail">
                  <input v-bind="field" type="email" class="form-control"
                    :class="meta.dirty ? (meta.valid ? 'is-valid' : 'is-invalid') : ''" />
                </Field>
              </div>
              <ErrorMessage name="email" as="div" class="mt-2 text-danger text-center col-sm-12" v-slot="{ message }">
                {{ message }}
              </ErrorMessage>
            </div>

            <div class="mb-4 row">
              <label for="institution" class="col-sm-4 form-label">Your NHS Trust:</label>
              <div class="col-sm-8">
                <Field v-slot="{ field, meta }" v-model="user.institution" id="institution" name="institution" 
                  rules="required">
                  <select v-bind="field" class="form-select" :class="meta.dirty ? (meta.valid ? 'is-valid' : 'is-invalid') : ''">
                    <option value="" disabled>Please select...</option>
                    <option v-for="inst in institutions" :key="inst.id" :value="inst.id">{{ inst.orgName }}</option>
                  </select>                  
                </Field>
              </div>
              <ErrorMessage name="institution" as="div" class="mt-2 text-danger text-center col-sm-12"
                v-slot="{ message }">
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

            <div class="mb-4 row">
              <label for="confirmPassword" class="col-sm-4 form-label">Confirm password:</label>
              <div class="col-sm-8">
                <Field v-slot="{ field, meta }" v-model="user.confirmPassword" id="confirmPassword" name="confirmPassword"
                  rules="required|lengthBetween:6,50|passwordConfirmationEqual:@password">
                  <input v-bind="field" type="password" class="form-control"
                    :class="meta.dirty ? (meta.valid ? 'is-valid' : 'is-invalid') : ''" />
                </Field>
              </div>
              <ErrorMessage name="confirmPassword" as="div" class="mt-2 text-danger text-center col-sm-12"
                v-slot="{ message }">
                {{ message }}
              </ErrorMessage>
            </div>

            <div class="mb-4">
              <button type="button" :disabled="!formMeta.valid" class="btn btn-lg btn-primary me-3"
                @click="onRegisterClick">
                Register
              </button>
              <button type="reset" class="btn btn-lg btn-primary me-3" @click="onResetClick">
                Cancel
              </button>
            </div>
          </Form>

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
import { rootStore } from '../stores/root'
import { appSettingsStore } from '../stores/appSettings'

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
    ...mapStores(authenticationStore, rootStore)
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
      this.$refs.regForm.validate().then(async (valid) => {
        console.log('Form submission valid', valid)
        if (valid) {
          const username = this.user.username
          const institution = this.user.institution
          const email = this.user.email
          const password = this.user.password
          
          console.debug('Username', username, 'institution', institution, 'email', email, 'password', password)
          try {
            const response = await this.authenticationStore.signup(username, institution, email, password)
            if (response.status == 'ok') {
              console.log(response)
              this.$router.push('/login')
            } else {
              console.debug('Setting errors...')
              const message = response.message == 'email-taken' ? 'This email address is already in use' : response.message
              this.$refs.regForm.setFieldError('email', message)
            }
          } catch (err) {
            console.error(err)
          }
        }
      })
      console.groupEnd()
    },
    async getInstitutions() {
      console.log(this)
      const response = await rootStore().getInstitutions()
      if (response.status == 200) {
        this.institutions = response.data
      } else {
        this.institutions = [response.message]
        console.error(response.message)
      }      
    }
  },
  mounted() {
    this.getInstitutions()   
  }
}

</script>

<style scoped>
div.registerpage {
  max-width: 60%;
  margin: auto;
}
</style>
