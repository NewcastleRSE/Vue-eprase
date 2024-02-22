<template>
  <transition name="modal">
    <div class="modal-mask">
      <div id='modalContainer'>
        <div class='modal-header'>
          <h4>
            {{ contactModalData.title }}
          </h4>
        </div>
        <div class='modal-body'>
         <p> Contacts for the ePrase project are:</p>


          <b-list-group>
            <b-list-group-item class="d-flex justify-content-between align-items-center">
              <i class="bi bi-envelope"></i>
              rseteam@newcastle.ac.uk
            </b-list-group-item>
            <b-list-group-item class="d-flex justify-content-between align-items-center">
              <i class="bi bi-envelope"></i>
              stephanie.klein@nhs.net
            </b-list-group-item>
            <b-list-group-item class="d-flex justify-content-between align-items-center">
              <i class="bi bi-envelope"></i>
              jude.heed@newcastle.ac.uk
            </b-list-group-item>

          </b-list-group>

        </div>
        <div class='modal-footer'>
          <button type="button" class="close-btn btn btn-primary" @click="close">{{ contactModalData.closeButtonText }}</button>
        </div>

      </div>
    </div>
  </transition>
</template>

<script>

    import { dataService } from '../services/data.service';

    export default {
        name: "ContactModal",
        props: {
            contactModalData: {
                title: '',
                closeButtonText: ''
            },
            userId: ''
        },
        methods: {
            close (){
                dataService.audit('View contact', '/assessmentintro');
                this.$emit('close')
            }
        }
    }
</script>

<style scoped>

  h4 {
    margin-left: 15px;
  }

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
    width: 50%;
    height: 45%;
    background: #FFF;
    border-radius: 25px;
  }

  .modal-body {
    padding: 30px 30px;
  }

  .modal-body p {
    padding: 0;
  }

  .modal-footer{
    position: fixed;
    width: 100%;
    bottom: 0;
  }

  .close-btn {
    background-color: #07818e;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  .fade-enter-active, .fade-leave-active {
    transition: 0.2s opacity ease-out;
  }


</style>
