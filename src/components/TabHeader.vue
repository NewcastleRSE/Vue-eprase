<template>

  <div class="tabbed-header">
    <div class="tab-section bg-primary border border-primary" :class="showSystem ? 'opacity-100' : 'opacity-50'">System</div>
    <div class="tab-section bg-primary border border-primary" :class="showPatients ? 'opacity-100' : 'opacity-50'">Patients</div>
    <div class="tab-section bg-primary border border-primary" :class="showScenarios ? 'opacity-100' : 'opacity-50'">Scenarios</div>
    <div class="tab-section bg-primary border border-primary" :class="showReport ? 'opacity-100' : 'opacity-50'">Report</div>
  </div>

</template>

<script>
    export default {
        name: "TabHeader",
        props: {
            showSystem : true,
            showPatients: false,
            showScenarios: false,
            showReport: false
        }
    }

</script>

<style scoped>

  .tabbed-header {
    height: 80px;   
    display: grid;
    grid-template-columns: auto auto auto auto;
  }

  .tab-section {
    font-size: 2rem;
    text-align: center;
    color: #fff;
    padding-top: 1rem; 
    border-width: 1px;   
  }

  .tab-section:first-child {    
    border-top-left-radius: 2rem;
  }

  .tab-section:last-child {    
    border-top-right-radius: 2rem;
  }

  #patients {
    background-color: #029a99;
  }
  #scenarios {
    background-color: #02b9b8;
  }
  #report {
    background-color: #02dddc;
    border-top-right-radius: 2rem;
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
