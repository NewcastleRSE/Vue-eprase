<template>
<div v-if="isDebug" class="w-50">
  <h4 class="pb-2">This page is for developers to generate test data</h4>
  <p>It should NOT be visible on the live system under any circumstances!</p>
  <Form ref="testDbForm">
    <div class="mb-4 row">
      <label for="nusers" class="col-sm-4 form-label">Number of test users:</label>
      <div class="col-sm-8">
        <Field v-slot="{ field }" v-model="nusers" name="nusers">
          <select v-bind="field" id="nusers" class="form-select">
            <option v-for="ntest in nuserOptions" :value="ntest">{{ ntest }}</option>
          </select>                  
        </Field>
      </div>      
    </div>
    <div class="mb-4">
      <button type="button" class="btn btn-lg btn-primary me-3" @click="generateData">Generate test data</button>      
    </div>
  </Form>
  <div v-show="generating == true" class="accordion" id="progressRecord">
    <div class="accordion-item" v-for="ntest in nusers" v-show="showProgressRecord(ntest)">
      <h2 class="accordion-header">
        <button class="accordion-button" type="button" data-bs-toggle="collapse" :data-bs-target="'#rec' + ntest">
          {{ `User : ${readProgressRecord(ntest - 1, 'userName') || 'unset'} at ${readProgressRecord(ntest - 1, 'userInst') || 'unset'}` }}
        </button>
      </h2>
      <div :id="'rec' + ntest" :class="genIdx == ntest - 1 ? 'accordion-collapse collapse show' : 'accordion-collapse collapse'" data-bs-parent="#progressRecord">
        <div class="accordion-body">
          <ul class="list-group">
            <li class="list-group-item" :class="progressBackground(ntest - 1, 'createUser')">User creation</li>
            <li class="list-group-item" :class="progressBackground(ntest - 1, 'loggingInUser')">Logging in user</li>
            <li class="list-group-item" :class="progressBackground(ntest - 1, 'genSystem')">Fill in system info</li>
            <li class="list-group-item" :class="progressBackground(ntest - 1, 'genPatients')">Enter patients</li>
            <li class="list-group-item" :class="progressBackground(ntest - 1, 'genScenarios')">Generate scenarios</li>
          </ul>
        </div>
      </div>
    </div>  
  </div>
</div>
<div v-if="! isDebug">
  404 : Not found
</div>

</template>

<script>

import { faker } from '@faker-js/faker'
import { Form, Field } from 'vee-validate'
import { mapStores } from 'pinia'
import { rootStore } from '../stores/root'
import { authenticationStore } from '../stores/authentication'

export default {
  name: "TestDb",
  components: {
    Form,
    Field
  },
  computed: {
    ...mapStores(rootStore, authenticationStore),
    isDebug() {
      return process.env.DEBUG === true
    }
  },  
  data() {
    return {
      genIdx: 0,
      nusers: 10,
      nuserOptions: [10, 20, 50, 100, 200],
      institutions: [],
      generating: false,
      currentGenProgress: [],
      usersPerInstitution: {}
    }
  },
  methods: {  
    generateData() {

      this.generating = true

      // Generate the required number of random users
      for (let i = 0; i < this.nusers; i++) {

        this.currentGenProgress.push(this.initProgressRecord())

        // Basic user data = user signup
        let inst = this.randomInstitition()
        this.setProgressRecord(i, 'userInst', inst.orgName)
        let email = this.randomEmail()
        this.setProgressRecord(i, 'userName', email.split('@').shift())
        this.setProgressRecord(i, 'createUser', 'in progress')
        let ret = authenticationStore().signup(this.readProgressRecord(i, 'userName'), inst.id, email, faker.internet.password({length: 12}))

        if (ret.status == 'ok') {
          console.debug('Status ok')
          this.setProgressRecord(i, 'createUser', 'completed')
        } else {
          this.setProgressRecord(i, 'createUser', 'error')
        }
        this.genIdx++
      }
    }, 
    initProgressRecord() {
      return {
        userName: '',
        userInst: '',
        createUser: 'not started',
        loggingInUser: 'not started',
        genSystem: 'not started',
        genPatients: 'not started',
        genScenarios: 'not started'
      }
    }, 
    showProgressRecord(idx) {
      return this.genIdx >= idx
    },
    readProgressRecord(i, k) {
      if (this.currentGenProgress.length < i + 1) {
        return false
      } else {
        return this.currentGenProgress[i][k]
      }
    }, 
    setProgressRecord(i, k, value) {
      this.currentGenProgress[i][k] = value
    },
    progressBackground(i, k) {  

      console.group('prpogressBackground()')
      console.debug('Received index', i, 'key', k)

      let ret = 'bg-light'
      const rec = this.readProgressRecord(i, k)
      console.debug('rec', rec)

      if (rec != false) {
        switch(rec) {
          case 'completed': ret = 'bg-success'; break
          case 'in progress': ret = 'bg-warning'; break
          case 'error': ret = 'bg-danger'; break
          default: ret = 'bg-light'; break
        }
      }

      console.debug('Returning', ret)
      console.groupEnd()

      return ret
    },
    randomEmail() {
      return faker.internet.email({provider: this.randomNhsDomain(), allowSpecialCharacters: false}).replace('_', '.')
    },  
    randomInstitition() {
      let inst = {}
      // Ensure we never have > 4 users for any given institution and we don't use ZZZTesting
      do {
        inst = this.institutions[Math.floor(Math.random() * (this.institutions.length + 1)) + 1]
      } while (this.usersPerInstitution[inst.id] == 4 || inst.orgName == 'ZZZTesting')
      this.usersPerInstitution[inst.id]++
      return inst
    },
    randomNhsDomain() {
      if (Math.random() < 0.5) {
        return 'nhs.net'
      }
      return 'nhs.uk'
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
    this.usersPerInstitution = Object.fromEntries(this.institutions.map(inst => [inst.id, 0]))
  }
}
</script>

<style scoped></style>