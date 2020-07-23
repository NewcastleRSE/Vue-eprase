<template>

  <div id ="tabbedHeader">
    <div class="section" id="system" >System <img class="tick" src="/dist/tick.png" alt="completed" v-bind:style="showSystem"></div>
    <div class="section" id="patients" >Patients <img class="tick" src="/dist/tick.png" alt="completed"  v-bind:style="showPatients"></div>
    <div class="section" id="scenarios" >Scenarios <img class="tick" src="/dist/tick.png" alt="completed" v-bind:style="showScenarios"></div>
    <div class="section" id="report" >Report <img class="tick" src="/dist/tick.png" alt="completed"  v-bind:style="showReport"></div>
  </div>

</template>

<script>
    export default {
        name: "TabHeader",
        props: {
            systemOpacity : '',
            patientOpacity : '',
            scenarioOpacity: '',
            reportOpacity: '',
        },
        data() {
            return {
                showSystem : {
                   display: 'inline',
                    opacity: this.systemOpacity
                },
                showPatients : {
                    display: 'inline',
                    opacity: this.patientOpacity
                },
                showScenarios : {
                    display: 'inline',
                    opacity: this.scenarioOpacity
                },
                showReport : {
                    display: 'inline',
                    opacity: this.reportOpacity
                }
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
    border-top-left-radius: 15px;
  }
  #patients {
    background-color: #029a99;
  }
  #scenarios {
    background-color: #02b9b8;
  }
  #report {
    background-color: #02dddc;
    border-top-right-radius: 15px;
  }

  .tick {
    height: 30px;
    margin-left: 5px;
  }

  .section {
    font-size: 22px;
    text-align: center;
    color: #fff;
    padding-top: 25px;
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
