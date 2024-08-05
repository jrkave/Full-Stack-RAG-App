{/* Interceptor: Intercepts requests and automatically adds correct headers so we don't need to write it repetetively */}
{/* Anytime we send a request, it will check if we have an access token, and will send our access token with the request */}

import axios from 'axios'
import { ACCESS_TOKEN } from './constants'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

api.interceptors.request.use(
    (config) => {
        {/* Look for access token in local storage */}
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

{/* Use this api object (rather than axios) to send all requests with tokens) */}
export default api