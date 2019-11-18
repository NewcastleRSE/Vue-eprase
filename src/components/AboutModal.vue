<template>
  <transition name="modal">
    <div class="modal-mask">
      <div id='modalContainer'>
        <div class='modal-header'>
          <h2>About ePRaSE</h2>
        </div>
        <div class='modal-body'>
          <p>The ePrescribing Risk and Safety Evaluation tool (ePRaSE) is designed to evaluate ePrescription services,
            in order to determine their usefulness and to encourage the correct use of these systems
            and deliver improved patient outcomes.</p>
          <p>ePRaSE has been developed by the Pharmacy Department at Newcastle University, in association with The Royal Victoria Infirmary and the NHS Trust.</p>
          <h4>Credits</h4>
          <p>The assessments were developed by Stephanie Klein, Jude Heed and Andrew Heed.</p>
          <p>The ePRaSE tool was developed by Mike Simpson from the Digital Institute at Newcastle University.</p>

        </div>
        <div class='modal-footer'>
          <button type="button" class="close-btn btn btn-primary" @click="close">Close</button>
        </div>

      </div>
    </div>
  </transition>
</template>

<script>
    export default {
        name: "AboutModal",
        props: {
            aboutModalData: {
                type: Object,
                required: true
            }
        },
        methods: {
            close (){
                this.$emit('close')
            }
        }
    }
</script>

<style scoped>

  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;
  }

  #modalContainer {
    position: absolute;
    z-index: 100;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    width: 80%;
    height: 65%;
    background: #FFF;
    border-radius: 25px;
  }


  .close-btn {
    background-color: #07818e;
  }

  .modal-body {
    padding: 30px;
  }

  .modal-body p {
    padding: 5px;
  }

  .modal-footer{
    position: fixed;
    width: 100%;
    bottom: 0;
  }

  #di-logo, #pharm-logo {
    height: 50px;
    max-width: 200px;
  }

  #nuth-logo {
    height: 50px;
  }

  #logo-bar {
    padding-top: 20px;
    width: 100%;
  }

  .logos {

    padding-right: 70px;
  }

</style>
