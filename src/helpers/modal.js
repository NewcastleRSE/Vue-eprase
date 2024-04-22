import Modal from 'bootstrap/js/dist/modal'

export function setVisible(modalId, visible) {
  const markup = document.querySelector('#' + modalId)
  if (markup) {
    const modal = Modal.getOrCreateInstance(markup)
    if (visible) {
      modal.show()
    } else {
      modal.hide()
    }
  }    
}