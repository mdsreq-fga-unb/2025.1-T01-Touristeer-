/**
 * Setup para testes dos componentes React
 * Configurações globais e utilitários para Testing Library
 */

import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Configurar timeouts para testes
configure({ testIdAttribute: 'data-testid' });

// Mock do geolocation API para testes
Object.defineProperty(global.navigator, 'geolocation', {
  value: {
    getCurrentPosition: jest.fn((success) =>
      success({
        coords: {
          latitude: -22.908333,
          longitude: -43.196388,
          accuracy: 10,
        },
        timestamp: Date.now(),
      })
    ),
    watchPosition: jest.fn(),
    clearWatch: jest.fn(),
  },
  configurable: true,
});

// Mock do localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock do sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock de APIs do browser que podem não estar disponíveis nos testes
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock do fetch para APIs externas
global.fetch = jest.fn();

// Limpar mocks após cada teste
afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  sessionStorage.clear();
});
