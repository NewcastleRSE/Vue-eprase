<template>
  <div id="page">

    <div class="loginpage">

      <div id="logo" class="mx-auto">
        <img src="../assets/images/logo-full.png" alt="Welcome to the ePRaSE Tool" class="eprase-logo">
      </div>

      <h1>Request a new password</h1>

      <form id="rpform" class="form-group">
        <p>Please enter your registered ePRaSE email address</p>
        <div class="form-group">
          <label for="email">E-mail Address:</label>
          <input type="email" v-model="user.email" v-validate="{ required: true, regex:/^[a-zA-Z0-9.]+@([a-z]+.|)nhs.(uk|net)+$/ }" id="email" name="email" class="form-control" :class="{ 'is-invalid':  submitted && errors.has('email') }" />
          <div v-show="submitted && errors.has('email')" class="invalid-feedback alert alert-danger">{{ errors.first('email') }}</div>
        </div>
        <div class="mx-auto">
          <div class="buttons form-group mx-auto">
            <button type="button" id="login" class="login-btn btn btn-primary" @click="onRequestClick()" :disabled="isFormInvalid">Submit</button>
          </div>
        </div>
      </form>

      <p id="email-link">If you are having difficulty logging in after attempting a password reset, please send an email to <a href="mailto:eprase@newcastle.onmicrosoft.com">eprase@newcastle.onmicrosoft.com</a></p>


    </div>

  </div>

</template>

<script>
    import {router} from "../router";

    export default {
        name: "RequestPassword",
        computed: {
            isFormInvalid() {
                return Object.keys(this.fields).some(key => this.fields[key].invalid);
            }
        },
        data() {
            return {
                user: {
                  email: ''
                },
                submitted: false,
                serverError: false,
            }
        },
      methods: {
        onRequestClick() {
          this.submitted = true;
          this.$validator.validate().then(valid => {
            if (valid) {
              const email = this.user.email;
              const { dispatch } = this.$store;
              if (email) {
                dispatch('authentication/requestNewPassword', { email }).then(() => router.push({ path: './login' }) )
                  .catch(err => {
                    console.log(err);
                    this.serverError = true
                  })
              }
            }
          });
        },
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

  #rpform {
    margin-top: 40px;
    margin-left: 25px;
  }

  #rpform label {
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
    color: red;
  }


</style>
