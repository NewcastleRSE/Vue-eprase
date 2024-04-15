<template>
  <div id="page">
    <TabHeader system-opacity="1.0" patient-opacity="1.0" scenario-opacity="0.2" report-opacity="0.2"></TabHeader>
      <div id="content">
      <h3>Patient data section completed</h3>
        <div id="timer">
          <p>You have completed the initial phase of the assessment. The next stage is to complete the patient scenarios.</p>
           <div class="alert alert-warning" role="alert">
                <p><strong>Once you have entered this section, you will need to complete it fully, so please make sure you have enough time set aside to complete the scenarios.</strong></p>
                <p><strong>Reminder: the browser BACK button has been disabled. Attempts to leave or go back to previous scenarios will lead to your work being lost!</strong></p>
           </div>
        </div>

      <div class="form-group footer" style="{text-align: center}">
        <div class="buttons">
          <button type="button" class="lock-btn btn btn-primary" @click="onExitClick()">Exit</button>
          <button type="button" class="lock-btn btn btn-primary" @click="onNextClick()">Next</button>
        </div>
      </div>
    </div>
    <AppLogo></AppLogo>
  </div>
</template>

<script>

    import { settings } from '../settings'
    import TabHeader from './TabHeader';
    import AppLogo from './AppLogo';
    import {patientService} from "../services/patient.service";

    export default {
        name: "LockoutScreen",
        components: {
           TabHeader,
           AppLogo
        },
        data() {
            return {
                patientscompleted : false,
            }
        },
        methods : {
            onNextClick()  {
                if(this.patientscompleted){
                    patientService.setConfigErrors();
                }
                this.$router.push('/assessmentscenarios');
            },
            onExitClick() {
                this.$router.push('/logout');
            }
        },
        created : function() {

             // if this is true, then the user has jumped from assessmentintro and will need to create patientlist and testlist
            this.patientscompleted = this.$route.query.patientscompleted;

            if(this.patientscompleted){
                this.nextEnabled = true;
                this.disabled = false;
                patientService.getCompletePatientDetailsFromIds();
            }
        },
        mounted : function() {
          history.pushState(null, null, location.href);
            window.onpopstate = function () {
                history.go(1);
            };
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

  #timer {
    padding: 20px 0;
  }

  button:disabled {
    background-color: dimgray;
  }

  button {
    height: 40px;
    width: 100px;
    margin: 10px 0px;
    font-size: 1.2em;
    margin: 0 50px;
  }

  .lock-btn {
    background-color: #029a99;
    border: 0;
  }

  .footer {
    margin-top: 10px;
    margin-bottom: 40px;
  }

  .footer p {
    padding-bottom: 10px;
  }

</style>
