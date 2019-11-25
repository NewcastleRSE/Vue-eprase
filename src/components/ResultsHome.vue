<template>
  <div id="page">

    <TabHeader system-opacity="0.2" patient-opacity="0.2" scenario-opacity="0.2" report-opacity="0.2"></TabHeader>

    <div id="content">
      <div class="welcome-text">
        <div>
          <h2>Reports Home</h2>
          <p>Here you can browse the reports from all of the ePRaSE assessments that you have participated in.</p>
        </div>
      </div>

      <div v-if="assessments">
        <p>You currently have no reports available.</p>
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

    <div class="footer-bar-buttons">
      <button><font-awesome-icon icon="home"></font-awesome-icon><span class="headerLink"><router-link to="/assessmentintro">Home</router-link></span></button>
        <button><font-awesome-icon icon="sign-out-alt"></font-awesome-icon><span class="headerLink"><router-link to="/login">Logout</router-link></span></button>
    </div>

  </div>

</template>

<script>

    import { settings } from '../settings';
    import TabHeader from './TabHeader';
    import axios from 'axios'
    import VueAxios from 'vue-axios'
    import Vue from 'vue'

    Vue.use(VueAxios, axios);

    export default {
        name: "ResultsHome",
        components: {
          TabHeader
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
    height: 40px;
    width: 170px;
    margin: 10px 0px;
    font-size: 1em;
  }

  button a {
    padding: 3px;
  }

  .footer-bar-buttons {
    padding-left: 40px;
    padding-bottom: 20px;
  }

</style>
