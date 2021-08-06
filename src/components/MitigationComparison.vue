<template>
  <div id="page">

    <div id="header" class="level">
    </div>

    <div class="content">

      <h1>Institution Mitigation Comparison</h1>

      <p>This chart gives an overview of each institutions mitigation results </p>

      <MitigationComparisonChart :mydata="mitigationChartData"></MitigationComparisonChart>

    </div>

    <div class="footer-bar-buttons">
      <button><font-awesome-icon icon="home"></font-awesome-icon><span class="headerLink"><router-link to="/adminhome">Admin Home</router-link></span></button>
      <button><font-awesome-icon icon="sign-out-alt"></font-awesome-icon><span class="headerLink"><router-link to="/login">Logout</router-link></span></button>
    </div>

    <AppLogo></AppLogo>
  </div>
</template>

<script>

  import AppLogo from "./AppLogo";
  import MitigationComparisonChart from "./MitigationComparisonChart";

  export default {
      name: "MitigationComparison",
      components: {
        AppLogo,
        MitigationComparisonChart
      },
      computed: {
        mitigationChartData() {
          return this.$store.state.mitigationChartData.mitigationChartData;
        }
      },
      methods : {
          onExitClick() {
              this.$router.push('/logout');
          },
          onAdminHomeClick() {
              this.$router.push('/adminhome');
          }
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
    width: 170px;
    margin: 10px 0px;
    font-size: 1em;
    border-width: 1px;
  }

   button a {
    padding: 3px;
    text-decoration: none;
  }

   button:hover {
      background-color: #daffde;
  }


  .footer-bar-buttons {
    padding-left: 40px;
    padding-bottom: 20px;
    border-width: 1px;
  }

  #page {
    text-align: left;
  }

  .content {
    padding: 40px;
  }

</style>
