<template>
  <div class="dropdown">
    <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
      Logged in
    </button>
    <ul class="dropdown-menu">
      <li><a class="dropdown-item" href="#">Save progress and log out</a></li>
    </ul>
  </div>
  <!-- <div class="row">
    <div>
      <div class="p-2 float-end">
        <div v-if="isLoggedIn">
          <div class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" :title="orgName"
              data-bs-toggle="dropdown">
              <i class="bi bi-person-check-fill me-2"></i>Logged in as {{ user }}
            </button>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="#">Save progress and log out</a></li>             
            </ul>
          </div>
        </div>        
        <div v-if="!isLoggedIn">
          <div class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button"
              data-bs-toggle="dropdown">
              <i class="bi bi-person-fill-x me-2"></i>You are not logged in
            </button>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="#">Log in</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div> -->
</template>

<script>

import { mapState } from 'pinia'
import { authenticationStore } from '../stores/authentication'

export default {
  name: "LoginInfo",
  computed: {
    ...mapState(authenticationStore, ['user', 'orgName', 'isLoggedIn'])
  }
}

</script>

<style scoped></style>
