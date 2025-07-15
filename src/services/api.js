import axios from 'axios';

// Configuração base da API
const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Serviços de Rotas
export const routeService = {
  // Listar todas as rotas
  getRoutes: async (userId = 1) => {
    const response = await api.get(`/routes?user_id=${userId}`);
    return response.data;
  },

  // Obter uma rota específica
  getRoute: async (routeId) => {
    const response = await api.get(`/routes/${routeId}`);
    return response.data;
  },

  // Criar nova rota
  createRoute: async (routeData) => {
    const response = await api.post('/routes', routeData);
    return response.data;
  },

  // Atualizar rota existente
  updateRoute: async (routeId, routeData) => {
    const response = await api.put(`/routes/${routeId}`, routeData);
    return response.data;
  },

  // Deletar rota
  deleteRoute: async (routeId) => {
    const response = await api.delete(`/routes/${routeId}`);
    return response.data;
  },

  // Exportar rota para PDF
  exportRouteToPDF: async (routeId) => {
    const response = await api.get(`/routes/${routeId}/export-pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Enviar notificação de rota
  sendRouteNotification: async (routeId) => {
    const response = await api.post(`/routes/${routeId}/send-notification`);
    return response.data;
  },
};

// Serviços de Pontos Turísticos
export const touristSpotService = {
  // Listar todos os pontos turísticos
  getTouristSpots: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await api.get(`/tourist-spots?${queryParams}`);
    return response.data;
  },

  // Obter um ponto turístico específico
  getTouristSpot: async (spotId) => {
    const response = await api.get(`/tourist-spots/${spotId}`);
    return response.data;
  },

  // Buscar pontos turísticos externos (via OpenStreetMap/Nominatim)
  searchExternalSpots: async (query) => {
    const response = await api.get(`/search-places?q=${encodeURIComponent(query)}`);
    return response.data;
  },
};

// Serviços de Usuário
export const userService = {
  // Obter usuário (para MVP, usar usuário padrão)
  getCurrentUser: async () => {
    return {
      id: 1,
      username: 'usuario_demo',
      email: 'demo@turismo.com',
      idioma_preferencial: 'PT'
    };
  },
};

// Serviços de Geolocalização
export const geolocationService = {
  // Obter posição atual do usuário
  getCurrentPosition: () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalização não é suportada pelo navegador'));
        return;
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 10000, // Aumentar timeout para 10 segundos
        maximumAge: 300000 // Cache por 5 minutos
      };

      console.log('🌍 Solicitando permissão de geolocalização...');

      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('✅ Localização obtida com sucesso:', {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
          
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          });
        },
        (error) => {
          console.error('❌ Erro de geolocalização:', error);
          
          // Personalizar mensagens de erro
          let errorMessage = 'Erro ao obter localização';
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Acesso à localização foi negado. Por favor, permita o acesso à sua localização.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Localização indisponível. Verifique se o GPS está ativado.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Tempo limite para obter localização. Tente novamente.';
              break;
          }
          
          const customError = new Error(errorMessage);
          customError.code = error.code;
          reject(customError);
        },
        options
      );
    });
  },

  // Verificar se geolocalização está disponível e com permissão
  checkPermission: async () => {
    if (!navigator.geolocation) {
      throw new Error('Geolocalização não é suportada pelo navegador');
    }

    if (navigator.permissions) {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        return permission.state; // 'granted', 'denied', 'prompt'
      } catch (error) {
        console.warn('Não foi possível verificar permissão de geolocalização:', error);
        return 'unknown';
      }
    }
    
    return 'unknown';
  },

  // Solicitar permissão de localização (mais amigável)
  requestLocation: async () => {
    console.log('🌍 Verificando permissões de geolocalização...');
    
    const permission = await geolocationService.checkPermission();
    console.log('📋 Status da permissão:', permission);
    
    if (permission === 'denied') {
      throw new Error('Acesso à localização foi negado anteriormente. Por favor, permita o acesso nas configurações do navegador.');
    }
    
    return geolocationService.getCurrentPosition();
  },
  watchPosition: (callback, errorCallback) => {
    if (!navigator.geolocation) {
      errorCallback(new Error('Geolocalização não é suportada pelo navegador'));
      return null;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    return navigator.geolocation.watchPosition(
      (position) => {
        callback({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      errorCallback,
      options
    );
  },

  // Parar de observar posição
  clearWatch: (watchId) => {
    if (watchId && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId);
    }
  }
};

export default api;

