<template>
  <div class="modal fade" :id="modalId" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ title }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="{{ closeBtnText }}"
            @click="$emit('modalClosed')"></button>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
        <div class="modal-footer">
          <button v-if="showActionBtn" type="button" class="btn" :class="actionBtnCls" data-bs-dismiss="modal"
            @click="$emit('modalActioned')">{{ actionBtnText }}</button>
          <button type="button" class="btn" :class="closeBtnCls" data-bs-dismiss="modal" @click="$emit('modalClosed')">{{
            closeBtnText }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import Modal from 'bootstrap/js/dist/modal'

export default {
  name: 'GenericModal',
  props: {
    modalName: '',
    modalId: '',
    title: '',
    showActionBtn: false,
    actionBtnText: { 
      type: String,
      default: 'Ok'
    },
    actionBtnCls: {
      type: String,
      default: 'btn-primary'
    },
    closeBtnText: {
      type: String,
      default: 'Close'
    },
    closeBtnCls: {
      type: String,
      default: 'btn-secondary'
    }
  }
}
</script>

<style scoped></style>
