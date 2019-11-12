<template>
  <div id="page">
    <TabHeader />
    <div class="content">

      <div>

        <img src="../assets/logo.png" alt="ePRaSE" class="eprase-logo-header">
        <h1>ePRaSE Home</h1>
        <p>Welcome to ePRaSE 2020!</p>

        <button class="modal-btn btn" @click="assessments()">Start</button>
      </div>


      <div id="help-section">

        <h3>Help Buttons</h3>
        <p>For more <strong>information</strong> about the ePRaSE system or to read user <strong>instructions</strong>, please click the buttons below.</p>
      </div>

      <AboutModal v-if="showAboutModal" :aboutModalData='aboutCustomData' @close="showAboutModal = false" />
      <InstructionsModal v-if="showModal" :modalData='customData' @close="showModal = false" />


    </div>

  </div>
</template>

<script>

  import InstructionsModal from './InstructionsModal';
  import AboutModal from './AboutModal';
  import TabHeader from './TabHeader';

    export default {
        name: "AppHome",
        components: {
          InstructionsModal,
          AboutModal,
          TabHeader
        },
        data() {
            return {
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
            assessments() {
                this.$router.push({ path: './assessmentintro' });
            }
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
    width: 100px;
    height: 75px;
    padding: 0;
    margin:0;
    border-radius: 5px;
  }

  button p {
    text-align: center;
    font-size: 12px;
    padding: 0;
    margin:0;
  }


  #help-section {
    padding-top: 30px;
  }


  button.modal-btn {
    height: 40px;
    width: 120px;
    font-size: 1.2em;
    background-color: #07818e;
    color: #fff;
  }

  .content{
    padding: 40px;
    text-align: left;
  }

  .header-bar {
    height: 84px;
  }

  .header-content {
    max-width: 1000px;
    margin: auto;
  }

  .eprase-logo-header {
    height: 50px;
    float: right;
    margin-top: 17px;
    margin-left: 30px;
  }



  .header-bar-buttons button {
    margin: 7px 5px 3px 0px;
    height: 70px;
    width: 95px;
    padding: 0;
    border-radius: 5px;
  }

  .header-bar button p {
    text-align: center;
    margin:0;
    padding-top:2px;
    padding-bottom:2px;
    font-size: 12px;
  }

  #downloadPDF {
    color: #2c3e50;
    text-decoration: none;
  }

  .headerLink {
    color: #2c3e50;
    text-decoration: none;
  }



</style>
