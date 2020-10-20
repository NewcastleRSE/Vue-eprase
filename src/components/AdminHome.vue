<template>
  <div id="page">

    <div id="header" class="level">
    </div>

    <div class="content">

      <h1>Admin functions</h1>

        <p>The following reports are designed to give insight into the comparative performance of different institutions and their EPMA systems.</p>

        <p></p>

      <div class="menu-bar-buttons">
        <button @click=getAllReports()><a href="#">All Institution Reports</a></button>
        <button @click=""><a href="#">Mititgation Comparison</a></button>
        <button @click=""><a href="#">EPMA Statistics</a></button>
        <button @click="">Data input</button>
      </div>

      <div align="center">
        <div class="buttons">
          <button type="button" class="results-btn btn btn-primary" @click="onExitClick()">Exit</button>
          <button type="button" class="results-btn btn btn-primary" @click="onHomeClick()">Home</button>
        </div>
      </div>

    </div>

    <AppLogo></AppLogo>
  </div>

</template>

<script>

  import AppFooter from "./AppFooter";
  import AppLogo from "./AppLogo";

  export default {
      name: "AdminHome",
      components: {
        AppFooter,
        AppLogo
      },
      data() {
          return {
            userIsAdmin: true
          }
      },
    methods: {
        getAllReports() {
          this.$router.push({ path: './assessmentreports' });
        },
        onExitClick() {
          this.$router.push('/logout');
        },
        onHomeClick() {
          this.$router.push('/assessmentintro');
        },
    }
  }

</script>

<style scoped>

  #header {
    background-image: url("../assets/pills-bw.png");
    background-size: 100% auto;
    background-repeat: no-repeat;
    border-top-left-radius: 25px;
    border-top-right-radius: 25px;
  }
  .level {
    height: 80px;
  }

  button {
    height: 40px;
    width: 250px;
    margin: 10px 0;
    font-size: 1em;
    border-width: 1px;
  }

  .menu-bar-buttons {
    padding: 20px 0;
    width: 280px;
  }

  .results-btn {
    background-color: #02dddc;
    border : 0;
    height: 40px;
    width: 100px;
    margin: 25px 50px;
    font-size: 1.2em;
  }

  button a {
    padding: 3px;
  }

  #page {
    text-align: left;
  }

  .content {
    padding: 40px;
  }


</style>
