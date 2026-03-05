import axios from 'axios';

let isRefreshing = false;
let waiters: {
  resolve: (value?: unknown) => void;
  reject: (err?: unknown) => void;
}[] = [];


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

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                waiters.push({resolve, reject});
            }).then(() => api(original_request)).catch((err) => Promise.reject(err));
        }

        original_request._retry = true;
        isRefreshing = true;

        try {
            await api.get('/auth/refresh');

            waiters.forEach(w => w.resolve());
            waiters = [];
            return api(original_request);
        } catch (err) {
            return Promise.reject(error);
        } finally {
            isRefreshing = false;
        }
    }
)