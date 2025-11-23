// src/api/config.ts
import axios from 'axios'

const API_BASE_URL = 'http://localhost:3001/api/v1'

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // This is important for cookies
  headers: {
    'Content-Type': 'application/json'
  }
})
