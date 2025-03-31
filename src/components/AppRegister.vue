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
            <TextElement name="email" label="Email address" placeholder="Valid NHS email address" 
              :debounce="1000" 
              :messages="{required: 'Email is required'}" 
              :rules="['required', nhsEmail]" />
            <SelectElement name="institution" label="Your NHS Trust"
              :native="false" 
              :search="true"
              :track-by="['label', 'value']"
              :items="getInstitutionCodesNames" 
              :messages="{required: 'Institution is required'}" 
              :rules="['required']" />
            <TextElement name="password" label="Password" autocomplete="on"
              :input-type="showPassword ? 'text' : 'password'"            
              :debounce="1000" 
              :messages="{required: 'Password is required', between: 'Password must be between 6 and 50 characters long', confirmed: 'Password and confirmation must be the same'}" 
              :rules="['required', 'between:6,50', 'confirmed']">
              <template #addon-after="scope">
                <i style="cursor:pointer" @click="togglePasswordVisibility(false)"
                  :class="showPassword ? 'bi bi-eye-slash' : 'bi-eye'" 
                  :title="(showPassword ? 'Hide' : 'Show') + ' password'"></i>
              </template>
            </TextElement>
            <TextElement name="password_confirmation" label="Confirm password" autocomplete="on"
              :input-type="showPasswordConfirm ? 'text' : 'password'"            
              :debounce="1000" 
              :messages="{required: 'Password confirmation is required', between: 'Password confirmation must be between 6 and 50 characters long'}" 
              :rules="['required', 'between:6,50']">
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
                {{ buttonLabel('register', 'Register', 'me-2') }}
              </ButtonElement>
              <ButtonElement name="reset" full 
                :columns="3" 
                :resets="true">
                {{ buttonLabel('reset', 'Clear form') }}
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
import { authenticationStore } from '../stores/authentication'
import { rootStore } from '../stores/root'
import { validateNHSEmail, usernameFromEmail } from '../helpers/utils'
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
  name: "AppRegister",
  components: {
    AppLogo
  },
  computed: {
    ...mapState(authenticationStore, ['signup']),
    ...mapState(rootStore, ['getInstitutions'])
  },
  data() {
    return {   
      nhsEmail,   
      user: {
        username: '',
        institution: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
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
          const { username, institution, email, password } = this.user
          const signupResponse = await authenticationStore().signup(username, institution, email, password)
          if (signupResponse.status < 400) {
            console.debug('Successful registration')
            await rootStore().audit('register:' + email, '/register')
            this.$router.push('/login?action=registered')
          } else {
            this.serverError = 'An error occured during registration:' + signupResponse.message
            await rootStore().audit('registerfail:' + email, '/register')
          }
        }
      })      
      console.groupEnd()
    },
    async getInstitutionCodesNames() {
      let institutions = []
      const response = await rootStore().getInstitutions()
      if (response.status < 400) {
        institutions = response.data.data.map(inst => { return { value: inst.id, label: inst.name } })
        institutions.unshift({value: '', label: 'Please select...', disabled: true})        
      } else {
        this.serverError = [response.message]
      }
      return institutions
    },
    togglePasswordVisibility(isConfirm) {
      if (isConfirm) {
        this.showPasswordConfirm = !this.showPasswordConfirm
      } else {
        this.showPassword = !this.showPassword
      }      
    }
  }
}

</script>

<style scoped>
div.registerpage {
  max-width: 60%;
  margin: auto;
}
</style>
