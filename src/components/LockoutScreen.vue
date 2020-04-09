<template>
  <div id="page">
    <TabHeader system-opacity="1.0" patient-opacity="1.0" scenario-opacity="0.2" report-opacity="0.2"></TabHeader>
      <div id="content">
      <h3>Patient data section completed</h3>
        <div id="timer">
          <p>You have completed the initial phase of the assessment. The next stage is to complete the patient scenarios.</p>
          <p v-if="counter > 0">You can continue on to the next phase of the assessment in: <strong>{{getTimeRemaining()}}</strong></p>
        </div>

      <div class="form-group footer" style="{text-align: center}">
        <div class="buttons">
          <button type="button" class="lock-btn btn btn-primary" @click="onExitClick()">Exit</button>
          <button v-show="nextEnabled" id="next-button" type="button" class="lock-btn btn btn-primary" @click="onNextClick()" disabled>Next</button>
          <button v-show="skipEnabled" id="skip-button" type="button" class="lock-btn btn btn-primary" @click="onNextClick()">Skip</button>
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
                counter : 0,
                currentTime : null,
                unlockTime : null,
                timeDiff : null,
                nextEnabled: true,
                skipEnabled : settings.skipButton
            }
        },
        methods : {

            getTimeRemaining() {
                const h = Math.floor(this.counter / 3600);
                const m = Math.floor(this.counter % 3600 / 60);
                const s = Math.floor(this.counter % 3600 % 60);

                let hour = h.toString();
                let mins = m.toString();
                let secs = s.toString();

                if (h < 10) { hour = '0' + hour; }
                if (m < 10) { mins = '0' + mins; }
                if (s < 10) { secs = '0' + secs; }

                return hour + ':' + mins + ':' + secs;
            },
            onNextClick()  {
                this.$router.push('/assessmentscenarios');
            },
            onExitClick() {
              this.$router.push('/logout');
            }
        },
        created : function() {

            this.currentTime = new Date();
            this.unlockTime = new Date(localStorage.getItem('assessmentUnlockTime'));

            const timeDiff = this.unlockTime.getTime() - this.currentTime.getTime();

            if (timeDiff <= 0) {
                this.counter = 0;
                this.nextEnabled = false
            }
            else {
                this.counter = timeDiff / 1000;

                const intervalId = setInterval(() => {
                    this.counter = this.counter - 1;
                    if (this.counter === 0) {
                        clearInterval(intervalId);
                        this.nextEnabled = true;
                    }

                }, 1000);
            }
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
