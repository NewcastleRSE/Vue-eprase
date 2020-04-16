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

      <div v-show="assessment == null">
        <p>You currently have no reports available.</p>
      </div>

      <div class="list-group">
     <!--   <div v-for="assessment in assessments"> -->
          <div v-if="assessment">
          <router-link v-bind:to="{ name: 'assessmentresults', params: { ID: assessment.system_id }}" class="list-group-item list-group-item-action flex-column align-items-start">
            <h4>{{assessment.ep_service}}</h4>
            <p>{{ assessment.username }}</p>
            <p>{{assessment.time_created}}</p>
          </router-link>
        </div>
      </div>

    </div>

    <div class="footer-bar-buttons">
      <button><font-awesome-icon icon="home"></font-awesome-icon><span class="headerLink"><router-link to="/assessmentintro">Home</router-link></span></button>
        <button><font-awesome-icon icon="sign-out-alt"></font-awesome-icon><span class="headerLink"><router-link to="/login">Logout</router-link></span></button>
    </div>
    <AppLogo></AppLogo>

  </div>

</template>

<script>

    import { settings } from '../settings';
    import TabHeader from './TabHeader';
    import axios from 'axios'
    import VueAxios from 'vue-axios'
    import Vue from 'vue'
    import AppLogo from "./AppLogo";

    Vue.use(VueAxios, axios);

    export default {
        name: "ResultsHome",
        components: {
          TabHeader,
          AppLogo
        },
        data() {
            return {
                assessments : [],
                assessment : {
                  id: '',
                  username: '',
                  email: '',
                  institution : '',
                  ep_service : '',
                  time_created : '',
                  system_id : ''
                },
                institution_id : ''
            }
        },
        created() {
            let baseURL = settings.baseUrl;
            let token = localStorage.getItem('token');
            this.institution_id = localStorage.getItem('institutionId');

            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
            };
            axios.get(baseURL + 'result?ID=' + this.institution_id, requestOptions)
                .then(response => {

                    let data = response.data;

                    this.assessment.username = data.user.username;
                    this.assessment.institution = 145;
                    this.assessment.ep_service = data.system.ep_service;
                    let timestamp = data.system.time_created;
                    var date = new Date(timestamp * 1000).toLocaleDateString("en-GB");
                    this.assessment.time_created = date;

                    this.assessment.system_id = data.system.id;

                    //TODO should be assessment id?
                    localStorage.setItem('assessmentId', this.assessment.system_id);

                  /*
                  for (let assessment in this.assessments){
                    if(this.assessments.hasOwnProperty(assessment)){
                  } */
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
