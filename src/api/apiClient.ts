
import axios from 'axios';

// Базовый URL для API
const API_BASE_URL = 'https://api.chistota-service.ru/api/v1';

// Создаем инстанс axios с базовым URL и заголовками
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем интерцептор для добавления токена авторизации
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Интерцептор для обработки ошибок
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Обработка ошибки 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      // Очищаем локальное хранилище и перенаправляем на страницу входа
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      window.location.href = '/admin/login';
    }
    
    return Promise.reject(error);
  }
);

// Сервис для работы с авторизацией
export const authService = {
  // Авторизация пользователя
  login: async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      // Сохраняем токен и данные пользователя в localStorage
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(user));
      
      return { token, user };
    } catch (error) {
      throw error;
    }
  },
  
  // Выход пользователя
  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
      // Очищаем локальное хранилище
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    } catch (error) {
      // Даже в случае ошибки очищаем хранилище
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      throw error;
    }
  },
  
  // Проверка статуса авторизации
  checkAuth: () => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (!token || !userData) {
      return null;
    }
    
    try {
      return { token, user: JSON.parse(userData) };
    } catch (error) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      return null;
    }
  },
};

// Сервис для работы с услугами
export const servicesService = {
  // Получение списка всех услуг
  getAllServices: async () => {
    try {
      const response = await apiClient.get('/services');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Получение конкретной услуги по ID
  getServiceById: async (id: number) => {
    try {
      const response = await apiClient.get(`/services/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Создание новой услуги
  createService: async (serviceData: any) => {
    try {
      const response = await apiClient.post('/services', serviceData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Обновление существующей услуги
  updateService: async (id: number, serviceData: any) => {
    try {
      const response = await apiClient.put(`/services/${id}`, serviceData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Удаление услуги
  deleteService: async (id: number) => {
    try {
      const response = await apiClient.delete(`/services/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Сервис для работы с бронированиями
export const bookingsService = {
  // Получение всех бронирований
  getAllBookings: async (filters = {}) => {
    try {
      const response = await apiClient.get('/bookings', { params: filters });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Получение бронирования по ID
  getBookingById: async (id: number) => {
    try {
      const response = await apiClient.get(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Создание нового бронирования
  createBooking: async (bookingData: any) => {
    try {
      const response = await apiClient.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Обновление статуса бронирования
  updateBookingStatus: async (id: number, status: string) => {
    try {
      const response = await apiClient.patch(`/bookings/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Отмена бронирования
  cancelBooking: async (id: number, reason?: string) => {
    try {
      const response = await apiClient.post(`/bookings/${id}/cancel`, { reason });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Сервис для работы с клиентами
export const clientsService = {
  // Получение списка всех клиентов
  getAllClients: async (filters = {}) => {
    try {
      const response = await apiClient.get('/clients', { params: filters });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Получение клиента по ID
  getClientById: async (id: number) => {
    try {
      const response = await apiClient.get(`/clients/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Создание нового клиента
  createClient: async (clientData: any) => {
    try {
      const response = await apiClient.post('/clients', clientData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Обновление данных клиента
  updateClient: async (id: number, clientData: any) => {
    try {
      const response = await apiClient.put(`/clients/${id}`, clientData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Получение истории заказов клиента
  getClientBookings: async (id: number) => {
    try {
      const response = await apiClient.get(`/clients/${id}/bookings`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Сервис для работы со статистикой
export const statsService = {
  // Получение общей статистики
  getDashboardStats: async () => {
    try {
      const response = await apiClient.get('/stats/dashboard');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Получение статистики по периоду
  getStatsByPeriod: async (startDate: string, endDate: string) => {
    try {
      const response = await apiClient.get('/stats/period', {
        params: { start_date: startDate, end_date: endDate }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Получение статистики по услугам
  getServiceStats: async () => {
    try {
      const response = await apiClient.get('/stats/services');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default apiClient;
