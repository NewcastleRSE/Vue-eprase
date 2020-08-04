<template>
  <div id="page">
    <div class="welcome">
      <div align="center">
        <img src="/dist/logo-full.png" alt="Welcome to the ePRaSE Tool" class="eprase-logo">
      </div>
      <div class="welcome-text">
        <h1>Welcome to ePRaSE 2020</h1>
        <p>The ePrescribing Risk and Safety Evaluation tool (ePRaSE) is designed to evaluate ePrescription services,
          in order to determine their effectiveness and to encourage the correct use of these systems
          and deliver improved patient outcomes. </p>

        <br/>
        <div align="center">
          <div class="buttons" >
            <button type="button" class="start-btn btn btn-primary" @click=login()>Start</button>
          </div>
        </div>
      </div>
    </div>
    <div>
      <p id="logo-bar">
        <span class="logos"><img id="di-logo" src="/dist/Digital_Institute.jpg" alt="Digital Institute" ></span>
        <span class="logos"><img id="nuth-logo" src="/dist/NUTHlogo.png" alt="The Newcastle upon Tyne Hosptials NHS Foundation Trust"></span>
        <span class="logos"><img id="pharm-logo" src="/dist/pharmacy.png" alt="School of Pharmacy" ></span></p>
    </div>
  </div>

</template>

<script>

    export default {
        name: "AppWelcome",
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
          console.log(process.env.BASE_URL);
        }
    }

</script>

<style scoped>

  #page {
    text-align: center;
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
