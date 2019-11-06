<template>
  <div id="page">
    <Header />
    <div id="content">
      <div class="welcome-text">
        <div>
          <h1>Reports Home</h1>
          <p>Here you can browse the reports from all of the ePRaSE assessments that you have participated in.</p>
        </div>
      </div>

      <div class="list-group">
        <div v-for="assessment in assessments">
          <router-link v-bind:to="{ name: 'assessmentresults', params: { ID: assessment.part1.id }}" class="list-group-item list-group-item-action flex-column align-items-start">
            <h4>{{assessment.part1.ep_service}}</h4>
            <small>{{assessment.part1.time_created}}</small>
          <span>{{ assessment.user.name }} - <strong>{{ assessment.user.institution }}</strong></span>
          </router-link>
        </div>
      </div>

    </div>
  </div>

</template>

<script>

    import Header from './AppHeader';
    import { settings } from '../settings';
    import axios from 'axios'
    import VueAxios from 'vue-axios'
    import Vue from 'vue'

    Vue.use(VueAxios, axios);

    export default {
        name: "ResultsHome",
        components: {
            Header
        },
        data() {
            return {
                assessments : []
            }
        },
        created() {
            let baseURL = settings.baseUrl;
            let token = localStorage.getItem('token');

            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
            };
            axios.get(baseURL + 'results', requestOptions)
                .then(response => {
                    this.assessments = response.data;
                })
                .catch(function (error) {
                    console.log('error ' + error);
                });
        }
    }
</script>

<style scoped>

  #page {
    text-align: left;
  }

  #content {
    padding: 40px;
  }

  button {
    margin-top: 3px;
    margin-bottom: 3px;
    height: 50px;
    width: 500px;
  }

  .button-div {
    margin-top: 20px;
  }

</style>
