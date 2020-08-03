import axios from 'axios'
import VueAxios from 'vue-axios'
import Vue from 'vue'

Vue.use(VueAxios, axios);
let baseURL = process.env.BASE_URL;

export const HTTP = axios.create(
  {
    baseURL: baseURL,
    headers: {}
  })
