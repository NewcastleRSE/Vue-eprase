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
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="Javascript:void(0)" @click="menuSelect()">{{ isLoggedIn ? 'Save progress and log out' : 'Log in' }}</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { Dropdown } from 'bootstrap'
import { mapState } from 'pinia'
import { authenticationStore } from '../stores/authentication'

export default {
  name: "LoginInfo",
  computed: {
    ...mapState(authenticationStore, ['user', 'orgName', 'isLoggedIn'])
  },
  data() {
    return {
      loginInfoDd: null
    }
  },
  methods: {
    toggleDropdownMenu() {
      this.loginInfoDd.toggle()
    },
    menuSelect() {
      if (this.isLoggedIn) {
        //TODO save the current state
        this.$router.push('/logout')
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
