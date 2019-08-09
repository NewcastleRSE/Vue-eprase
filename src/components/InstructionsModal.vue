<template>
  <transition name="modal">
    <div class="modal-mask">
      <div id='modalContainer'>

        <div class='modal-header'>
          <h1>
            {{modalData.title}}
          </h1>
        </div>
        <div class='modal-body'> <p>The ePRaSE assessment involves 10 test patient scenarios. For each patient, you will be asked to complete two sets of tasks.</p>
          <div class="instructions">
            <h3>Step 1: Enter Patient Information</h3>
            <p>You will be asked to admit the test patients into your ePrescription system.</p>
          </div>
          <div class="instructions">
            <h3>Step 2: Prescribe Medication</h3>
            <p>You will be asked to prescribe a number of medicines to the test patient. You will be asked a short series of questions about any feedback or intervention from the e-Prescribing System.</p>
          </div>
          <div class="instructions">
            <h3>Additional Information</h3>
            <p>Progress is saved between patients. Each scenario is expected to take approximately 10 minutes to complete.</p>
            <p>Once the assessment is complete, you will be able to view your results.</p>
          </div>
        </div>
        <div class='modal-footer'>
          <button type="button" class="btn btn-primary" @click="close">{{modalData.closeButtonText}}</button>
        </div>

     </div>
    </div>
  </transition>
</template>

<script>
    export default {
        name: "InstructionsModal",
        props: {
            modalData: {
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
    height: 55%;
    background: #FFF;
    border-radius: 25px;
  }

  .modal-body {
    padding: 30px 0px;
  }

  .modal-body p {
    padding: 5px 15px;
  }

  .modal-footer{
    position: fixed;
    width: 100%;
    bottom: 0;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  .fade-enter-active, .fade-leave-active {
    transition: 0.2s opacity ease-out;
  }

</style>
