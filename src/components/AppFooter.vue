<template>

  <div class="footer-content">

    <div class="footer-bar-buttons">
      <button @click="showAboutModal = true"><font-awesome-icon icon="info-circle"></font-awesome-icon><a href="#">About</a></button>
      <button @click="showModal = true"><font-awesome-icon icon="clipboard"></font-awesome-icon><a href="#">Instructions</a></button>
      <button @click=reports()><font-awesome-icon icon="chart-bar"></font-awesome-icon><a href="#">Reports</a></button>
    <!-- <button><font-awesome-icon icon="question-circle"></font-awesome-icon><a id="downloadPDF"  @click="downloadFile()">User Guide</a></button> -->
      <button><font-awesome-icon icon="question-circle"></font-awesome-icon><a id="downloadPDF" href="https://eprasedocs.blob.core.windows.net/web/Eprase2022UserGuide.pdf" target="_blank">User Guide</a></button>
      <button @click="showContactModal = true"><font-awesome-icon icon="clipboard"></font-awesome-icon><a href="#">Contact</a></button>
      <button><font-awesome-icon icon="sign-out-alt"></font-awesome-icon><span class="headerLink"><router-link to="/login">Logout</router-link></span></button>
    </div>

    <AboutModal v-if="showAboutModal" :aboutModalData='aboutCustomData' :user-id="user.user_id" @close="showAboutModal = false"  />
    <InstructionsModal v-if="showModal" :modalData='customData' :user-id="user.user_id" @close="showModal = false"  />
    <ContactModal v-if="showContactModal" :contactModalData='contactCustomData' :user-id="user.user_id" @close="showContactModal = false"  />

  </div>

</template>

<script>

    import InstructionsModal from './InstructionsModal';
    import AboutModal from './AboutModal';
    import ContactModal from './ContactModal';

    import axios from 'axios'
    import VueAxios from 'vue-axios'
    import Vue from 'vue'

    Vue.use(VueAxios, axios);

    export default {
        name: "AppFooter",
        components: {
            InstructionsModal,
            AboutModal,
            ContactModal
        },
        computed : {
            user() {
                return this.$store.state.authentication.user;
            }
        },
        data() {
            return {
                showModal : false,
                showAboutModal : false,
                showContactModal : false,
                customData : {
                    title: 'ePRaSE Instructions',
                    closeButtonText: 'Close'
                },
                aboutCustomData : {
                    title: 'About ePRaSE',
                        closeButtonText: 'Close'
                },
                contactCustomData : {
                    title: 'Contacts for ePRaSE',
                        closeButtonText: 'Close'
                }
            }
        },
        methods : {
            reports() {
                this.$router.push({ path: './resultshome' });
            },
            downloadFile() {
              axios({
                    url: './Eprase2022UserGuide.pdf',
                    method: 'GET',
                    responseType: 'blob',
                }).then((res) => {
                    var FILE = window.URL.createObjectURL(new Blob([res.data]));

                    // create an element 'x' which can be clicked
                    const link = document.createElement('x');
                    link.href = FILE;
                    link.setAttribute('download', 'file.pdf');
                    document.body.appendChild(link);
                    link.click();

                    // clean up "x" element & remove ObjectURL
                    document.body.removeChild(link);
                    URL.revokeObjectURL(FILE);

                });
          }
        }
    }

</script>

<style scoped>

  button {
    height: 40px;
    width: 170px;
    margin: 10px 0px;
    font-size: 1em;
    border-width: 1px;
  }

  button a {
    padding: 3px;
  }

  .footer-bar-buttons {
    padding-left: 40px;
    padding-bottom: 20px;
    border-width: 1px;
  }

</style>
