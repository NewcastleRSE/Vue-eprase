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