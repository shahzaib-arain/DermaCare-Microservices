import { useState, useCallback } from 'react';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends ApiState<T> {
  fetchData: (config: AxiosRequestConfig) => Promise<void>;
}

export const useApi = <T,>(): UseApiReturn<T> => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });
  const { logout } = useAuth();

  const fetchData = useCallback(async (config: AxiosRequestConfig) => {
    setState({ data: null, loading: true, error: null });

    try {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }

      const response: AxiosResponse<T> = await axios({
        ...config,
        baseURL: process.env.REACT_APP_API_BASE_URL,
      });

      setState({ data: response.data, loading: false, error: null });
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        logout();
      }

      setState({
        data: null,
        loading: false,
        error: axiosError.message || 'An error occurred',
      });
    }
  }, [logout]);

  return { ...state, fetchData };
};