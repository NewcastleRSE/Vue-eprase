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
    width: 98%;
    margin: 10px;
    display: grid;
    grid-template-columns: auto auto auto auto;
  }

  #system {
    background-color: #07818e;
  /*  background-image: url("assets/tick.png"); */
  }
  #patients {
    background-color: #029a99;
  }
  #scenarios {
    background-color: #02b9b8;
  }
  #report {
    background-color: #02dddc;
  }

  .tab {
    margin: 10px;
    color: #fff;
    -moz-border-radius-topleft: 15px;
    -moz-border-radius-topright: 0px;
    -moz-border-radius-bottomright: 15px;
    -moz-border-radius-bottomleft: 0px;
    -webkit-border-radius: 15px 0px 15px 0px;
    border-radius: 15px 0px 15px 0px;
    padding: 20px;
    font-size: 20px;
    text-align: center;
  }

</style>
