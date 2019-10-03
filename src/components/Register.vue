<template>
  <div>
    <Header />
    <div class="register">

      <div align="center">
        <img src="../assets/logo-full.png" alt="Welcome to the ePRaSE Tool" class="eprase-logo">
      </div>
      <div class="register-text">
        <h1>Register</h1>
        <p>To register with the ePRaSE system, please provide the following information.</p>

        <form id="regForm" @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="name">Name:</label>
            <input type="text" v-model="user.name" v-validate="{required: true, min: 3, max: 50}" id="name" name="name" class="form-control" :class="{ 'is-invalid': errors.has('name') }"  />
            <div v-if="submitted && errors.has('name')" class="invalid-feedback alert alert-danger">{{ errors.first('name') }}</div>
          </div>
          <div class="form-group">
            <label for="username">Username:</label>
            <input type="text" v-model="user.username" v-validate="{required: true, min: 3, max: 50}" id="username" name="username" class="form-control" :class="{ 'is-invalid': errors.has('username') }" />
            <div v-if="submitted && errors.has('username')" class="invalid-feedback alert alert-danger">{{ errors.first('username') }}</div>
          </div>
          <p>Please enter an "nhs.uk" or "nhs.net" email address.</p>
          <div class="form-group">
            <label for="email">E-mail Address:</label>
            <input type="email" v-model="user.email" v-validate="{ required: true, regex:/^[a-zA-Z0-9.]+@([a-z]+.|)nhs.(uk|net)+$/ }" id="email" name="email" class="form-control" :class="{ 'is-invalid':  submitted && errors.has('email') }" />
            <div v-show="submitted && errors.has('email')" class="invalid-feedback alert alert-danger">{{ errors.first('email') }}</div>
          </div>

          <p>Select your NHS trust.</p>
          <div class="form-group">
            <label for="institution"> Select Institution: </label>
            <select name="singleSelect" id ="institution" v-validate="'required'" v-model="user.institution" class="form-control" >
              <option v-for="data in institutions" v-bind:value="data.org_code">{{data.org_name}}</option>
            </select>
          </div>
          <p>Choose a password.</p>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="text" v-model="user.password" v-validate="{ required: true, min: 6 }" id="password" name="password" class="form-control" :class="{ 'is-invalid': errors.has('password') }" ref="password" />
            <div v-show="submitted && errors.has('password')" class="invalid-feedback alert alert-danger">{{ errors.first('password') }}</div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Re-enter Password: </label>
            <input type="text" v-model="user.confirmPassword" id="confirmPassword" name="confirmPassword" class="form-control"  v-validate="'required|confirmed:password'"  data-vv-as="password" >
            <div v-show="submitted && errors.has('confirmPassword')" class="invalid-feedback alert alert-danger">{{ errors.first('confirmPassword') }}</div>
          </div>

          <div class="form-group" align="center">
            <button class="btn btn-primary" :disabled="isFormInvalid">Register</button>
            <button type="button" class="btn btn-primary" @click.prevent="resetForm">Cancel</button>
          </div>
        </form>

      </div>
    </div>
  </div>
</template>

<script>
    import Header from './Header';
    import {HTTP} from '../http-constants';
    import json from '../json/institutions.json'

    export default {
      name: "Register",
      components: {
        Header
      },
      computed: {
        isFormInvalid() {
            return Object.keys(this.fields).some(key => this.fields[key].invalid);
        }
      },
      data() {
        return {
          user: {
            name: '',
            username: '',
            institution: '',
            email: '',
            password: '',
            role: ["user"],
            confirmPassword: '',
          },
          submitted: false,
          institutions: json
        }
      },
      methods: {
        resetForm: function() {
          this.$data.user = {};
          this.errors.clear();
        },
        handleSubmit(e) {
          this.submitted = true;

          this.$validator.validate().then(valid => {
            if (valid) {

              HTTP.post('/auth/signup/user', {

                name: this.user.name,
                username: this.user.username,
                institution: this.user.institution,
                email: this.user.email,
                password: this.user.password,
                role: this.user.role
              })
                .then(response => window.location.href = './login')
                .catch(error => this.errors = error.response.data)
            }
          });
        },

      },
      created() {
          this.institutions.sort(function(a, b) {
              if(a.org_name < b.org_name) return -1;
              if(a.org_name > b.org_name) return 1;
              return 0;
          });
      }
    }

</script>

<style scoped>

  .eprase-logo {
    height: 75px;
  }

  h1 {
    font-size: 30px;
  }

  #regForm {
    margin-top: 40px;
  }

  #regForm label {
    margin-bottom : 0px;
    margin-left: -520px;
  }

  #regForm p {
    text-align: left;
    padding-left: 120px;
  }

  .form-group {
    margin-bottom : 25px;
  }

  .form-control {
    width: 480px;
    margin-left: 120px;
    margin-top: -25px;
  }

  .alert {
    margin-left: 120px;
    height: 40px;
    width: 480px;
    padding: 10px;
  }

  input {
    width: 500px;
  }

  select {
    width: 480px;
  }

  button {
    width: 120px;
    height: 40px;
    font-size: 1.2em;
    margin-left: 100px;
  }

  .register {
    margin: auto;
    padding-top: 30px;
    width: 600px;
    justify-content:center;
    align-items:center;
  }

  .register-text {
    #display:flex;
    #justify-content:center;
    #align-items:center;
    max-width: 600px;
  }

  .form-control.is-invalid, .form-control:valid, .form-control.is-invalid,  .form-control:invalid {
    background: none;
    background-color: #fff;
  }

</style>
