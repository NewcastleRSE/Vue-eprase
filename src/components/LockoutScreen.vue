<template>
  <div id="page">
    <AppHeader />
      <div id="content">
      <h1>ePRaSE Assessment</h1>
      <h3>Thank You</h3>
      <p>You have completed the initial phase of the assessment.</p>
      <p v-if="counter > 0">You can continue on to the next phase of the assessment in:</p>
      <p v-if="counter > 0">{{getTimeRemaining()}}</p>
      <div class="form-group footer" style="{text-align: center}">
        <div class="buttons">
          <button v-show="nextEnabled" id="next-button" type="button" class="btn btn-primary" @click="onNextClick()" disabled>Next</button>
          <button v-show="skipEnabled" id="skip-button" type="button" class="btn btn-primary" @click="onNextClick()">Skip</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

    import { settings } from '../settings'
    import AppHeader from './AppHeader';

    export default {
        name: "LockoutScreen",
        components: {
           AppHeader
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
                this.$router.push('/assessmentpart4');
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

  .footer {
    margin-top: 10px;
    margin-bottom: 40px;
  }

  .footer p {
    padding-bottom: 10px;
  }

</style>
