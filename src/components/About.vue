<template>

  <div id="page">
    <Header />
    <div class="content" >
      <h1>About ePRaSE</h1>
      <p>The ePrescribing Risk and Safety Evaluation tool (ePRaSE) is designed to evaluate ePrescription services,
        in order to determine their usefulness and to encourage the correct use of these systems
        and deliver improved patient outcomes.</p>
      <p>ePRaSE has been developed by the Pharmacy Department at Newcastle University, in association with The Royal Victoria Infirmary and the NHS Trust.</p>
      <h3>Credits</h3>
      <p>The assessments were developed by Stephanie Klein, Jude Heed and Andrew Heed.</p>
      <p>The ePRaSE tool was developed by Mike Simpson from the Digital Institute at Newcastle University.</p>
      <h3>Partners</h3>
      <p id="logo-bar">
        <span class="logos"><img id="di-logo" src="../assets/Digital_Institute.jpg" alt="Digital Institute" ></span>
        <span class="logos"><img id="nuth-logo" src="../assets/NUTHlogo.png" alt="The Newcastle upon Tyne Hosptials NHS Foundation Trust"></span>
        <span class="logos"><img id="pharm-logo" src="../assets/pharmacy.png" alt="School of Pharmacy" ></span></p>
    </div>

  </div>
</template>

<script>

  import Header from './Header';

    export default {
        name: "About",
        components: {
          Header
        }
    }
</script>

<style scoped>

  #di-logo, #pharm-logo {
    height: 50px;
    max-width: 200px;
  }

  #nuth-logo {
    height: 50px;
  }

  #logo-bar {
    padding-top: 40px;
    width: 100%;
  }

  .content {
    padding: 40px;
  }

  .logos {
    padding-right: 70px;
  }


</style>
