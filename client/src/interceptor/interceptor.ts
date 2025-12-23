import axios from 'axios';

export const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original_request = error.config;

        if (error.response.data.error !== 'Expired token') {
            return Promise.reject(error);
        }


        if (original_request._retry) {
            return Promise.reject(error);
        }

        original_request._retry = true;

        try {
            await axios.get('/api/auth/refresh');
        } catch (err) {
            return Promise.reject(error)
        }

    }
)