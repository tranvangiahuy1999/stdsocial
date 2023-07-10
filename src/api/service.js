import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL
});

axiosInstance.interceptors.request.use((config) => {
    // handle before request is sent
    const uploadImagePath = "/newfeed/add/image";
    const updatePostPath = "/newfeed/update";
    
    const token = sessionStorage.getItem("token");
    if (token) {
        config.headers['Authorization'] = 'Bearer ' + token;
    }
    if (config.url?.includes(uploadImagePath) || config.url?.includes(updatePostPath)) {
        config.headers['Content-Type'] = 'multipart/form-data';
    }
    return config;
}, (error) => {
    // handle request error
    return Promise.reject(error);
});

axiosInstance.interceptors.response.use((response) => {
    // handle response data
    return response;
}, (error) => {
    if (error.response.status === 401) {
        // Error handling
    }
    return Promise.reject(error);
});

export default axiosInstance;