<template>
 <div id="page">
   <Header />
   <div id="content">
     <h1>ePRaSE Assessment</h1>
     <h3>Part 4 - Assessment Scenarios</h3>
     <p>Please follow the instructions for each scenario.<br/></p>
     <div align="center">
       <h4>Test {{ getCurrentTestIndex + 1 }} of {{ numPrescriptions }}</h4>

       <Prescription v-if="assessment.isPrescriptionTest"></Prescription>
       <ConfigError v-if="assessment.isConfigErrorTest "></ConfigError>
     </div>
   </div>

 </div>

</template>

<script>

    import Header from './Header';
    import Prescription from "./Prescription";
    import ConfigError from "./ConfigError";
    import { patientService } from '../services/patient.service';

    export default {
        name: "AssessmentPart4",
        components: {
            Header,
            Prescription,
            ConfigError
        },
        computed: {
            getCurrentTestIndex() {
                return this.$store.state.testIndex;
            }
        },
        data() {
            return {
                assessment: {
                    isPrescriptionTest: true,
                    isConfigErrorTest: false
                },
                numPrescriptions: patientService.numPrescriptions
            }
        },
        beforeUpdate: function() {
            let index = this.$store.state.testIndex;
            let tests = this.$store.state.testList;
            let currentTest = tests.testList[index];

            // make sure we get the right type of test
            if (currentTest.category === 'config-error') {
                this.assessment.isPrescriptionTest = false;
                this.assessment.isConfigErrorTest = true;
            }
            else {
                this.assessment.isPrescriptionTest = true;
                this.assessment.isConfigErrorTest = false;
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

</style>
