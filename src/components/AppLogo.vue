<template>
  <div :class="cls">
    <img src="../assets/images/logo-full.png" alt="Welcome to the ePRaSE Tool" class="eprase-logo">
  </div>
</template>

<script>
export default {
  name: "AppLogo",
  props: {
    cls: 'banner' // banner|bottomright
  }
}
</script>

<style scoped>
.bottomright {
  padding: 20px 0;  
  float: right;
}

.bottomright>img {
  height: 60px;
}

.banner {
  margin-bottom: 1rem;
}

.banner>img {
  height: 85px;
}
</style>
