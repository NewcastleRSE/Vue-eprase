<template>
  <main class="leftalign">

    <div class="pills-banner"><img src="../assets/images/pills-bw.png" alt="banner graphic"></div>

    <LoginInfo />

    <h1 class="px-4">User Management</h1>
    <div class="px-4">
      <h3>Search for user</h3>
      <Form ref="userSearchForm" v-slot="{ meta: formMeta }" :validation-schema="searchValidationSchema">

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
              <select v-bind="field" class="form-select"
                :class="meta.dirty ? (meta.valid ? 'is-valid' : 'is-invalid') : ''">
                <option value="">All institutions</option>
                <option v-for="inst in institutions" :key="inst.id" :value="inst.id">{{ inst.orgName }}</option>
              </select>
            </Field>
          </div>
          <ErrorMessage name="institution" as="div" class="mt-2 text-danger text-center col-sm-12" v-slot="{ message }">
            {{ message }}
          </ErrorMessage>
        </div>

        <div class="mb-4">
          <button type="button" :disabled="!formMeta.valid" class="btn btn-lg btn-primary me-3" @click="onSearchClick">
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
          <Form ref="userEditForm" v-slot="{ meta: formMeta }" :validation-schema="editValidationSchema">
            <input type="hidden" name="current-edit-id" v-model="currentEdit.id">
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
                <tr v-for="userData in searchResults">
                  <td v-if="currentEdit.id != userData.id">{{ userData.email }}</td>
                  <td v-if="currentEdit.id == userData.id">
                    <div>
                      <Field v-slot="{ field, meta }" v-model="currentEdit.email" id="current-edit-email"
                        name="current-edit-email">
                        <input v-bind="field" type="email" class="form-control"
                          :class="meta.dirty ? (meta.valid ? 'is-valid' : 'is-invalid') : ''" />
                      </Field>
                    </div>
                    <ErrorMessage name="current-edit-email" as="div" class="mt-2 text-danger" v-slot="{ message }">
                      {{ message }}
                    </ErrorMessage>
                  </td>
                  <td v-if="currentEdit.id != userData.id">{{ userData.institution.orgName }}</td>
                  <td v-if="currentEdit.id == userData.id">
                    <div>
                      <Field v-slot="{ field, meta }" v-model="currentEdit.institution.id"
                        id="current-edit-institution_id" name="current-edit-institution_id">
                        <select v-bind="field" class="form-select"
                          :class="meta.dirty ? (meta.valid ? 'is-valid' : 'is-invalid') : ''">
                          <option v-for="inst in institutions" :key="inst.id" :value="inst.id">{{ inst.orgName }}
                          </option>
                        </select>
                      </Field>
                    </div>
                    <ErrorMessage name="current-edit-institution_id" as="div" class="mt-2 text-danger"
                      v-slot="{ message }">
                      {{ message }}
                    </ErrorMessage>
                  </td>
                  <td v-if="currentEdit.id != userData.id">&nbsp;</td>
                  <td v-if="currentEdit.id == userData.id">
                    <div>
                      <Field v-slot="{ field, meta }" v-model="currentEdit.password" id="current-edit-password"
                        name="current-edit-password">
                        <input v-bind="field" type="password" class="form-control" placeholder="New password"
                          :class="meta.dirty ? (meta.valid ? 'is-valid' : 'is-invalid') : ''" />
                      </Field>
                    </div>
                    <ErrorMessage name="current-edit-password" as="div" class="mt-2 text-danger" v-slot="{ message }">
                      {{ message }}
                    </ErrorMessage>
                    <div class="mt-2">
                      <Field v-slot="{ field, meta }" v-model="currentEdit.confirmPassword"
                        id="current-edit-confirmPassword" name="current-edit-confirmPassword">
                        <input v-bind="field" type="password" class="form-control" placeholder="Confirm new password"
                          :class="meta.dirty ? (meta.valid ? 'is-valid' : 'is-invalid') : ''" />
                      </Field>
                    </div>
                    <ErrorMessage name="current-edit-confirmPassword" as="div" class="mt-2 text-danger text-center"
                      v-slot="{ message }">
                      {{ message }}
                    </ErrorMessage>
                  </td>
                  <td v-if="currentEdit.id != userData.id">
                    <i class="fs-3"
                      :class="userData.enabled ? 'bi bi-check-square-fill text-success' : 'bi bi-x-square-fill text-danger'"></i>
                  </td>
                  <td v-if="currentEdit.id == userData.id">
                    <div class="form-check form-switch"><input class="form-check-input" type="checkbox" role="switch"
                        v-model="currentEdit.enabled" :checked="userData.enabled"></div>
                  </td>
                  <td>
                    <a v-if="currentEdit.id != userData.id" type="button" class="btn btn-primary me-2"
                      @click="setCurrentEdit(userData)" title="Edit user">
                      <i class="fs-4 bi bi-pencil-fill pe-1"></i>
                    </a>
                    <a v-if="currentEdit.id == userData.id" type="button" ref="saveBtn" class="btn btn-primary me-2"
                      @click="updateUser" title="Save edits">
                      <i class="fs-4 bi bi-floppy-fill"></i>
                    </a>
                    <a v-if="currentEdit.id != userData.id" type="button" class="btn btn-danger"
                      @click="confirmDeleteModal.show()" title="Delete user" :class="userData.id == currentUserId ? { 'disabled': 'disabled' } : ''">
                      <i class="fs-4 bi bi-trash3"></i>
                    </a>
                    <a v-if="currentEdit.id == userData.id" type="button" class="btn btn-warning"
                      @click="confirmCancelEditModal.show()" title="Cancel edit">
                      <i class="fs-4 bi bi-x"></i>
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </Form>
        </div>
      </div>
    </div>
    <ErrorAlertModal ref="errorAlertModal" />
    <ConfirmCancelEditModal ref="confirmCancelEditModal" :showActionBtn="true" @modal-actioned="cancelCurrentEdit()" />
    <ConfirmDeleteModal ref="confirmDeleteModal" :showActionBtn="true" @modal-actioned="deleteUser()" />
    <AppLogo cls="bottomright" />
  </main>
</template>

<script>

import AppLogo from "./AppLogo"
import LoginInfo from "./LoginInfo"
import ErrorAlertModal from "./ErrorAlertModal"
import ConfirmCancelEditModal from "./ConfirmCancelEditModal"
import ConfirmDeleteModal from "./ConfirmDeleteModal"
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
    ErrorAlertModal,
    ConfirmCancelEditModal,
    ConfirmDeleteModal
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
    currentUserId() {
      return authenticationStore().userId
    },
    pillsImage() {
      return '../assets/images/pills-bw.png'
    },
    errorAlertModal() {
      return this.$refs.errorAlertModal
    },
    confirmCancelEditModal() {
      return this.$refs.confirmCancelEditModal
    },
    confirmDeleteModal() {
      return this.$refs.confirmDeleteModal
    }
  },
  data() {
    return {
      searchValidationSchema: {
        'user': (value) => {
          if (!value) return true
          if (value.includes('@')) {
            return authenticationStore().isValidNHSEmail(value) ? true : 'Must be a valid NHS email'
          } else {
            return value.match(/^[a-zA-Z0-9-.]+$/) ? true : 'Must be a valid username'
          }
        }
      },
      editValidationSchema: {
        'current-edit-id': (value) => {
          return (Number.isInteger(Number(value)) && Number(value) > 0)  ? true : 'User id should be positive integer'
        },
        'current-edit-password': (value) => {
          if (!value) return true
          if (value.length >=6 && value.length <=50) {
            if (this.currentEdit.confirmPassword == value) {
              return true
            } else {
              return 'Password and confirmation not the same'
            }
          } else {
            return 'Password should be between 6 and 50 characters in length'
          }          
        },
        'current-edit-email': (value) => {
          if (!value) return true
          return authenticationStore().isValidNHSEmail(value) ? true : 'Must be a valid NHS email'
        },
        'current-edit-institution_id': (value) => {
          return (Number.isInteger(Number(value)) && Number(value) > 0)  ? true : 'Institution id should be positive integer'
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
    cancelCurrentEdit() {
      this.currentEdit = this.unsetEdit
    },
    async deleteUser() {

      console.group('deleteUser()')
      console.debug('Delete payload is', this.currentEdit)

      const deleteResponse = await authenticationStore().deleteUser(this.currentEdit.id)
      if (deleteResponse.status >= 400) {
        this.errorAlertModal.show(deleteResponse.message)
      }

      console.groupEnd()
    },
    async updateUser() {

      console.group('updateUser()')
      console.debug('Update payload is', this.currentEdit)

      this.$refs.userEditForm.validate().then(async (valid) => {
        if (valid) {
          const updateResponse = await authenticationStore().updateUser(
            this.currentEdit.id, this.currentEdit.email, this.currentEdit.password, this.currentEdit.enabled, this.currentEdit.institution.id
          )
          if (updateResponse.status < 400) {
            this.currentEdit = this.unsetEdit
          } else {
            this.errorAlertModal.show(updateResponse.message)
          }
        }
      })
      console.groupEnd()
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