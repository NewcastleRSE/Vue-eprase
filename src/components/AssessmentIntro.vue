<template>
  <div id="page">

    <TabHeader />
    <div class="content" v-if="assessmentComplete === false">
      <h1>Welcome to the ePRaSE Assessment</h1>

      <p>The following assessment is designed to evaluate the performance of an e-prescription system against a range of indicators.</p>
      <p>The ePRaSE assessment will be repeated annually.</p>

      <p></p>
      <h4>Instructions</h4>
      <p>The assessment comprises 4 parts. You will be asked to admit a series of test patients to hospital's admissions system and then
        to prescribe a series medications to those patients. You will then be asked to provide feedback about any advice or intervention from the system.</p>

      <h3>2020 ePRaSE Assessment</h3>
      <p>The original ePRaSE assessment was released in July 2019. <br/>To take part in the current ePRaSE assessment, click the button below.</p>

      <div class="buttons">
        <button class="start-btn btn btn-primary" v-if="assessment.currentPart===1" @click="onStartAssessmentClick()">Begin 2020 Assessment</button>
        <button class="btn btn-primary" v-if="assessment.currentPart>1" @click="onStartAssessmentClick()">Continue 2019 Assessment</button>
      </div>
    </div>

    <div class="content" v-if="assessmentComplete === true">
      <h1>Assessment Complete</h1>
      <p>Thank you for taking part in the 2019 ePRaSE Assessment.</p>
      <p>To view the results of this assessment, click the 'View Results' button below.</p>
      <br/>
      <p>This assessment will be repeated annually, you will be informed by email when the next assessment is available.</p>
      <div class="buttons">
        <button class="btn btn-primary" @click="onResultsClick()">View Results</button>
      </div>
    </div>

    <div class="header-content">

      <div class="header-bar-buttons">
        <button id="show-about-modal" @click="showAboutModal = true"><font-awesome-icon icon="home"></font-awesome-icon><a href="#">About</a></button>
        <button @click=contact()><font-awesome-icon icon="clipboard"></font-awesome-icon><a href="#">Contact</a></button>
        <button id="show-modal" @click="showModal = true"><font-awesome-icon icon="clipboard"></font-awesome-icon><a href="#">Instructions</a></button>
        <button @click=reports()><font-awesome-icon icon="chart-bar"></font-awesome-icon><a href="#">History</a></button>
        <button><font-awesome-icon icon="question-circle"></font-awesome-icon><a id="downloadPDF" href="../assets/user-guide.pdf" download>Help</a></button>
        <button><font-awesome-icon icon="sign-out-alt"></font-awesome-icon><span class="headerLink"><router-link to="/login">Logout</router-link></span></button>
      </div>
    </div>

    <AboutModal v-if="showAboutModal" :aboutModalData='aboutCustomData' @close="showAboutModal = false" />
    <InstructionsModal v-if="showModal" :modalData='customData' @close="showModal = false" />
  </div>


</template>

<script>

    import { dataService } from '../services/data.service';
    import { patientService } from '../services/patient.service';
    import TabHeader from './TabHeader';
    import InstructionsModal from './InstructionsModal';
    import AboutModal from './AboutModal';

    export default {
        name: "AssessmentIntro",
        components: {
           TabHeader,
            InstructionsModal,
            AboutModal,
        },
        data() {
            return {
                assessmentComplete : false,
                assessment : {
                    currentPart : dataService.getAssessmentPart()
                },
                showModal : false,
                showAboutModal : false,
                customData : {
                    title: 'ePRaSE Assessment Instructions',
                    closeButtonText: 'Close'
                },
                aboutCustomData : {
                    title: 'About ePRaSE',
                    closeButtonText: 'Close'
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
                this.$router.push({ path: './resultshome' });
            },
            onStartAssessmentClick() {
                patientService.setPatients();
                this.$router.push({ path: './assessmentpart1' });
            }
        },
        created : function() {
            this.checkAssessmentComplete();
        },
        computed: {
            user () {
                return this.$store.state.authentication.user;
            }
        },
    }
</script>

<style scoped>

  button {
    height: 40px;
    width: 170px;
    margin: 10px 0px;
    font-size: 1em;
    border-radius: 5px;
  }

  .start-btn {
    font-size: 1.2em;
    width: 280px;
  }


  .header-bar-buttons {
    padding-left: 40px;
    padding-bottom: 20px;
  }

  button a {
    padding: 3px;
  }

  #page {
    text-align: left;
  }

  .content {
    padding: 40px;
  }

  .btn-primary {
    background-color: #07818e;
  }

</style>
