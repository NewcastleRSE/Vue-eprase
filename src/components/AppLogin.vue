<template>
  <div id="page">

    <div class="loginpage">

      <div id="logo" align="center">
        <img src="../assets/logo-full.png" alt="Welcome to the ePRaSE Tool" class="eprase-logo">
      </div>

        <h1>Log-in to ePRaSE</h1>
        <p>Please enter your login details below, or click 'Register' to create a new user account. You will need a valid <strong>'nhs.uk'</strong> or <strong>'nhs.net'</strong> email account to register with ePRaSE successfully.</p>

        <form id="loginform" class="form-group">
          <div class="form-group">
            <label for="email">E-mail Address:</label>
            <input type="email" v-model="user.email" v-validate="{ required: true, regex:/^[a-zA-Z0-9.]+@([a-z]+.|)nhs.(uk|net)+$/ }" id="email" name="email" class="form-control" :class="{ 'is-invalid':  submitted && errors.has('email') }" />
            <div v-show="submitted && errors.has('email')" class="invalid-feedback alert alert-danger">{{ errors.first('email') }}</div>
          </div>
          <div class="form-group">
            <label>Password: </label>
            <input type="password" v-model="user.password" v-validate="{ required: true, min: 6 }" class="form-control" name="password" maxlength="50" :class="{ 'is-invalid': submitted & errors.has('password') }"/>
            <div v-show="submitted & errors.has('password')" class="invalid-feedback alert alert-danger">{{ errors.first('password') }}</div>
          </div>
        </form>
        <p v-show="serverError === true" class="text-error">Please be patient while your credentials are verified. If access fails, please check that your email and password are correct.<br/><br/></p>
        <p><a routerLink="">Forgotten your Password? <router-link to="/requestpassword">Click here</router-link></a><br/><br/></p>

        <p id="email-link">If you are having difficulty logging in after attempting a password reset, please send an email to <a href="mailto:eprase@newcastle.onmicrosoft.com">eprase@newcastle.onmicrosoft.com</a></p>

        <div align="center">
          <div class="buttons form-group" align="center">
            <button type=" button" id="login" class="login-btn btn btn-primary" @click="onLoginClick()">Login</button>
            <button type="button" id="reset" class="login-btn btn btn-primary" @click.prevent="resetForm">Cancel</button>
            <button type="button" id="register" class="btn btn-primary" @click="onRegisterClick()">Register</button>
          </div>
        </div>
      </div>

    </div>

</template>

<script>


    import {router} from "../router";

    export default {
      name: "AppLogin",
      components: {

      },
      computed: {
          isFormInvalid() {
              return Object.keys(this.fields).some(key => this.fields[key].invalid);
          },
          loggingIn () {
              return this.$store.state.authentication.status.loggingIn;
          }
      },
      data() {
          return {
              user: {
                  email: '',
                  username: '',
                  password: '',
              },
              submitted: false,
              serverError: false,
          }
      },
      methods: {
        onLoginClick() {
            this.submitted = true;

            this.user.username = this.getUsernameFromEmail(this.user.email);

            this.$validator.validate().then(valid => {
                if (valid) {
                    const username  = this.user.username;
                    const password = this.user.password;
                    const { dispatch } = this.$store;
                    if (username && password) {
                        dispatch('authentication/login', { username, password })

                        .then(()=> {
                          this.serverError = true;
                          this.$router.push('/login')
                          .catch(err => {});
                        })
                    }
                }
            });
        },
        onRegisterClick() {
            this.$router.push({ path: './register' });
        },
        getUsernameFromEmail(email){
          let parts =[];
          parts = email.split('@');
          return parts[0];
        },
        resetForm: function() {
          this.$data.user = {};
          this.errors.clear();
          this.serverError = false;
        },
      },
      created () {
          // reset login status
          this.$store.dispatch('authentication/logout');
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


  h1 {
    font-size: 30px;
  }

  .eprase-logo {
    height: 75px;
  }

  #loginform {
    margin-top: 40px;
    margin-left: 25px;
  }

  #loginform label {
    margin-bottom : 0px;
    margin-left: -550px;
  }

  .form-group {
    margin-bottom : 25px;
    margin-left: 40px;
  }

  .form-control {
    width: 370px;
    margin-left: 120px;
    margin-top: -25px;
  }

  .buttons{
    margin-left: -40px;
  }

  button {
    width: 120px;
    height: 40px;
    font-size: 1.2em;
    margin-left: 50px;
  }

  .login-btn {
    background-color: #07818e;
  }

  #login {
    margin-left: 68px;
  }

  #register {
    background-color: #07abb8;
    border-color: #07818e;
  }

  #register:hover {
    background-color: #07818e;
  }

  .loginpage {
    margin: 0 auto;
    padding-top: 30px;
    max-width: 700px;
    padding-bottom :20px;
  }

  #page {
    border: 1px solid #c4c4c4;
    border-radius: 25px;
    margin: 50px;
  }

  .alert {
    margin-left: 120px;
    height: 40px;
    width: 370px;
    padding: 10px;
  }

  input {
    width: 370px;
  }

  #email-link {
    padding-bottom: 20px;
    font-size: 0.9em;
  }

  .form-control.is-invalid, .form-control:valid, .form-control.is-invalid,  .form-control:invalid {
    background: none;
    background-color: #fff;
  }

  .text-error {
    font-weight: bold;
    color: #1c3f37;
  }


</style>
