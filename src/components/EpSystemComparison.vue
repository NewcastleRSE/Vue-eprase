<template>
  <div id="page">

    <div id="header" class="level">
    </div>

    <div class="content">
      <h1>EP System Comparison</h1>
      <p>This chart gives an overview of results by EP System </p>

      <form id="ep-system-form" @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="ep-system-selector"><strong>Choose an EP System to filter results</strong> </label>
          <select name="ep-service" id="ep-system-selector" class="form-control" v-model="searchField" @change="forceRerender()">
            <option :value="null">Select System...</option>
            <option value="Cerner"> Cerner </option>
            <option value="All script"> All script </option>
            <option value="Meditech"> Meditech </option>
            <option value="JAC"> JAC </option>
            <option value="Medway"> Medway </option>
            <option value="EPIC"> EPIC </option>
            <option value="Open EP"> Open EP </option>
            <option value="PICS"> PICS </option>
            <option value="Sunrise"> Sunrise </option>
            <option value="MedChart">MedChart </option>
            <option value="Lorenzo">Lorenzo </option>
          </select>
        </div>
      </form>

      <div v-if="computedSearchField"><EpSystemComparisonChart :mydata="mitigationChartData" :searchfield="computedSearchField" :key="componentKey"></EpSystemComparisonChart></div>

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
  import EpSystemComparisonChart from "./EpSystemComparisonChart";

  export default {
      name: "EpSystemComparison",
      components: {
        AppLogo,
        EpSystemComparisonChart
      },
      data() {
          return{
              searchField: '',
              componentKey: 0,
          }
      },
      computed: {
          mitigationChartData() {
            return this.$store.state.mitigationChartData.mitigationChartData;
          },
          computedSearchField() {
              return this.searchField;
          }
      },
      methods : {
          forceRerender() {
              this.componentKey += 1;
          },
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

  #ep-system-form{
    margin-top: 40px;
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
