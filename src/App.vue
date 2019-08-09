<template>
  <div id="app">
    <div v-if="alert.message" :class="`alert ${alert.type}`">{{alert.message}}</div>
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app',
  components: {
  },
  computed: {
      alert () {
          return this.$store.state.alert
      }
  },
  watch:{
      $route (to, from){
          // clear alert on location change
          this.$store.dispatch('alert/clear');
      }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #2C3E50;
}

.eprase-logo {
  height: 85px;
}

button {
  width: 120px;
  height: 40px;
  font-size: 1.2em;
}

#infoLink {
  padding-top: 10px;
}

.welcome {
  margin: auto;
  margin-top: 7%;
  width: 600px;
  justify-content:center;
  align-items:center;
}

.welcome-text {
  #display:flex;
  #justify-content:center;
  #align-items:center;
  max-width: 600px;
}

</style>
