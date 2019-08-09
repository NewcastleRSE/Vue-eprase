<template>
  <div>
    <Header />
    <div class="loginpage">

      <div align="center">
        <img src="../assets/logo-full.png" alt="Welcome to the ePRaSE Tool" class="eprase-logo">
      </div>

        <h1>Log-in to ePRaSE</h1>
        <p>Please enter your login details below, or click 'Register' to create a new user account. You will need a valid <strong>'nhs.uk'</strong> or <strong>'nhs.net'</strong> email account to register with ePRaSE successfully.</p>

        <form id="loginform" class="form-group">
          <div class="form-group">
            <label>Username: </label>
            <input type="text"  v-model="user.username" v-validate="'required'" class="form-control" name="username"  minlength="3" maxlength="50" :class="{ 'is-invalid': submitted && errors.has('username') }" />
            <div v-if="submitted && errors.has('username')" class="invalid-feedback alert alert-danger">{{ errors.first('username') }}</div>
          </div>
          <div class="form-group">
            <label>Password: </label>
            <input type="password" v-model="user.password" v-validate="{ required: true, min: 6 }" class="form-control" name="password" maxlength="50" :class="{ 'is-invalid': submitted & errors.has('password') }"/>
            <div v-show="submitted & errors.has('password')" class="invalid-feedback alert alert-danger">{{ errors.first('password') }}</div>
          </div>
        </form>
        <p v-if="serverError" class="text-error">Incorrect username or password<br/><br/></p>
        <!--<p><a routerLink="">Forgotten your Password? Click here.</a><br/><br/></p>-->

        <p id="email-link">If you are having difficulty logging in or wish to reset your password, please send an email to <a href="mailto:eprase@newcastle.onmicrosoft.com">eprase@newcastle.onmicrosoft.com</a></p>

        <div align="center">
          <div class="buttons">
            <button type="button" id="login" class="btn btn-primary" @click="onLoginClick()">Login</button>
            <button type="button" id="register" class="btn btn-primary" @click="onRegisterClick()">Register</button>
          </div>
        </div>
      </div>

    </div>

</template>

<script>
  import Header from './Header';

    export default {
      name: "Login",
      components: {
        Header
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
            this.$validator.validate().then(valid => {
                if (valid) {
                    const username  = this.user.username;
                    const password = this.user.password;
                    const { dispatch } = this.$store;
                    if (username && password) {
                        dispatch('authentication/login', { username, password });
                    }
                }
            });
        },
        onRegisterClick() {
          window.location.href = './register'
        },
      },
      created () {
          // reset login status
          this.$store.dispatch('authentication/logout');
      }
  }

</script>

<style scoped>

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

  button {
    width: 120px;
    height: 40px;
    font-size: 1.2em;
  }

  #login {
    margin-left: 68px;
  }

  #register {
    margin-left: 120px;
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

  .alert {
    margin-left: 120px;
    height: 40px;
    width: 370px;
    padding: 10px;
  }

  input {
    width: 370px;
  }

  .is-valid {
    border-left: 5px solid #42A948;
  }

  #email-link {
    padding-bottom: 20px;
    font-size: 0.9em;
  }




</style>
