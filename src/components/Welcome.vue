<template>
  <div class="welcome">
    <div align="center">
      <img src="../assets/logo-full.png" alt="Welcome to the ePRaSE Tool" class="eprase-logo">
    </div>
    <div class="welcome-text">
      <h1>Welcome to ePRaSE 2019</h1>
      <p>The ePrescribing Risk and Safety Evaluation tool (ePRaSE) is designed to evaluate ePrescription services,
        in order to determine their effectiveness and to encourage the correct use of these systems
        and deliver improved patient outcomes. </p>
      <p id="infoLink" @click=about()><a href="#">Click here for more information</a></p><br/>
      <p>To complete the assessment and view the results,<br/>please log in using the button below.</p>
      <br/>
      <div align="center">
        <div class="buttons" >
          <button type="button" class="btn btn-primary" @click=login()>Continue</button>
        </div>
      </div>
    </div>

  </div>

</template>

<script>

    export default {
        name: "Welcome",
        methods: {
          login() {
            window.location.href = './login'
          },
          about() {
            window.location.href = './about'
          }

        }
    }

</script>

<style scoped>

  .eprase-logo {
    height: 85px;
  }

  button {
    width: 120px;
    height: 40px;
    font-size: 1.2em;
  }

  #infoLink {
    padding-top: 10px;
  }

  .welcome {
    margin: auto;
    margin-top: 7%;
    width: 600px;
    justify-content:center;
    align-items:center;
  }

  .welcome-text {
    #display:flex;
    #justify-content:center;
    #align-items:center;
    max-width: 600px;
  }


</style>
