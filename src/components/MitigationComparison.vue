<template>
  <div id="page">

    <div id="header" class="level">
    </div>

    <div class="content">

      <h1>Institution Mitigation Comparison</h1>

      <p>This chart gives an overview of each institutions mitigation results </p>

      <MitigationComparisonChart :mydata="mitigationChartData"></MitigationComparisonChart>

      <div align="center">
        <div class="buttons">
          <button type="button" class="results-btn btn btn-primary" @click="onExitClick()">Exit</button>
          <button type="button" class="results-btn btn btn-primary" @click="onAdminHomeClick()">Admin Home</button>
        </div>
      </div>

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
    background-color: #07818e;
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
