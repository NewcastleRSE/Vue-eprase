<template>
  <div class="page">
    <Header />
    <div class="content">
      <div>
        <h1>ePRaSE Home</h1>
        <p>Welcome to ePRaSE 2019 To complete the assessment or view the results, use the buttons below.</p>
      </div>
      <div id="home-buttons">

        <div><button @click="assessments()"><span class="glyphicon glyphicon-list" style="font-size:12px;"></span><p>Assessments</p></button></div>
        <div class="home-buttons-text">Click here to begin the assessment questions.</div>
        <div><button><span class="glyphicon glyphicon-stats" style="font-size:12px;"></span><p>Reports</p></button></div>
        <div id="results" class="home-buttons-text">Click here to view the assessment results.</div>

      </div>
      <hr>
      <div id="help-section">
        <h3>Help Buttons</h3>
        <p>For more <strong>information</strong> about the ePRaSE system or to read user <strong>instructions</strong>, please click the buttons below.</p>
      </div>
      <div id="help-buttons">

        <AboutModal v-if="showAboutModal" :aboutModalData='aboutCustomData' @close="showAboutModal = false" />
        <button class="modal-btn btn btn-primary" id="show-about-modal" @click="showAboutModal = true">About</button>

        <InstructionsModal v-if="showModal" :modalData='customData' @close="showModal = false" />
        <button class="modal-btn btn btn-primary" id="show-modal" @click="showModal = true">Instructions</button>
      </div>

    </div>

  </div>
</template>

<script>

  import Header from './Header';
  import InstructionsModal from './InstructionsModal';
  import AboutModal from './AboutModal';

    export default {
        name: "Home",
        components: {
          Header,
          InstructionsModal,
          AboutModal
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
                window.location.href = './assessmentpart1'
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


  button.modal-btn {
    height: 40px;
    width: 120px;
    font-size: 1.2em;
  }

  #home-buttons {
    margin: 0 auto;
    padding: 20px;
    display: grid;
    grid-template-columns: 100px 300px;
    grid-gap: 20px;
    width: 400px;
  }

  .home-buttons-text {
    padding-top: 25px;
  }

  #results {
    margin-left: -20px;
  }

  #help-buttons {
    padding: 25px;
  }

  #show-modal {
    margin-left: 50px;
  }

  .content, #help-section {
    margin-top: 40px;
  }

  hr {
    width: 650px;
  }

</style>
