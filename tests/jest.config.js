/**
 * Configuração Jest para testes do Turistieer
 * Centraliza a configuração de testes na pasta tests/
 */

module.exports = {
  // Diretório raiz dos testes
  rootDir: '../',
  
  // Padrões de teste
  testMatch: [
    '<rootDir>/tests/**/*.test.{js,jsx}',
    '<rootDir>/tests/**/*.spec.{js,jsx}'
  ],
  
  // Ambiente de teste
  testEnvironment: 'jsdom',
  
  // Arquivos de setup
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  
  // Transformações
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  
  // Módulos a serem ignorados
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  
  // Diretórios para procurar módulos
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  
  // Extensões de arquivo
  moduleFileExtensions: ['js', 'jsx', 'json'],
  
  // Cobertura de código
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/serviceWorker.js',
    '!src/**/*.test.{js,jsx}'
  ],
  
  // Diretório de saída da cobertura
  coverageDirectory: '<rootDir>/reports/frontend_coverage',
  
  // Relatórios de cobertura
  coverageReporters: ['html', 'text', 'lcov'],
  
  // Limites de cobertura
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  
  // Configurações para testes em watch mode
  watchman: false,
  
  // Timeout para testes
  testTimeout: 10000,
  
  // Configurações verbose
  verbose: true
};
