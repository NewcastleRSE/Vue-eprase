<template>
  <div class="row">
    <div>
      <div class="p-2 float-end">
        <div class="dropdown">
          <button ref="loginInfoBtn" class="btn btn-secondary dropdown-toggle" type="button" :title="orgName"
            @click="toggleDropdownMenu()" data-bs-toggle="dropdown" data-bs-auto-close="outside">
            <i class="bi me-2" :class="isLoggedIn ? 'bi-person-fill-check' : 'bi-person-fill-x'"></i>{{ isLoggedIn ?
            'Logged in as ' + user : 'Not logged in' }}
          </button>
          <ul class="dropdown-menu">
            <li>
              <a class="dropdown-item" @click="saveProgress">{{ isLoggedIn ? 'Save progress &amp; log out' : 'Log in ' }}</a>
            </li>
          </ul>          
        </div>
      </div>
    </div>
    <ExitModal ref="exitModal" :showActionBtn="true" @modal-actioned="exit()" />
  </div>
</template>

<script>

import { Dropdown } from 'bootstrap'
import { mapState } from 'pinia'
import { authenticationStore } from '../stores/authentication'
import ExitModal from "./ExitModal"

export default {
  name: "LoginInfo",
  components:{
    ExitModal
  },
  computed: {
    ...mapState(authenticationStore, ['user', 'orgName', 'isLoggedIn']),
    exitModal() {
      return this.$refs.exitModal
    }
  },
  data() {
    return {
      loginInfoDd: null
    }
  },
  methods: {
    exit() {
      this.$router.push('/logout')
    },
    toggleDropdownMenu() {
      this.loginInfoDd.toggle()
    },
    saveProgress() {
      if (this.isLoggedIn) {
        this.exitModal.show()
      } else {
        this.$router.push('/login')
      }
    }
  },  
  mounted() {
    this.loginInfoDd = new Dropdown(this.$refs.loginInfoBtn)
  }
}

</script>

<style scoped></style>
