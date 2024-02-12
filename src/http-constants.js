import axios from 'axios'

export const HTTP = axios.create(
  {
    baseURL: process.env.BASE_URL,
    headers: {}
  })
