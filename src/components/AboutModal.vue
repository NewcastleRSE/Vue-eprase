<template>
  <transition name="modal">
    <div class="modal-mask">
      <div id='modalContainer'>
        <div class='modal-header'>
          <h3>
            {{ aboutModalData.title }}
          </h3>
        </div>
        <div class='modal-body'>
          <p>The ePrescribing Risk and Safety Evaluation tool (ePRaSE) is designed to evaluate ePrescription services,
            in order to determine their usefulness and to encourage the correct use of these systems
            and deliver improved patient outcomes.</p>
          <p>ePRaSE has been developed by the Pharmacy Department at the The Newcastle Hospitals NHS Foundation Trust and Newcastle University</p>
          <h4>Credits</h4>
          <p>The assessments were developed by Stephanie Klein and Jude Heed.</p>
          <p>The ePRaSE tool was developed by Mike Simpson and Rebecca Osselton from the Digital Institute at Newcastle University.</p>

        </div>
        <div class='modal-footer'>
          <button type="button" class="close-btn btn btn-primary" @click="close">{{aboutModalData.closeButtonText}}</button>
        </div>

      </div>
    </div>
  </transition>
</template>

<script>

    import { dataService } from '../services/data.service';

    export default {
        name: "AboutModal",
        props: {
            aboutModalData: {
                title: '',
                closeButtonText: ''
            },
            userId: ''
        },
        methods: {
            close (){
                dataService.audit('View about', '/assessmentintro');
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
