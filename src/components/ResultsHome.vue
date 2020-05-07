<template>
  <div id="page">

    <div id="header" class="level">
    </div>

    <div id="content">
      <div class="welcome-text">
        <div>
          <h2>Reports Home</h2>
          <p>Here you can browse the reports from all of the ePRaSE assessments that you have participated in.</p>
        </div>
      </div>

      <div v-show="id === 0">
        <p>You currently have no reports available.</p>
      </div>

      <div class="list-group">
          <div v-if="id > 0">
          <router-link v-bind:to="{ name: 'assessmentresults', params: { ID: id }}" class="list-group-item list-group-item-action flex-column align-items-start">
            <p><strong>{{ institution }}</strong></p>
            <p>{{ ep_service }}</p>
            <p>{{ time_created }}</p>
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
    import {dataService} from "../services/data.service";

    Vue.use(VueAxios, axios);

    export default {
        name: "ResultsHome",
        components: {
          TabHeader,
          AppLogo
        },
        data() {
            return {
                assessment : [],
                id : 0,
                ep_service : '',
                institution : '',
                time_created : '',
            }
        },
        methods: {

          getReport(){
            dataService.getReportByInstitutionId().then(data => {
              this.assessment = data;

              // empty array if assessment not started
              if(this.assessment){

                this.ep_service = this.assessment.system.ep_service;
                this.institution = this.assessment.user.institution['orgName'];
                let timestamp = this.assessment.system.time_created;
                var date = new Date(timestamp * 1000).toLocaleDateString("en-GB");
                this.time_created = date;

                this.id = localStorage.getItem('assessmentId');
              }
            });
          }
        },
        created() {
            this.getReport();
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

  #header {
    background-image: url("../assets/pills-bw.png");
    background-size: 100% auto;
    background-repeat: no-repeat;
    border-top-left-radius: 25px;
    border-top-right-radius: 25px;
  }
  .level {
    height: 80px;
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
