<template>
  <div id="page">

    <div class="loginpage">

      <div id="logo" align="center">
        <img src="../assets/logo-full.png" alt="Welcome to the ePRaSE Tool" class="eprase-logo">
      </div>

      <h1>Reset Password</h1>
      <p>Please enter a new password</p>

      <form id="loginform" class="form-group">
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

        <p v-if="serverError" class="text-error">Token not found<br/><br/></p>

        <div align="center">
          <div class="buttons form-group" align="center">
            <button type="button" id="login" class="login-btn btn btn-primary" @click="onResetClick()">Submit</button>
            <button type="button" id="reset" class="login-btn btn btn-primary" @click.prevent="resetForm">Cancel</button>
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
        name: "ResetPassword",
        data() {
          return {
            user: {
              password: '',
              confirmPassword: '',
            },
            token : '',
            submitted: false,
            serverError: false,
          }
        },
        methods: {
          onResetClick() {
            this.submitted = true;

            // get the token from the url
            this.token  = this.$route.query.token;

            // form validation ensures that the passwords match
            this.$validator.validate().then(valid => {
              if (valid) {
                const password = this.user.password;
                const token = this.token;
                const { dispatch } = this.$store;
                if (password && token) {
                  dispatch('authentication/resetPassword', { password, token }).then(() => router.push({ path: './login' }) )
                    .catch(err => {
                      console.log(err);
                      this.serverError = true
                    })
                }
              }
            });
          },
          resetForm: function() {
            this.$data.user = {};
            this.errors.clear();
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

  #loginform {
    margin-top: 40px;
    margin-left: 25px;
  }

  #loginform label {
    margin-bottom : 0;
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
    color: red;
  }


</style>
