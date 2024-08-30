<template>
  <div class="row">
    <div>
      <div class="p-2 float-end">
        <div class="dropdown">
          <button ref="loginInfoBtn" class="btn btn-secondary dropdown-toggle" type="button" :title="orgName"
            @click="toggleDropdownMenu()" data-bs-toggle="dropdown">
            <i class="bi me-2" :class="isLoggedIn ? 'bi-person-fill-check' : 'bi-person-fill-x'"></i>{{ isLoggedIn ?
            'Logged in as ' + user : 'Not logged in' }}
          </button>
          <ul v-if="! isAdmin" class="dropdown-menu">
            <li>
              <a class="dropdown-item" href="Javascript:void(0)" @click="saveProgress">{{ isLoggedIn ? 'Save progress and log out' : 'Log in ' }}</a>
            </li>
          </ul>
          <ul v-if="isAdmin" class="dropdown-menu">
            <li v-if="$router.currentRoute.value.path != '/adminhome'">
              <a class="dropdown-item" href="Javascript:void(0)" @click="$router.push('/adminhome')">Admin Reports Home</a>
            </li>
            <li v-if="$router.currentRoute.value.path != '/usermanager'">
              <a class="dropdown-item" href="Javascript:void(0)" @click="$router.push('/usermanager')">Manage Users</a>
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
    ...mapState(authenticationStore, ['user', 'orgName', 'isLoggedIn', 'checkIsAdminUser']),
    exitModal() {
      return this.$refs.exitModal
    }
  },
  data() {
    return {
      loginInfoDd: null,
      isAdmin: false
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
    },    
    async checkAdmin() {
      this.isAdmin = await (async () => { return await this.checkIsAdminUser() })()
    }
  },  
  mounted() {
    this.loginInfoDd = new Dropdown(this.$refs.loginInfoBtn)
    this.checkAdmin()
  }
}

</script>

<style scoped></style>
