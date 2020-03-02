<template>
 <div id="page">
   <TabHeader system-opacity="1.0" patient-opacity="1.0" scenario-opacity="0.5" report-opacity="0.2"></TabHeader>
   <div id="content">
     <h3>Assessment Scenarios</h3>
     <p>Please follow the instructions for each scenario.<br/></p>
     <div align="center">
       <h4>Test {{ getCurrentTestIndex + 1 }} of {{ numPrescriptions }}</h4>

       <ScenarioPrescription v-if="assessment.isPrescriptionTest"></ScenarioPrescription>
       <ConfigError v-if="assessment.isConfigErrorTest "></ConfigError>
     </div>
   </div>
   <AppLogo></AppLogo>
 </div>

</template>

<script>

    import { settings } from '../settings';
    import ScenarioPrescription from "./ScenarioPrescription";
    import ConfigError from "./ConfigError";
    import TabHeader from"./TabHeader";
    import AppLogo from "./AppLogo";

    export default {
        name: "AssessmentScenarios",
        components: {
            ScenarioPrescription,
            ConfigError,
            TabHeader,
            AppLogo
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
                numPrescriptions: settings.numPrescriptions + settings.numConfigError
            }
        },
        beforeUpdate: function() {
            let index = this.$store.state.testIndex;
            let tests = this.$store.state.testList;
            let currentTest = tests.testList[index];

            if(currentTest !== undefined) {
              // make sure we get the right type of test
              if (currentTest.hasOwnProperty('configErrorCode')) {
                this.assessment.isPrescriptionTest = false;
                this.assessment.isConfigErrorTest = true;
              }
              else {
                this.assessment.isPrescriptionTest = true;
                this.assessment.isConfigErrorTest = false;
              }
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
