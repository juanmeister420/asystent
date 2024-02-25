import axios from 'axios'

const token = localStorage.getItem('token')

const instance = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : ''
  },
  validateStatus: function (status) {
    return status >= 200 && status < 500
  }
})

export default instance
