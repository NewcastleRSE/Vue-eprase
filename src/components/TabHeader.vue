<template>

  <div id ="tabbedHeader">
    <div class="tab" id="system" v-bind:style="showSystem">System</div>
    <div class="tab" id="patients"  v-bind:style="showPatients">Patients</div>
    <div class="tab" id="scenarios"  v-bind:style="showScenarios">Scenarios</div>
    <div class="tab" id="report"  v-bind:style="showReport">Report</div>
  </div>

</template>

<script>
    export default {
        name: "TabHeader",
        data() {
            return {
                showSystem : 'block',
                showPatients : 'none',
                showScenarios : 'none',
                showReport : 'none'
            }
        }
    }

</script>

<style scoped>

  #tabbedHeader {
    height: 80px;
    width: 100%;
  }

  #system {
    background-color: #07818e;
  /*  background-image: url("assets/tick.png"); */
    position: fixed;
    left: 0px;
    top: 0px;
  }
  #patients {
    background-color: #029a99;
    position: fixed;
    left: 220px;
    top: 0px;
  }
  #scenarios {
    background-color: #02b9b8;
    position: fixed;
    left: 450px;
    top: 0px;
  }
  #report {
    background-color: #02dddc;
    position: fixed;
    left: 670px;
    top: 0px;
  }

  .tab {
    margin: 100px;
    position:relative;
    color: #fff;
    width: 25%;
    -moz-border-radius-topleft: 15px;
    -moz-border-radius-topright: 0px;
    -moz-border-radius-bottomright: 15px;
    -moz-border-radius-bottomleft: 0px;
    -webkit-border-radius: 15px 0px 15px 0px;
    border-radius: 15px 0px 15px 0px;
    padding: 15px;
  }

</style>
