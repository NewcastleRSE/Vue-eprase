<template>
  <main>
    <div class="loginpage">
      <div>
        <img
          src="../assets/images/logo-full.png"
          alt="Welcome to the ePRaSE Tool"
          class="eprase-logo"
        />
      </div>

      <h1>Log-in to ePRaSE</h1>
      <p class="pb-2">
        Please enter your login details below, or click 'Register' to create a
        new user account. You will need a valid
        <strong>'nhs.uk'</strong> or <strong>'nhs.net'</strong> email account to
        register with ePRaSE successfully.
      </p>

      <Form ref="loginForm" :validation-schema="validationSchema">
        <div class="mb-4 row">
          <label for="email" class="col-sm-4 form-label">E-mail Address:</label>
          <div class="col-sm-8">
            <Field
              type="email"
              v-model="user.email"
              id="email"
              name="email"
              class="form-control"
            />
          </div>
          <ErrorMessage
            name="email"
            as="div"
            class="mt-2 text-danger text-center col-sm-12"
            v-slot="{ message }"
          >
            {{ message }}
          </ErrorMessage>
        </div>
        <div class="mb-4 row">
          <label for="password" class="col-sm-4 form-label">Password:</label>
          <div class="col-sm-8">
            <Field
              type="password"
              v-model="user.password"
              class="form-control"
              name="password"
              maxlength="50"
            />
          </div>
          <ErrorMessage
            name="password"
            as="div"
            class="mt-2 text-danger text-center col-sm-12"
            v-slot="{ message }"
          >
            {{ message }}
          </ErrorMessage>
        </div>
      </Form>
      <p v-show="serverError === true" class="text-error">
        Please be patient while your credentials are verified. If access fails,
        please check that your email and password are correct.<br /><br />
      </p>

      <p>
        If you have forgotten your password, please contact the RSE team at:
        <a href="mailto:rseteam@newcastle.ac.uk">rseteam@newcastle.ac.uk</a>
      </p>

      <!--<p><a routerLink="">Forgotten your Password? <router-link to="/requestpassword">Click here</router-link></a><br/><br/></p>-->
      <!--<p id="email-link">If you are having difficulty logging in after attempting a password reset, please send an email to <a href="mailto:eprase@newcastle.onmicrosoft.com">eprase@newcastle.onmicrosoft.com</a></p>-->

      <div class="mb-4">
        <button
          type="submit"
          class="btn btn-primary me-3"
          @click="onLoginClick"
        >
          Login
        </button>
        <button type="reset" class="btn btn-primary me-3" @click="onResetClick">
          Cancel
        </button>
        <button type="button" class="btn btn-primary" @click="onRegisterClick">
          Register
        </button>
      </div>
    </div>
  </main>
</template>

<script>
import { Form, Field, ErrorMessage, resetForm } from "vee-validate";

export default {
  name: "AppLogin",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  computed: {
    isFormInvalid() {
      return Object.keys(this.fields).some((key) => this.fields[key].invalid);
    },
    loggingIn() {
      return this.$store.state.authentication.status.loggingIn;
    },
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
      validationSchema: {
        email(value) {
          console.log("Validate email", value);
          if (
            value &&
            value.match(/^[a-zA-Z0-9-.]+@([a-z]+.|)nhs.(uk|net)+$/)
          ) {
            console.log('Ok');
            return true;
          } else {
            return 'Must be a valid nhs.net or nhs.uk email address';
          }
        },
        password(value) {
          console.log("Validate password", value);
          if (value && value.length > 6 && value.length < 50) {
            console.log('Ok');
            return true;
          } else {
            return 'Password must be between 6 and 50 characters long';
          }
        },
      },
    };
  },
  methods: {
    onLoginClick() {
      console.log('onLoginClick()');

      this.submitted = true;
      this.user.username = this.user.email.split('@').shift()
      this.$refs.loginForm.validate().then((valid) => {
        console.log('Form submission valid', valid);
        if (valid) {
          const username = this.user.username;
          const password = this.user.password;
          console.debug('Username', username, 'password', password);
          //TODO all the stores need converting from Vuex to Pinia - David Herbert 16/02/2024
          console.log(this.$store);
          if (username && password) {
            dispatch('authentication/login', {
              username,
              password,
            }).then(() => {
              this.serverError = true;
              this.$router.push('/login').catch((err) => {});
            });
          }
        }
      });
    },
    onResetClick() {
      this.$refs.loginForm.resetForm();
    },
    onRegisterClick() {
      this.$router.push('/register');
    }
  }
};
</script>

<style scoped>
div.loginpage {
  max-width: 60%;
  margin: auto;
}
</style>
