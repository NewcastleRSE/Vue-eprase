<template>
  <GroupElement name="configErrorGroup" :class="'mb-4'">
    <StaticElement name="configErrorHeading">
      <h2>Config Errors</h2>
    </StaticElement>
    <!-- TODO -->
  </GroupElement>
</template>

<script>

export default {
  name: 'AssessmentConfigError',  
  computed: {
    
  },
  emits: ['save-data-fail', 'get-data-fail'],
  data() {
    return {
      
    }
  },
  methods: {  
    
  },
  mounted() {
    console.group('AssessmentConfigError mounted()')
    console.groupEnd()
  },
  beforeUnmount() {
    console.group('AssessmentConfigError beforeUnmount()')
    console.groupEnd()
  }
}
</script>

<style scoped></style>