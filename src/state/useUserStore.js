import { create } from 'zustand';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import config from '../config';



export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  error: null,
  getUser: async (username) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${config.baseUrl}/users/by_username/${username}`);
      set({ user: response.data.data, loading: false });
      return response.data.data
    } catch (error) {
      if(error.response.status === 404){
        set({ user: null, loading: false });
      }
      return null
    }
  },
  updateUser: async (userData) => {
    set({ loading: true, error: null });
    try {
      const newUser = {
        id: uuidv4(), // 自动生成 UUID
        iconUrl: '/static/user.png', // 提供默认 iconUrl
        ...userData,
      };
      const response = await axios.post(`${config.baseUrl}/user`, newUser);
      set({ user: response.data.data, loading: false });
    } catch (error) {
      set({ error, loading: false });
    }
  },
  setUser: (userData) => { // 新的 action 用于设置用户信息
    set({ user: userData });
  },
}));