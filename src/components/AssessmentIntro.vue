<template>
  <div id="page">
    <Header />
    <div class="content" v-if="assessmentComplete == false">
      <h1>ePRaSE Assessment</h1>
      <p>The following assessment is designed to evaluate the performance of an e-prescription system against a range of indicators.</p>
      <p>The ePRaSE assessment will be repeated annually.</p>
      <h3>2019 ePRaSE Assessment</h3>
      <p>The original ePRaSE assessment was released in July 2019. <br/>To take part in the current ePRaSE assessment, click the button below.</p>
      <div class="buttons">
        <button class="btn btn-primary" v-if="assessment.currentPart==1" @click="onStartAssessmentClick()">Begin 2019 Assessment</button>
        <button class="btn btn-primary" v-if="assessment.currentPart>1" @click="onStartAssessmentClick()">Continue 2019 Assessment</button>
      </div>
      <div id="section">
        <p>For more detailed instructions, <router-link to="/instructions">click here</router-link>.</p>
      </div>
    </div>

    <div class="content" v-if="assessmentComplete == true">
      <h1>Assessment Complete</h1>
      <p>Thank you for taking part in the 2019 ePRaSE Assessment.</p>
      <p>To view the results of this assessment, click the 'View Results' button below.</p>
      <br/>
      <p>This assessment will be repeated annually, you will be informed by email when the next assessment is available.</p>
      <div class="buttons">
        <button class="btn btn-primary" @click="onResultsClick()">View Results</button>
      </div>
    </div>
  </div>

</template>

<script>

    import { dataService } from '../services/data.service';
    import Header from './Header';

    export default {
        name: "AssessmentIntro",
        components: {
            Header
        },
        data() {
            return {
                assessmentComplete : false,
                assessment : {
                    currentPart : dataService.getAssessmentPart()
                }
            }
        },
        methods: {
            checkAssessmentComplete() {
                this.assessmentComplete = localStorage.getItem('assessmentComplete');
                if(this.assessmentComplete == null){
                    this.assessmentComplete = false;
                }
               return this.assessmentComplete;
            },
            onResultsClick() {
                window.location.href = './resultshome'
            },
            onStartAssessmentClick() {
                window.location.href = './assessmenthome'
            }
        },
        created : function() {
            this.checkAssessmentComplete();
        }
    }
</script>

<style scoped>

  button {
    height: 40px;
    width: 250px;
    margin: 10px 0px;
    font-size: 1.2em;
  }

  #page {
    text-align: left;
  }

  .content {
    padding: 40px;
  }

  #section {
    padding-top: 20px;
  }

</style>
