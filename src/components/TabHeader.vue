<template>

  <div class="tabbed-header">
    <div v-for="(heading, index) in headings" class="tab-section bg-primary" :class="index == showIndex ? 'opacity-100' : 'opacity-50'">
      <i class="bi bi-check2-circle" v-if="index < showIndex"></i>{{  heading }}
    </div>   
  </div>

</template>

<script>
    export default {
        name: "TabHeader",
        props: {
            showIndex : 0
        }, 
        data() {
          return {
            headings: ['System', 'Patients', 'Scenarios', 'Report']
          }
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
  }

  .tab-section:first-child {    
    border-top-left-radius: 2rem;
  }

  .tab-section:last-child {    
    border-top-right-radius: 2rem;
  }

</style>
