<template>
  <GroupElement ref="selection" name="scenarioGroup" :class="'mb-4'">
    <StaticElement name="scenarioHeading">
      <h2>Scenarios</h2>
    </StaticElement>
    <!-- TODO -->
  </GroupElement>
</template>

<script>

export default {
  name: 'AssessmentScenario',
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
    console.group('AssessmentScenario mounted()')
    console.groupEnd()
  }
}
</script>

<style scoped></style>