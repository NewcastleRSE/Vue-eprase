<template>
  <GroupElement ref="selection" name="patientBuildGroup" :class="'mb-4'">
    <StaticElement name="patientBuildHeading">
      <h2>Patient build</h2>
    </StaticElement>
    <TextElement name="test" placeholder="Test validation"
      :label="embolden('This is a required test', true)"
      :debounce="500" 
      :messages="{required: 'Test input must have a value'}" 
      :rules="['required']" />  
  </GroupElement>
</template>

<script>

export default {
  name: 'AssessmentPatientBuild',
  computed: {
    
  },
  emits: ['get-data-fail'],
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