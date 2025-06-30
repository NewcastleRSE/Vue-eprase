<template>
  <GroupElement ref="selection" name="patientBuildGroup" :class="'mb-4'">
    <StaticElement name="patientBuildHeading">
      <h2>Patient build</h2>
    </StaticElement>
    <StaticElement name="patientBuildBody">
    
    </StaticElement>
  </GroupElement>
</template>

<script>

export default {
  name: 'AssessmentPatientBuild',
  props: {
    isActive: {
      type: Boolean,
      value: false,
      required: true
    },
    stepDir: {
      type: Number,
      value: 1,
      required: true
    }
  },
  async isActive(newVal, oldVal) { 

    console.group('AssessmentPatientBuild isActive() watcher')      
    console.debug('New value', newVal, 'old value', oldVal)

    if (newVal === false && this.stepDir == 1) {
      // User has moved away forwards in the dialogs => save the info
      // const patientResponse = await this.savePatientList()        
      // if (patientResponse !== true) {
      //   this.$emit('save-data-fail', patientResponse)
      // }
    } else if (newVal === true && this.stepDir == 1) {
      // User has moved onto this dialog => update assessment status
      const statusResponse = await this.updateAssessmentStatus('Patient build started')
      if (statusResponse !== true) {
        this.$emit('save-data-fail', statusResponse)
      }
    }
    console.groupEnd()  
  },
  computed: {
    
  },
  emits: ['get-data-fail', 'save-data-fail'],
  data() {
    return {
      serverError: false,   
      startTime: ''
    }
  },
  methods: {  
    
  },
  mounted() {
    console.group('AssessmentPatientBuild mounted()')
    console.groupEnd()
  }
}
</script>

<style scoped></style>