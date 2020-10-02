<template>
  <div id="page">

    <div class="register">

      <div id="logo" align="center">
        <img src="../assets/logo-full.png" alt="Welcome to the ePRaSE Tool" class="eprase-logo">
      </div>
      <div class="register-text">
        <h1>Register</h1>
        <p>To register with the ePRaSE system, please provide the following information.</p>

        <form id="regForm" @submit.prevent="handleSubmit()">

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
              <option v-for="institution in institutions" v-bind:value="institution.id">{{institution.orgName}}</option>
              <div v-show="submitted && errors.has('institution')" class="invalid-feedback alert alert-danger">{{ errors.first('institution') }}</div>
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

          <div id="buttons" class="form-group" align="center">
            <button type="submit" class="reg-btn btn btn-primary" :disabled="isFormInvalid">Register</button>
            <button type="button" class="reg-btn btn btn-primary" @click.prevent="resetForm">Cancel</button>
           <button id="loginBtn" type="button" class="btn btn-primary" @click="onLoginClick">Login</button>
          </div>
        </form>

        <div v-if="serverError === 'too-many-users'" class="warning">Sorry, there is a problem with registration, there is a limit of 4 users per institution</div>
        <div v-if="serverError === 'email-taken'" class="warning">This email has already been registered against an institution</div>

      </div>
    </div>
  </div>
</template>

<script>

    import {HTTP} from '../http-constants';
    import json from '../json/institutions.json'
    import { dataService } from '../services/data.service';

    let baseURL = process.env.BASE_URL;

    export default {
      name: "AppRegister",
      components: {

      },
      computed: {
        isFormInvalid() {
            return Object.keys(this.fields).some(key => this.fields[key].invalid);
        }
      },
      data() {
        return {
          user: {
            username: '',
            institution: '',
            email: '',
            password: '',
            confirmPassword: '',
          },
          submitted: false,
          institutions: [],
          serverError: '',
        }
      },
      methods: {
        onLoginClick: function() {
           this.$router.push({ path: './login' });
        },
        resetForm: function() {
          this.$data.user = {};
          this.errors.clear();
          this.serverError = '';
        },
        handleSubmit() {
          this.submitted = true;

          this.user.username = this.getUsernameFromEmail(this.user.email);

          this.$validator.validate().then(valid => {
            if (valid) {

              HTTP.post( '/auth/signup/user', {

                username : this.user.username,
                institution: this.user.institution,
                email: this.user.email,
                password: this.user.password,
                role: ["user"]
              })
                .then(response => {
                    this.$router.push({path: './login'})
                })
                .catch(error => this.serverError = error.response.data)
            }
          });
        },
        getUsernameFromEmail(email){
          let parts =[];
          parts = email.split('@');
          return parts[0];
        }
      },
      created() {
          dataService.getInstitutions().then(data => {
              this.institutions = data;
          });
      }
    }

</script>

<style scoped>

  #page {
    text-align: center;
  }

  #logo {
    padding-bottom: 40px;
  }


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

  #buttons {
    margin-left: 60px;
  }

  #loginBtn {
    background-color: #07abb8;
    border-color: #07818e;
  }

  .reg-btn {
    background-color: #07818e;
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
    margin-left: 50px;
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

  .warning{
    color: red;
  }

</style>
