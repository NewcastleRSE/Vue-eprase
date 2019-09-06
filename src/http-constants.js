import axios from 'axios'
import VueAxios from 'vue-axios'
import Vue from 'vue'

Vue.use(VueAxios, axios);
let baseURL = 'http://localhost:6001/';

export const HTTP = axios.create(
  {
    baseURL: baseURL,
    headers: {}
  })
