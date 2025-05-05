
// Базовый URL для API
const API_BASE_URL = 'https://api.chistota-service.ru/api/v1';

// Базовая функция для выполнения запросов
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  // Добавляем базовый URL
  const fullUrl = `${API_BASE_URL}${url}`;
  
  // Получаем токен из localStorage
  const token = localStorage.getItem('auth_token');
  
  // Настраиваем заголовки
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  };
  
  // Выполняем запрос
  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers
    });
    
    // Проверяем статус ответа
    if (response.status === 401) {
      // Очищаем локальное хранилище и перенаправляем на страницу входа
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      window.location.href = '/admin/login';
      throw new Error('Unauthorized');
    }
    
    // Если статус не 2xx, выбрасываем ошибку
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    
    // Проверяем, есть ли контент для парсинга
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return await response.text();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Сервис для работы с авторизацией
export const authService = {
  // Авторизация пользователя
  login: async (email: string, password: string) => {
    try {
      const data = await fetchWithAuth('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      
      const { token, user } = data;
      
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
      await fetchWithAuth('/auth/logout', { method: 'POST' });
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
      return await fetchWithAuth('/services');
    } catch (error) {
      throw error;
    }
  },
  
  // Получение конкретной услуги по ID
  getServiceById: async (id: number) => {
    try {
      return await fetchWithAuth(`/services/${id}`);
    } catch (error) {
      throw error;
    }
  },
  
  // Создание новой услуги
  createService: async (serviceData: any) => {
    try {
      return await fetchWithAuth('/services', {
        method: 'POST',
        body: JSON.stringify(serviceData)
      });
    } catch (error) {
      throw error;
    }
  },
  
  // Обновление существующей услуги
  updateService: async (id: number, serviceData: any) => {
    try {
      return await fetchWithAuth(`/services/${id}`, {
        method: 'PUT',
        body: JSON.stringify(serviceData)
      });
    } catch (error) {
      throw error;
    }
  },
  
  // Удаление услуги
  deleteService: async (id: number) => {
    try {
      return await fetchWithAuth(`/services/${id}`, {
        method: 'DELETE'
      });
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
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        queryParams.append(key, String(value));
      });
      
      const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
      return await fetchWithAuth(`/bookings${query}`);
    } catch (error) {
      throw error;
    }
  },
  
  // Получение бронирования по ID
  getBookingById: async (id: number) => {
    try {
      return await fetchWithAuth(`/bookings/${id}`);
    } catch (error) {
      throw error;
    }
  },
  
  // Создание нового бронирования
  createBooking: async (bookingData: any) => {
    try {
      return await fetchWithAuth('/bookings', {
        method: 'POST',
        body: JSON.stringify(bookingData)
      });
    } catch (error) {
      throw error;
    }
  },
  
  // Обновление статуса бронирования
  updateBookingStatus: async (id: number, status: string) => {
    try {
      return await fetchWithAuth(`/bookings/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
    } catch (error) {
      throw error;
    }
  },
  
  // Отмена бронирования
  cancelBooking: async (id: number, reason?: string) => {
    try {
      return await fetchWithAuth(`/bookings/${id}/cancel`, {
        method: 'POST',
        body: JSON.stringify({ reason })
      });
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
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        queryParams.append(key, String(value));
      });
      
      const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
      return await fetchWithAuth(`/clients${query}`);
    } catch (error) {
      throw error;
    }
  },
  
  // Получение клиента по ID
  getClientById: async (id: number) => {
    try {
      return await fetchWithAuth(`/clients/${id}`);
    } catch (error) {
      throw error;
    }
  },
  
  // Создание нового клиента
  createClient: async (clientData: any) => {
    try {
      return await fetchWithAuth('/clients', {
        method: 'POST',
        body: JSON.stringify(clientData)
      });
    } catch (error) {
      throw error;
    }
  },
  
  // Обновление данных клиента
  updateClient: async (id: number, clientData: any) => {
    try {
      return await fetchWithAuth(`/clients/${id}`, {
        method: 'PUT',
        body: JSON.stringify(clientData)
      });
    } catch (error) {
      throw error;
    }
  },
  
  // Получение истории заказов клиента
  getClientBookings: async (id: number) => {
    try {
      return await fetchWithAuth(`/clients/${id}/bookings`);
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
      return await fetchWithAuth('/stats/dashboard');
    } catch (error) {
      throw error;
    }
  },
  
  // Получение статистики по периоду
  getStatsByPeriod: async (startDate: string, endDate: string) => {
    try {
      return await fetchWithAuth(`/stats/period?start_date=${startDate}&end_date=${endDate}`);
    } catch (error) {
      throw error;
    }
  },
  
  // Получение статистики по услугам
  getServiceStats: async () => {
    try {
      return await fetchWithAuth('/stats/services');
    } catch (error) {
      throw error;
    }
  },
};

// Пример использования моков для разработки без реального API
export const useMockData = process.env.NODE_ENV === 'development';

// Экспорт стандартных функций для запросов (аналог axios)
export const apiClient = {
  get: (url: string, options = {}) => fetchWithAuth(url, { method: 'GET', ...options }),
  post: (url: string, data: any, options = {}) => fetchWithAuth(url, { 
    method: 'POST', 
    body: JSON.stringify(data),
    ...options 
  }),
  put: (url: string, data: any, options = {}) => fetchWithAuth(url, { 
    method: 'PUT', 
    body: JSON.stringify(data),
    ...options 
  }),
  patch: (url: string, data: any, options = {}) => fetchWithAuth(url, { 
    method: 'PATCH', 
    body: JSON.stringify(data),
    ...options 
  }),
  delete: (url: string, options = {}) => fetchWithAuth(url, { method: 'DELETE', ...options }),
};

export default apiClient;
