<template>
  <main>

    <div class="registerpage">

      <AppLogo cls="banner" />

        <h3 v-if="serverError" class="text-danger">{{ serverError }}</h3>

        <h1 class="mt-4">Register</h1>

        <p class="pb-2">To register with the ePRaSE system, please provide the following information.<br>
          You will need a valid <span class="fw-bold">'nhs.uk'</span> or <span class="fw-bold">'nhs.net'</span> email
          account to register with ePRaSE successfully.
        </p>

        <div class="mb-4">
          <Vueform ref="registerForm" :endpoint="false" @submit="onRegisterClick" v-model="user" sync>
            <TextElement name="email" placeholder="Valid NHS email address"
              :label="embolden('Email address', true)"
              :debounce="500" 
              :messages="{required: 'Email is required'}" 
              :rules="['required', $vueform.rules.nhsEmail]" />
            <SelectElement name="institution"
              :label="embolden('Your NHS Trust', true)"
              :native="false" 
              :search="true"
              :track-by="['label', 'value']"
              :items="institutions" 
              :messages="{required: 'Institution is required'}" 
              @change="(newVal, oldVal, el$) => {
                const hospital = el$.form$.el$('hospital')
                hospital.clear()
                hospital.updateItems()
              }"
              :rules="['required']" />
            <SelectElement v-if="user.institution != ''" name="hospital"
              :label="embolden('Your hospital site (add manually if not in list)', true)"
              :native="false"
              :search="true"
              :create="true" 
              :append-new-option="true"
              :items="async (query, input) => {
                const institution = input.$parent.el$.form$.el$('institution')
                return getHospitals(institution.value)
              }" 
              :messages="{required: 'Hospital is required'}" 
              :rules="[{ 'required': ['institution', '!=', ''] }]" />
            <TextElement name="password" autocomplete="on"
              :label="embolden('Password', true)"
              :input-type="showPassword ? 'text' : 'password'"            
              :debounce="500" 
              :messages="{required: 'Password is required', between: `Password must be between ${passwordMinLength} and ${passwordMaxLength} characters long`, confirmed: 'Password and confirmation must be the same'}" 
              :rules="['required', `between:${passwordMinLength},${passwordMaxLength}`, 'confirmed']">
              <template #addon-after="scope">
                <i style="cursor:pointer" @click="togglePasswordVisibility(false)"
                  :class="showPassword ? 'bi bi-eye-slash' : 'bi-eye'" 
                  :title="(showPassword ? 'Hide' : 'Show') + ' password'"></i>
              </template>
            </TextElement>
            <TextElement name="password_confirmation" autocomplete="on"
              :label="embolden('Confirm password', true)"
              :input-type="showPasswordConfirm ? 'text' : 'password'"            
              :debounce="500" 
              :messages="{required: 'Password confirmation is required', between: `Password confirmation must be between ${passwordMinLength} and ${passwordMaxLength} characters long`}" 
              :rules="['required', `between:${passwordMinLength},${passwordMaxLength}`]">
              <template #addon-after="scope">
                <i style="cursor:pointer" @click="togglePasswordVisibility(true)"
                  :class="showPasswordConfirm ? 'bi bi-eye-slash' : 'bi-eye'" 
                  :title="(showPasswordConfirm ? 'Hide' : 'Show') + ' password'"></i>
              </template>
            </TextElement>
            <GroupElement name="buttonBar" :columns="12" :add-class="'mt-2'">
              <ButtonElement name="submit" full 
                :columns="3" 
                :add-class="'me-2'" 
                :submits="true">
                <i class="bi bi-person-fill-add me-2"></i>Register
              </ButtonElement>
              <ButtonElement name="reset" full 
                :columns="3" 
                :resets="true">
                <i class="bi bi-x-circle-fill me-2"></i>Clear form
              </ButtonElement>
            </GroupElement>
          </Vueform>
        </div>

      </div>
  </main>
</template>

<script>

import AppLogo from './AppLogo'
import { mapState } from 'pinia'
import { appSettingsStore } from '../stores/appSettings'
import { authenticationStore } from '../stores/authentication'
import { rootStore } from '../stores/root'
import { usernameFromEmail } from '../helpers/utils'

export default {
  name: 'AppRegister',
  components: {
    AppLogo
  },
  computed: {
    ...mapState(authenticationStore, ['signup']),
    ...mapState(rootStore, ['getInstitutions', 'audit']),
    ...mapState(appSettingsStore, ['passwordMinLength', 'passwordMaxLength'])
  },
  data() {
    return {   
      user: {
        username: '',
        institution: '',
        hospital: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
      institutions: [],
      serverError: false,
      showPassword: false,
      showPasswordConfirm: false
    }
  },
  methods: {    
    onRegisterClick(form$) {

      console.group('onRegisterClick()')
      console.debug('Form', form$)

      this.serverError = false
  
      form$.validate().then(async () => {
        if (!form$.hasErrors) {
          // Do the signup
          console.debug('Validation completed successfully')
          this.user.username = usernameFromEmail(this.user.email)
          const { username, institution, hospital, email, password } = this.user
          const signupResponse = await this.signup(username, institution, hospital, email, password)
          if (signupResponse.status < 400) {
            console.debug('Successful registration')
            await this.audit('register:' + email, '/register')
            this.$router.push('/login?action=registered')
          } else {
            this.serverError = 'An error occured during registration:' + signupResponse.message
            await this.audit('registerfail:' + email, '/register')
          }
        }
      })      
      console.groupEnd()
    },
    async getInstitutionCodesNames() {
      const response = await this.getInstitutions()
      if (response.status < 400) {
        this.institutions = response.data.data.map(inst => { return { value: inst.id, label: inst.name, hospitals: inst.hospitals } })
        this.institutions.unshift({value: '', label: 'Please select...', disabled: true})        
      } else {
        this.serverError = [response.message]
      }
    },
    getHospitals(instId) { 
      const hospitals = instId ? this.institutions.filter(inst => inst.value == instId) : []
      return hospitals.length > 0 ? hospitals[0].hospitals : []
    },
    togglePasswordVisibility(isConfirm) {
      if (isConfirm) {
        this.showPasswordConfirm = !this.showPasswordConfirm
      } else {
        this.showPassword = !this.showPassword
      }      
    }
  },
  mounted() {
    this.getInstitutionCodesNames()
  }
}

</script>

<style scoped>
div.registerpage {
  max-width: 60%;
  margin: auto;
}
</style>
