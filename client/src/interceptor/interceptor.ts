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
        console.log("INTERCEPT CALLED HERE");

        if (error.response.data.error !== 'Expired token') {
            console.log("SO DIFFERNET ERROR");
            return Promise.reject(error);
        }

        if (original_request._retry) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                waiters.push({resolve, reject});
            })
        }

        original_request._retry = true;
        isRefreshing = true;

        try {
            console.log("I AM ATTEMPTING A REFRESH AT THIS POINT");
            await axios.get('/api/auth/refresh', { withCredentials: true });
            console.log("REFRESH WAS RUN SUCCESSFULLY");

            waiters.forEach(w => w.resolve());
            waiters = [];
            console.log("I AM NOW RECALLING THE ORIGINAL REQUERST");
            return api(original_request);
        } catch (err) {
            console.log("THIS SHIT IS WRONG");
            return Promise.reject(error);
        } finally {
            isRefreshing = false;
        }
    }
)