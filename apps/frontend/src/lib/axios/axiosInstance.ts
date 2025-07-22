import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_HTTP_URL,
  withCredentials: true,
  headers: {
    "Content-type": "application/json",
  },
});

// axios.interceptors.request.use(
//   (config) => {
//     config.withCredentials = true

//     return config;
//   },
//   function (error) {
//     // Do something with request error
//     return Promise.reject(error);
//   }
// );
