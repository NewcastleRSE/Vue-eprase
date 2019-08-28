<template>
<div id="page">
  <Header />
  <div id="content">
    <h3>ePRaSE Assessment</h3>
    <h4>Part 2 - Assessment Preparation</h4>
    <p>In preparation for the assessment, please complete the following tasks:</p>
    <div align="center">
      <div class="patient-info">
        <h4>Patient Data</h4>
        <p>Please admit the following test patients into your hospital's patient admissions system (or a test environment).</p>
        <p>Populate any other mandatory fields with appropriate self-generated information. When you are done, click <strong>Next</strong> to continue.</p>

       <Patients />
      </div>
    </div>

    <div class="assessment">
      <p>Please note any difficulties or interventions from the system that you encountered when completing this task using the box below.</p>
      <div align="center">
        <div class="alert alert-warning" role="alert">
          To optimise the use of this tool please record ALL types of guidance that appears on your system screen in the comments boxes provided
        </div>
        <form>
          <textarea type="text" class="form-control" name="input" id="patient-intervention" v-model="assessment.qualitative_data" placeholder="Enter notes here..." maxlength="250"></textarea>
        </form>
      </div>
    </div>

    <div class="form-group footer" align="center">
      <div class="buttons">
        <p>When all of the patients have been admitted to your ePrescription System, click <strong>Next</strong>.</p>
        <button type="button" class="btn btn-primary"  id="exit-button" @click="onExitClick()">Exit</button>
        <button type="button" class="btn btn-primary"  id="next-button" @click="onNextClick()" :disabled="isFormInvalid">Next</button>
      </div>
    </div>

  </div>
</div>
</template>

<script>

    import Header from './Header';
    import { dataService } from '../services/data.service';
    import  Patients from './Patients';

    export default {
        name: "AssessmentPart2",
        components: {
            Header,
            Patients
        },
        computed: {
            isFormInvalid() {
                return Object.keys(this.fields).some(key => this.fields[key].invalid);
            }
        },
        data() {
            return {
                submitted: false,
                assessment: {
                    currentPart: dataService.getAssessmentPart(),
                    qualitative_data : '',
                    time_taken: ''
                },
                startTime: ''
            }
        },
        methods: {
            resetForm: function () {
                this.$data.assessment = {};
                this.errors.clear();
            },
            onExitClick() {
                window.location.href = './logout'
            },
            onNextClick()  {
                this.submitted = true;

                this.$validator.validate().then(valid => {
                    if (valid) {

                        let endTime = new Date();
                        let elapsedTime = endTime.getTime() - this.startTime.getTime();
                        this.assessment.time_taken = elapsedTime/1000;

                        const qualitative_data = this.assessment.qualitative_data;
                        const time_taken = this.assessment.time_taken;
                        const { dispatch } = this.$store;
                        if (time_taken){
                            dispatch('authentication/savePart2Data', { qualitative_data, time_taken });
                        }
                    }
                });
            }
        },
        created : function() {
            this.startTime = new Date();
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

  h4 {
    font-weight: bold;
    text-align: left;
    padding-top: 25px;
  }

  .patient-info p {
    text-align: left;
  }

  .assessment {
    padding-bottom: 20px;
  }

  .assessment p {
    text-align: left;
  }

  input {
    width: 200px;
    margin-right: 35px;
    float: right;
  }

  select {
    width: 200px;
    margin-right: 35px;
    float: right;
  }


  #patient-intervention {
    width: 600px;
    height: 100px;
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

  .alert-warning {
    background-color: #f6ecb8;
    border-color: #ffd47d;
  }



</style>
