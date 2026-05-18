<template>
  <GroupElement ref="practiceIntroGroup" name="practiceIntroGroup" :class="'my-4'">  
    <StaticElement name="practiceIntroHeading">
      <h2>ePRaSE Practice Mode - Introduction</h2>
    </StaticElement>
    <StaticElement name="practicePreambleInfo">
      <div class="alert alert-info" role="alert">
        TODO - need some wording here...
      </div>
    </StaticElement>    
  </GroupElement>  
</template>

<script>

export default {
  name: 'PracticeIntro'
}
</script>

<style scoped></style>
