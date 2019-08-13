<template>
  <nav>
  <div class="header-bar">
    <div class="header-content">
      <img src="../assets/logo.png" alt="ePRaSE" class="eprase-logo-header">
      <div class="header-bar-buttons">
        <button @click=home()><span class="glyphicon glyphicon-home"></span><p>Home</p></button>
        <button @click=assessments()><span class="glyphicon glyphicon-list"></span><p>Assessments</p></button>
        <button @click=instructions()><span class="glyphicon glyphicon-list-alt"></span><p>Instructions</p></button>
        <button @click=reports()><span class="glyphicon glyphicon-stats"></span><p>Reports</p></button>
        <button><span class="glyphicon glyphicon-question-sign"></span><p><a id="downloadPDF" href="../assets/user-guide.pdf" download>Help</a></p></button>
        <button><span class="glyphicon glyphicon-log-out"></span><p class="headerLink"><router-link to="/login">Logout</router-link></p></button>
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
            window.location.href = './home'
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
    margin: 5px 5px 5px 0px;
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
