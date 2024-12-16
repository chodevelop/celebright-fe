import axios from 'axios';

const baseURL = process.env.REACT_APP_BACKEND_URL;

const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const localUser: string | null = localStorage.getItem('user');
  const parsedUser = localUser ? JSON.parse(localUser) : null;
  console.log('req');

  if (parsedUser && parsedUser.accessToken) {
    // Bearer
    config.headers.Authorization = `Bearer ${parsedUser.accessToken}`;
  } else {
    config.headers.Authorization = null;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.log(originalRequest, 'originalRequest');

    // Access Token 만료
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log('call');

      try {
        // Refresh Token으로 Access Token 재발급 요청
        const refreshResponse = await axiosInstance.post(
          '/auth/refreshaccesstoken'
        );

        const newAccessToken = refreshResponse.data.accessToken;

        // Local Storage에 새 Access Token 저장
        localStorage.setItem(
          'user',
          JSON.stringify({ accessToken: newAccessToken })
        );
        // 새 Access Token으로 원래 요청 헤더 갱신
        // originalRequest.headers['Authorization'] = Bearer ${newAccessToken};

        // 새 Access Token으로 원래 요청 헤더 갱신
        originalRequest.headers['x-access-token'] = newAccessToken;
        return axiosInstance(originalRequest); // 원래 요청 재시도
      } catch (refreshError) {
        console.error('Refresh token expired or invalid');
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;