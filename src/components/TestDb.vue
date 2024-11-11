<template>
<div v-if="isDebug" class="w-50">
  <h4 class="pb-2">This page is for developers to generate test data</h4>
  <p>It should NOT be visible on the live system under any circumstances!</p>
  <Form ref="testDbForm">
    <div class="mb-4 row">
      <label for="nusers" class="col-sm-4 form-label">Number of test users:</label>
      <div class="col-sm-8">
        <Field v-model="nusers" name="nusers">
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
  <div class="accordion" id="progressRecord">
    <div class="accordion-item" v-for="ntest in nusers">
      <h2 class="accordion-header">
        <button class="accordion-button" type="button" data-bs-toggle="collapse" :data-bs-target="'rec' + ntest">
          {{  }}
        </button>
      </h2>
      <div :id="'rec' + ntest" class="accordion-collapse collapse" :class="genIdx == ntest ? 'show' : ''" data-bs-parent="#progressRecord">
        <div class="accordion-body">
          <strong>This is the first item's accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
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
import { rootStore } from '../stores/root';
import { authenticationStore } from '../stores/authentication'

export default {
  name: "TestDb",
  computed: {
    ...mapStores(rootStore, authenticationStore),
    isDebug() {
      return process.env.DEBUG === true
    },
  },  
  data() {
    return {
      genIdx: 0,
      nusers: 10,
      nuserOptions: [10, 20, 50, 100, 200],
      institutions: []
    }
  },
  methods: {  
    generateData() {
      // Generate the required number of random users
      for (let i = 0; i < this.nusers; i++) {
        let inst = this.randomInstitition()
        let email = faker.internet.email({provider: this.randomNhsDomain()})
        let ret = authenticationStore().signup(email.split('@').shift(), inst.id, email, faker.internet.password({length: 12}))
        if (ret.status == 'ok') {
          //TODO
        } else {

        }
      }
    },    
    randomInstitition() {
      return this.institutions[Math.floor(Math.random() * (this.institutions.length + 1)) + 1]
    },
    randomNhsDomain() {
      return ['nhs.net', 'nhs.uk'][Math.random < 0.5 ? 0 : 1]
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