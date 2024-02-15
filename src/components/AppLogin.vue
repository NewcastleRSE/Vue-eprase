<template>
    <div id="page">
        <div class="loginpage">
            <div id="logo" class="mx-auto">
                <img
                    src="../assets/logo-full.png"
                    alt="Welcome to the ePRaSE Tool"
                    class="eprase-logo"
                />
            </div>

            <h1>Log-in to ePRaSE</h1>
            <p>
                Please enter your login details below, or click 'Register' to
                create a new user account. You will need a valid
                <strong>'nhs.uk'</strong> or <strong>'nhs.net'</strong> email
                account to register with ePRaSE successfully.
            </p>

            <Form id="loginform" class="form-group" @submit="onLoginClick">
                <div class="form-group">
                    <label for="email">E-mail Address:</label>
                    <Field
                        type="email"
                        v-model="user.email"
                        :rules="validateEmail"
                        id="email"
                        name="email"
                        class="form-control"
                    />
                    <ErrorMessage name="email" as="div" v-slot="{ message }">
                      <span class="error-text">{{  message }}</span>
                    </ErrorMessage>
                </div>
                <div class="form-group">
                    <label>Password: </label>
                    <Field
                        type="password"
                        v-model="user.password"
                        :rules="validatePassword"
                        class="form-control"
                        name="password"
                        maxlength="50"
                    />
                    <ErrorMessage name="password" as="div" v-slot="{ message }">
                      <span class="error-text">{{  message }}</span>
                    </ErrorMessage>
                </div>
            </Form>
            <p v-show="serverError === true" class="text-error">
                Please be patient while your credentials are verified. If access
                fails, please check that your email and password are correct.<br /><br />
            </p>

            <p id="email-link">
                If you have forgotten your password, please contact the RSE team
                at:
                <a href="mailto:rseteam@newcastle.ac.uk"
                    >rseteam@newcastle.ac.uk</a
                >
            </p>

            <!--<p><a routerLink="">Forgotten your Password? <router-link to="/requestpassword">Click here</router-link></a><br/><br/></p>-->
            <!--<p id="email-link">If you are having difficulty logging in after attempting a password reset, please send an email to <a href="mailto:eprase@newcastle.onmicrosoft.com">eprase@newcastle.onmicrosoft.com</a></p>-->

            <div class="mx-auto">
                <div class="buttons form-group mx-auto">
                    <button
                        type="submit"
                        id="login"
                        class="login-btn btn btn-primary"
                    >
                        Login
                    </button>
                    <button
                        type="reset"
                        id="reset"
                        class="login-btn btn btn-primary"
                        @click="onCancelClick"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        id="register"
                        class="btn btn-primary"
                        @click="onRegisterClick"
                    >
                        Register
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";

export default {
    name: "AppLogin",
    components: {
        Form,
        Field,
        ErrorMessage,
    },
    computed: {
        isFormInvalid() {
            return Object.keys(this.fields).some(
                (key) => this.fields[key].invalid,
            );
        },
        loggingIn() {
            return this.$store.state.authentication.status.loggingIn;
        },
    },
    data() {
        return {
            user: {
                email: "",
                username: "",
                password: "",
            },
            submitted: false,
            serverError: false,
        };
    },
    methods: {
        validateEmail(value) {
            if (
                value &&
                value.match(/^[a-zA-Z0-9.]+@([a-z]+.|)nhs.(uk|net)+$/)
            ) {
                return true;
            } else {
                return "Must be a valid nhs.net or nhs.uk email address";
            }
        },
        validatePassword(value) {
            if (value && value.length > 6 && value.length < 50) {
                return true;
            } else {
                return "Password must be between 6 and 50 characters long";
            }
        },
        onLoginClick() {
            console.log("onLoginClick()");
            this.submitted = true;

            this.user.username = this.getUsernameFromEmail(this.user.email);
            //console.log(this.$validator)

            // this.$validator.validate().then((valid) => {
            //     if (valid) {
            //         const username = this.user.username;
            //         const password = this.user.password;
            //         const { dispatch } = this.$store;
            //         if (username && password) {
            //             dispatch("authentication/login", {
            //                 username,
            //                 password,
            //             }).then(() => {
            //                 this.serverError = true
            //                 this.$router.push("/login").catch((err) => {})
            //             });
            //         }
            //     }
            // });
        },
        onRegisterClick() {
            this.$router.push({ path: "./register" });
        },
        getUsernameFromEmail(email) {
            return email.split("@").shift();
        },
        onCancelClick: function () {
            this.user = {};
        },
    },
    created() {
        // reset login status
        this.$store.dispatch("authentication/logout");
    },
};
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
    margin-bottom: 0px;
    margin-left: -550px;
}

.form-group {
    margin-bottom: 25px;
    margin-left: 40px;
}

.form-control {
    width: 370px;
    margin-left: 120px;
    margin-top: -25px;
}

.buttons {
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
    padding-bottom: 20px;
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
    padding: 30px 15px;
    font-size: 0.9em;
}

.text-error {
    font-weight: bold;
    color: #1c3f37;
}
</style>
