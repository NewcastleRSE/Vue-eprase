<template>
  <div id="page">
    <div id="welcome">
      <div class="mx-auto">
        <img src="../assets/logo-full.png" alt="Welcome to the ePRaSE Tool" class="eprase-logo">
      </div>
      <div id="welcome-text">
        <h1>Welcome to ePRaSE 2024</h1>
        <p>The ePrescribing Risk and Safety Evaluation tool (ePRaSE) is designed to evaluate ePrescription services,
          in order to determine their effectiveness and to encourage the correct use of these systems
          and deliver improved patient outcomes. </p>

        <br/>
        <div class="mx-auto" v-if="appOpen">
          <div class="buttons" >
            <button type="button" class="start-btn btn btn-primary" @click=login()>Start</button>
          </div>
        </div>
        <div v-if="!appOpen">
            <strong>This application is currently closed</strong>
        </div>
      </div>
    </div>
    <div>
      <p id="logo-bar">
        <span class="logos"><img id="di-logo" src="../assets/Digital_Institute.jpg" alt="Digital Institute" ></span>
        <span class="logos"><img id="nuth-logo" src="../assets/NUTHlogo.png" alt="The Newcastle upon Tyne Hospitals NHS Foundation Trust"></span>
        <span class="logos"><img id="pharm-logo" src="../assets/pharmacy.png" alt="School of Pharmacy" ></span></p>
    </div>
    <div id="version">Version {{ version }}</div>
  </div>

</template>

<script>
    import { settings } from '../settings';

    export default {
        name: "AppWelcome",
        data() {
             return{
              version : settings.version,
              appOpen : settings.appOpen
          }
        },
        methods: {
          login() {
            window.location.href = './login'
          },
          about() {
            window.location.href = './about'
          }
        },
        created() {
         localStorage.clear();
        }
    }

</script>

<style scoped>

  #page {
    text-align: center;
  }

  #version {
      padding-bottom: 20px;
      font-size: 0.8em;
      color: #07818e;
  }

  .eprase-logo {
    height: 85px;
  }

  button {
    width: 120px;
    height: 40px;
    font-size: 1.2em;
  }

  .start-btn {
    background-color: #07818e;
  }

  #welcome {
    margin: auto;
    margin-top: 7%;
    width: 600px;
    justify-content:center;
    align-items:center;
  }

  #welcome-text {
    max-width: 600px;
  }


  #di-logo, #pharm-logo {
    height: 50px;
    max-width: 200px;
  }

  #nuth-logo {
    height: 50px;
  }

  #logo-bar {
    padding: 40px 0;
    width: 100%;
  }

  .logos {
    padding-right: 70px;
  }


</style>
