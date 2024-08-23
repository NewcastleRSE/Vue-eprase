<template>
  <h2>Search for user</h2>
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
            <td>{{ userData.email }}</td>
            <td>{{ userData.institution.orgName }}</td>
            <td>
              <button type="button" disabled="disabled" class="btn btn-sm btn-primary me-2"><i class="bi bi-pencil-fill pe-1"></i>Edit</button>
            </td>
            <td>
              <div class="form-check form-switch"><input class="form-check-input" type="checkbox" role="switch" :id="'enabled-' + userData.id" :checked="userData.enabled"></div>
            </td>
            <td><button type="button" disabled="disabled" class="btn btn-sm btn-primary me-2"><i class="bi bi-floppy-fill pe-1"></i>Save</button></td>
            <td><button type="button" disabled="disabled" class="btn btn-sm btn-danger"><i class="bi bi-x pe-1"></i>Delete</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  
  </div>

</template>

<script>

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
  },
  computed: {
    ...mapState(appSettingsStore, ['appOpen']),
    ...mapStores(authenticationStore, rootStore)
  },
  data() {
    return {
      validationSchema: {
        'user': (value) => {
          if (!value) return true
          if (value.includes('@')) {
            return value.match(/^[a-zA-Z0-9-.]+@([a-z]+.|)nhs.(uk|net)+$/)
          } else {
            return value.match(/^[a-zA-Z0-9-.]+$/)
          }
        }
      },
      user: '',
      institution: '',        
      institutions: [],
      searchLive: false,
      searchResults: []
    }
  },
  methods: {
    onResetClick() {
      this.$refs.userSearchForm.resetForm()
      this.searchLive = false
    },
    async onSearchClick() {

      console.group('onSearchClick()')

      this.searchLive = true
      const response = await authenticationStore().findUsers(this.user, this.institution)
      console.debug(response)
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
    }
  },
  mounted() {
    this.getInstitutions()   
  }
}

</script>

<style scoped></style>