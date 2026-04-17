import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 120000, // 120s — multi-model inference can take more time
});

export async function analyzeXRay(imageFile) {
  const formData = new FormData();
  formData.append('file', imageFile);

  const response = await api.post('/predict-all', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
}

export async function generateGradCAM(imageFile) {
  const formData = new FormData();
  formData.append('file', imageFile);

  const response = await api.post('/gradcam', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
}

export default api;
