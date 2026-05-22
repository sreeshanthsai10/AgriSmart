import axios from "axios";

// =========================
// BASE API INSTANCE
// =========================
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
  timeout: 10000 //  prevent hanging requests
});


// =========================
// REQUEST INTERCEPTOR
// =========================
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
  },
  (error) => Promise.reject(error)
);


// =========================
// RESPONSE INTERCEPTOR
// =========================
API.interceptors.response.use(
  (res) => res,
  (error) => {

    //  Auto logout on 401
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // optional: redirect
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);


export default API;