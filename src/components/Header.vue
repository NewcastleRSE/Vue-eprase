<template>
  <nav>
  <div class="header-bar">
    <div class="header-content">
      <img src="../assets/logo.png" alt="ePRaSE" class="eprase-logo-header">
      <div class="header-bar-buttons">
        <button @click=home()><font-awesome-icon icon="home"></font-awesome-icon><p>Home</p></button>
        <button @click=assessments()><font-awesome-icon icon="list"></font-awesome-icon><p>Assessments</p></button>
        <button @click=instructions()><font-awesome-icon icon="clipboard"></font-awesome-icon><p>Instructions</p></button>
        <button @click=reports()><font-awesome-icon icon="chart-bar"></font-awesome-icon><p>Reports</p></button>
        <button><font-awesome-icon icon="question-circle"></font-awesome-icon><p><a id="downloadPDF" href="../assets/user-guide.pdf" download>Help</a></p></button>
        <button><font-awesome-icon icon="sign-out-alt"></font-awesome-icon><p class="headerLink"><router-link to="/login">Logout</router-link></p></button>
      </div>
    </div>
  </div>
  </nav>

</template>

<script>
    export default {
        name: "Header",
        methods: {
          home() {
            window.location.href = './home'
          },
          assessments() {
            window.location.href = './about'
          },
          reports() {
            window.location.href = './resultshome'
          },
          instructions() {
              window.location.href = './instructions'
          },

        }
    }
</script>

<style scoped>

  .header-bar {
    height: 84px;
    background: #cce6ff;
    border-bottom: 4px solid #6b9bc7;
  }

  .header-content {
    max-width: 1000px;
    margin: auto;
  }

  .eprase-logo-header {
    height: 50px;
    float: left;
    margin-top: 17px;
    margin-left: 30px;
  }

  .header-bar-buttons {
    float: right;
    vertical-align: middle;

  }

  .header-bar-buttons button {
    margin: 7px 5px 3px 0px;
    height: 70px;
    width: 95px;
    padding: 0;
    border-radius: 5px;
  }

  .header-bar button p {
    text-align: center;
    margin:0;
    padding-top:2px;
    padding-bottom:2px;
    font-size: 12px;
  }

  #downloadPDF {
    color: #2c3e50;
    text-decoration: none;
  }

  .headerLink {
    color: #2c3e50;
    text-decoration: none;
  }


</style>
