<template>
  <main>

    <div class="changePasswordPage">

      <AppLogo cls="banner" />

        <h3 v-if="serverError" class="text-danger">{{ serverError }}</h3>

        <h1 class="mt-4">Change Your Password</h1>

        <div class="mb-4">
          <Vueform ref="changePassForm" :endpoint="false" @submit="onChangePassClick" v-model="passwordPayload" sync>                        
            <TextElement name="currentPassword" autocomplete="on"
              :label="embolden('Your current password', true)"
              :input-type="showPassword['current'] ? 'text' : 'password'"            
              :debounce="200" 
              :messages="{required: 'Current password is required'}" 
              :rules="['required', $vueform.rules.nhsPassword]">
              <template #addon-after="scope">
                <i style="cursor:pointer" @click="togglePasswordVisibility('current')"
                  :class="showPassword['current'] ? 'bi bi-eye-slash' : 'bi-eye'" 
                  :title="(showPassword['current'] ? 'Hide' : 'Show') + ' password'"></i>
              </template>
            </TextElement>
            <TextElement name="newPassword" autocomplete="on" placeholder="Minimum of 10 characters, at least one uppercase letter, lowercase letter, number, and symbol (e.g., !, %, *)"
              :label="embolden('New password', true)"
              :input-type="showPassword['new'] ? 'text' : 'password'"            
              :debounce="200" 
              :messages="{required: 'New password is required'}" 
              :rules="['required', $vueform.rules.nhsPassword, 'confirmed']">
              <template #addon-after="scope">
                <i style="cursor:pointer" @click="togglePasswordVisibility('new')"
                  :class="showPassword['new'] ? 'bi bi-eye-slash' : 'bi-eye'" 
                  :title="(showPassword['new'] ? 'Hide' : 'Show') + ' password'"></i>
              </template>
            </TextElement>
            <TextElement name="newPassword_confirmation" autocomplete="on" placeholder="Your new password again"
              :label="embolden('Confirm new password', true)"
              :input-type="showPassword['newConfirm'] ? 'text' : 'password'"            
              :debounce="200" 
              :messages="{required: 'New password confirmation is required'}" 
              :rules="['required', $vueform.rules.nhsPassword]">
              <template #addon-after="scope">
                <i style="cursor:pointer" @click="togglePasswordVisibility('newConfirm')"
                  :class="showPassword['newConfirm'] ? 'bi bi-eye-slash' : 'bi-eye'" 
                  :title="(showPassword['newConfirm'] ? 'Hide' : 'Show') + ' password'"></i>
              </template>
            </TextElement>
            <GroupElement name="buttonBar" :columns="12" :add-class="'mt-2'">
              <ButtonElement name="submit" full 
                :columns="4" 
                :add-class="'me-2'" 
                :submits="true">
                <i class="bi bi-person-lock me-2"></i>Change password
              </ButtonElement>
              <ButtonElement name="reset" full 
                :columns="4" 
                :add-class="'me-2'"
                :resets="true">
                <i class="bi bi-x-circle-fill me-2"></i>Clear form
              </ButtonElement>
              <ButtonElement name="cancel" full @click="onCancelClick"
                :columns="4">
                <i class="bi bi bi-backspace-fill me-2"></i>Cancel
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

export default {
  name: 'AppRegister',
  components: {
    AppLogo
  },
  computed: {
    ...mapState(authenticationStore, ['email', 'changePassword']),
    ...mapState(rootStore, ['audit'])
  },
  data() {
    return {         
      passwordPayload: {
        currentPassword: '',
        newPassword: '',
        newPassword_confirmation: ''
      },
      serverError: false,
      showPassword: {
        'current': false,
        'new': false,
        'newConfirm': false
      }
    }
  },
  methods: {    
    onChangePassClick(form$) {

      console.group('onChangePassClick()')
      console.debug('Form', form$)

      this.serverError = false
  
      form$.validate().then(async () => {
        if (!form$.hasErrors) {
          // Do the password change
          console.debug('Validation completed successfully')         
          const changePassResponse = await this.changePassword(this.passwordPayload.currentPassword, this.passwordPayload.newPassword, this.passwordPayload.newPassword_confirmation)
          if (changePassResponse.status < 400) {
            console.debug('Successfully changed password')
            await this.audit('changePassword:' + this.email, '/change-password')
            this.$router.push('/login?action=changedPassword')
          } else {
            this.serverError = 'An error occured while changing your password:' + changePassResponse.message
            await this.audit('changePasswordFail:' + this.email, '/change-password')
          }
        }
      })      
      console.groupEnd()
    },
    onCancelClick() {
      this.$router.push('/assessment')
    },
    togglePasswordVisibility(passwordTag) {
      this.showPassword[passwordTag] = ! this.showPassword[passwordTag]     
    }
  }
}

</script>

<style scoped>
div.changePasswordPage {
  max-width: 60%;
  margin: auto;
}
</style>
