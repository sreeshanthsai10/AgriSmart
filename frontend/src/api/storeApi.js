import API from './api';

export const getStores = async (params) => {
  try {
    const res = await API.get('/api/v1/stores', { params });
    return res.data;
  } catch (err) {
    console.error("Store API error:", err);
    return { success: false, stores: [] };
  }
};