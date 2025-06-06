<template>
  <main>

    <div class="registerpage">

      <AppLogo cls="banner" />
      <div class="register-text">
        <h1 class="mt-4">Register</h1>

        <div v-if="!appOpen">
          <span class="fw-bold">This application is currently closed</span>
        </div>

        <div v-if="appOpen">

          <p class="pb-2">To register with the ePRaSE system, please provide the following information. You will need a valid <span class="fw-bold">'nhs.uk'</span> or <span class="fw-bold">'nhs.net'</span> email account to register with ePRaSE successfully.
      </p>

          <Form ref="regForm" v-slot="{ meta: formMeta }" :validation-schema="validationSchema">

            <div class="mb-4 row">
              <label for="email" class="col-sm-4 form-label">E-mail Address:</label>
              <div class="col-sm-8">
                <Field v-slot="{ field, meta }" v-model="user.email" name="email">
                  <input v-bind="field" id="email" type="email" class="form-control"
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
                <Field v-slot="{ field, meta }" v-model="user.institution" name="institution">
                  <select v-bind="field" id="institution" class="form-select" :class="meta.dirty ? (meta.valid ? 'is-valid' : 'is-invalid') : ''">
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
                <Field v-slot="{ field, meta }" v-model="user.password" name="password">
                  <input v-bind="field" id="password" type="password" class="form-control"
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
                <Field v-slot="{ field, meta }" v-model="user.confirmPassword" name="confirmPassword">
                  <input v-bind="field" id="confirmPassword"  type="password" class="form-control"
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
      validationSchema: {
        'email': 'required|nhsEmail',
        'institution': 'required',
        'password': 'required|lengthBetween:6,50',
        'confirmPassword': 'required|lengthBetween:6,50|passwordConfirmationEqual:@password'
      },
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
              let message = response.message
              if (response.message == 'too-many-users') {
                message = 'Maximum quota of users (4) exceeded for this organisation'
              } else if (response.message == 'email-taken') {
                message = 'This email address is already in use'
              }
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
