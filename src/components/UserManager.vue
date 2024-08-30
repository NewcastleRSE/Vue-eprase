<template>
  <main class="leftalign">

    <div class="pills-banner"><img src="../assets/images/pills-bw.png" alt="banner graphic"></div>

    <LoginInfo />

    <h1 class="px-4">User Management</h1>
    <div class="px-4">
      <h3>Search for user</h3>
      <Form ref="userSearchForm" v-slot="{ meta: formMeta }" :validation-schema="validationSchema">

        <div class="mb-4 row">
          <label for="email" class="col-sm-4 form-label">E-mail Address or Username (optional):</label>
          <div class="col-sm-8">
            <Field v-slot="{ field, meta }" v-model="user" id="user" name="user">
              <input v-bind="field" type="text" class="form-control"
                :class="meta.dirty ? (meta.valid ? 'is-valid' : 'is-invalid') : ''" />
            </Field>
          </div>
          <ErrorMessage name="user" as="div" class="mt-2 text-danger text-center col-sm-12" v-slot="{ message }">
            {{ message }}
          </ErrorMessage>
        </div>

        <div class="mb-4 row">
          <label for="institution" class="col-sm-4 form-label">Institution name (optional):</label>
          <div class="col-sm-8">
            <Field v-slot="{ field, meta }" v-model="institution" id="institution" name="institution">
              <select v-bind="field" class="form-select" :class="meta.dirty ? (meta.valid ? 'is-valid' : 'is-invalid') : ''">
                <option value="">All institutions</option>
                <option v-for="inst in institutions" :key="inst.id" :value="inst.id">{{ inst.orgName }}</option>
              </select>                  
            </Field>
          </div>
          <ErrorMessage name="institution" as="div" class="mt-2 text-danger text-center col-sm-12"
            v-slot="{ message }">
            {{ message }}
          </ErrorMessage>
        </div>

        <div class="mb-4">
          <button type="button" :disabled="!formMeta.valid" class="btn btn-lg btn-primary me-3"
            @click="onSearchClick">
            <i class="bi bi-search pe-1"></i>Search
          </button>
          <button type="reset" class="btn btn-lg btn-primary me-3" @click="onResetClick">
            <i class="bi bi-x pe-1"></i>Clear
          </button>
        </div>

      </Form>

      <div v-if="searchLive">
      
        <div v-if="searchResults.length == 0" class="bg-warning-subtle p-4 mb-4">
          No users matched your search
        </div>

        <div v-if="searchResults.length != 0">
          <h4>Search results</h4>
          <table class="table table-bordered table-striped mb-4">
            <thead>        
              <tr>            
                <th scope="col" class="col-3">Email</th>
                <th scope="col" class="col-4">Institution</th>
                <th scope="col" class="col-3">Password</th>
                <th scope="col" class="col-1">Enabled</th>
                <th scope="col" class="col-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="userData in searchResults" :key="id">
                <td v-if="currentEdit.id != userData.id">{{ userData.email }}</td>
                <td v-if="currentEdit.id == userData.id">
                  <div>
                    <Field v-slot="{ field, meta }" v-model="currentEdit.email" id="current-edit-email" name="current-edit-email">
                      <input v-bind="field" type="email" class="form-control" :class="meta.dirty ? (meta.valid ? 'is-valid' : 'is-invalid') : ''" />
                    </Field>
                  </div>
                  <ErrorMessage name="current-edit-email" as="div" class="mt-2 text-danger" v-slot="{ message }">
                    {{ message }}
                  </ErrorMessage>
                </td>
                <td v-if="currentEdit.id != userData.id">{{ userData.institution.orgName }}</td>
                <td v-if="currentEdit.id == userData.id">
                  <div>
                    <Field v-slot="{ field, meta }" v-model="currentEdit.institution.id" id="current-edit-institution_id" name="current-edit-institution_id">
                      <select v-bind="field" class="form-select" :class="meta.dirty ? (meta.valid ? 'is-valid' : 'is-invalid') : ''">
                        <option v-for="inst in institutions" :key="inst.id" :value="inst.id">{{ inst.orgName }}</option>
                      </select>                  
                    </Field>
                  </div>
                  <ErrorMessage name="current-edit-institution_id" as="div" class="mt-2 text-danger" v-slot="{ message }">
                    {{ message }}
                  </ErrorMessage>
                </td>
                <td v-if="currentEdit.id != userData.id">&nbsp;</td>
                <td v-if="currentEdit.id == userData.id">
                  <div>
                    <Field v-slot="{ field, meta }" v-model="currentEdit.password" id="current-edit-password" name="current-edit-password">
                      <input v-bind="field" type="password" class="form-control" placeholder="New password"
                        :class="meta.dirty ? (meta.valid ? 'is-valid' : 'is-invalid') : ''" />
                    </Field>
                  </div>
                  <ErrorMessage name="current-edit-password" as="div" class="mt-2 text-danger" v-slot="{ message }">
                    {{ message }}
                  </ErrorMessage>
                  <div class="mt-2">
                    <Field v-slot="{ field, meta }" v-model="currentEdit.confirmPassword" id="current-edit-confirmPassword" name="current-edit-confirmPassword">
                      <input v-bind="field" type="password" class="form-control" placeholder="Confirm new password"
                        :class="meta.dirty ? (meta.valid ? 'is-valid' : 'is-invalid') : ''" />
                    </Field>
                  </div>
                  <ErrorMessage name="current-edit-confirmPassword" as="div" class="mt-2 text-danger text-center" v-slot="{ message }">
                    {{ message }}
                  </ErrorMessage>
                </td>
                <td v-if="currentEdit.id != userData.id">
                  <i class="fs-3" :class="userData.enabled ? 'bi bi-check-square-fill text-success' : 'bi bi-x-square-fill text-danger'"></i>
                </td>
                <td v-if="currentEdit.id == userData.id">
                  <div class="form-check form-switch"><input class="form-check-input" type="checkbox" role="switch" v-model="currentEdit.enabled" :checked="userData.enabled"></div>
                </td>
                <td>
                  <a v-if="currentEdit.id != userData.id" type="button" class="btn btn-sm btn-primary me-2" @click="setCurrentEdit(userData)" data-bs-toggle="tooltip" title="Edit user">
                    <i class="bi bi-pencil-fill pe-1"></i>
                  </a>
                  <a v-if="currentEdit.id == userData.id" type="button" class="btn btn-sm btn-primary me-2" data-bs-toggle="tooltip" title="Save edits">
                    <i class="bi bi-floppy-fill"></i>
                  </a>
                  <a type="button" class="btn btn-sm btn-danger" data-bs-toggle="tooltip" title="Delete user"><i class="bi bi-trash3"></i></a>              
                </td>
              </tr>
            </tbody>
          </table>
        </div>    
      </div>
    </div>
    <ErrorAlertModal ref="errorAlertModal" />
    <AppLogo cls="bottomright" />
  </main>
</template>

<script>

import AppLogo from "./AppLogo"
import LoginInfo from "./LoginInfo"
import ErrorAlertModal from "./ErrorAlertModal"
import { mapStores, mapState } from 'pinia'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { authenticationStore } from '../stores/authentication'
import { rootStore } from '../stores/root'
import { appSettingsStore } from '../stores/appSettings'

export default {
  name: "AppRegister",
  components: {
    Form,
    Field,
    ErrorMessage,
    LoginInfo,
    AppLogo,
    ErrorAlertModal
  },
  computed: {
    ...mapState(appSettingsStore, ['appOpen']),
    ...mapStores(authenticationStore, rootStore),
    unsetEdit() {
      return {
        id: 0,
        email: '',
        enabled: true,
        password: '',
        confirmPassword: '',
        username: '',
        institution: {
          id: -1
        }
      }
    },
    pillsImage() {
      return '../assets/images/pills-bw.png'
    },
    errorAlertModal() {
      return this.$refs.errorAlertModal
    }
  },
  data() {
    return {
      validationSchema: {
        'user': (value) => {
          if (!value) return true
          if (value.includes('@')) {
            return value.match(/^[a-zA-Z0-9-.]+@([a-z]+.|)nhs.(uk|net)+$/) ? true : 'Must be a valid NHS email'
          } else {
            return value.match(/^[a-zA-Z0-9-.]+$/) ? true : 'Must be a valid username'
          }
        }
      },
      user: '',
      institution: '',        
      institutions: [],
      searchLive: false,
      searchResults: [],
      currentEdit: null
    }
  },
  methods: {
    setCurrentEdit(userData) {
      this.currentEdit = userData
    },
    onResetClick() {
      this.$refs.userSearchForm.resetForm()
      this.currentEdit = this.unsetEdit
      this.searchResults = []
      this.searchLive = false
    },
    async onSearchClick() {

      console.group('onSearchClick()')

      this.searchLive = true
      this.currentEdit = this.unsetEdit
      const response = await authenticationStore().findUsers(this.user, this.institution)
      this.searchResults = response.data
      
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
    },
    reportError(message) {
      this.errorAlertModal(message)
    }
  },
  mounted() {
    this.getInstitutions()   
  }
}

</script>

<style scoped></style>