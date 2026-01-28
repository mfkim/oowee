import axios from "axios";

// 1. axios 인스턴스 생성
const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true, // 인증 정보 포함
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. 요청 인터셉터 (JWT)
// 요청을 보내기 전 토큰을 헤더에 저장
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. 응답 인터셉터 (에러 처리 공통화)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 서버에서 에러가 왔을 때 공통 처리 가능
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
